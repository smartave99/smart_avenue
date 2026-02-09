/**
 * LLM Service
 * 
 * Wrapper for LLM providers (Google, OpenAI, Anthropic) with automatic key rotation and error handling.
 */

import { getAPIKeyManager } from "./api-key-manager";
import {
    LLMIntentResponse,
    LLMServiceError,
    APIKeyExhaustedError,
    LLMProvider
} from "@/types/assistant-types";
import { Product, Category } from "@/app/actions";
import { getProvider } from "./llm-providers";

const MAX_RETRIES = 3;

/**
 * Make a request to an LLM provider with automatic key rotation on failure
 */
async function callLLM(prompt: string, preferredProvider: LLMProvider = "google", retryCount: number = 0): Promise<string> {
    const keyManager = getAPIKeyManager();

    // In future we could fallback: const provider = keyManager.hasKeys(preferredProvider) ? preferredProvider : 'google';

    // For now we assume the user checks available providers
    const providerId = preferredProvider;

    // Check if we have any keys for this provider
    if (!keyManager.hasKeys(providerId)) {
        // If the requested provider isn't available, check if we can fallback to Google
        // This makes the transition smoother if user hasn't set up new keys yet
        if (providerId !== "google" && keyManager.hasKeys("google")) {
            console.log(`[LLMService] Provider ${providerId} has no keys, falling back to google`);
            return callLLM(prompt, "google", retryCount);
        }

        throw new APIKeyExhaustedError(`No API keys configured for provider: ${providerId}`);
    }

    let apiKey: string;
    try {
        apiKey = keyManager.getActiveKey(providerId);
    } catch (error) {
        // If active keys are exhausted for this provider, try fallback
        if (providerId !== "google" && keyManager.hasKeys("google")) {
            console.log(`[LLMService] Provider ${providerId} exhausted, falling back to google`);
            return callLLM(prompt, "google", retryCount);
        }
        throw error;
    }

    const provider = getProvider(providerId);

    try {
        const text = await provider.generateContent(prompt, apiKey);
        keyManager.markKeySuccess(apiKey);
        return text;
    } catch (error) {
        if (error instanceof LLMServiceError && error.isRateLimited) {
            // Rate limited
            keyManager.markKeyRateLimited(apiKey);

            if (retryCount < MAX_RETRIES) {
                console.log(`[LLMService] Rate limited (${providerId}), retrying with new key (attempt ${retryCount + 1})`);
                return callLLM(prompt, providerId, retryCount + 1);
            }

            // If all keys for this provider are rate limited, try fallback
            if (providerId !== "google" && keyManager.hasKeys("google")) {
                console.log(`[LLMService] All ${providerId} keys rate limited, falling back to google`);
                return callLLM(prompt, "google", 0);
            }

            throw new LLMServiceError(`Rate limit exceeded on all available ${providerId} keys`, 429);
        }

        // Other errors
        keyManager.markKeyFailed(apiKey);

        if (retryCount < MAX_RETRIES) {
            console.log(`[LLMService] Request failed, retrying (attempt ${retryCount + 1})`);
            return callLLM(prompt, providerId, retryCount + 1);
        }

        throw error;
    }
}

/**
 * Parse JSON from LLM response, handling markdown code blocks
 */
function parseJSONFromResponse<T>(response: string): T {
    // Remove markdown code blocks if present
    let cleaned = response.trim();
    if (cleaned.startsWith("```json")) {
        cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
        cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    try {
        return JSON.parse(cleaned);
    } catch {
        // If it's not valid JSON, it might be a partial response or error text
        // We'll throw but log the response for debugging if needed
        throw new LLMServiceError(`Failed to parse LLM response as JSON: ${response.substring(0, 100)}...`);
    }
}

/**
 * Analyze user query to extract intent
 */
export async function analyzeIntent(
    query: string,
    categories: Category[],
    provider: LLMProvider = "google"
): Promise<LLMIntentResponse> {
    const categoryList = categories.map(c => `- ${c.name} (ID: ${c.id})`).join("\n");

    const prompt = `You are a product recommendation assistant for a retail store called "Smart Avenue" in India.

Analyze the following customer query and extract their intent.

Available product categories:
${categoryList}

Customer query: "${query}"

Respond with a JSON object (and nothing else) in this exact format:
{
  "category": "category ID from the list above, or null if unclear",
  "subcategory": "subcategory ID if applicable, or null",
  "requirements": ["list of specific requirements extracted from the query"],
  "budgetMin": null or number in INR,
  "budgetMax": null or number in INR (e.g., if they say "under 500", set this to 500),
  "preferences": ["any stated preferences like 'premium', 'simple', 'colorful', etc."],
  "useCase": "brief description of what they want to use the product for",
  "confidence": 0.0 to 1.0 indicating how confident you are in understanding their intent
}`;

    const response = await callLLM(prompt, provider);
    return parseJSONFromResponse<LLMIntentResponse>(response);
}

/**
 * Score and rank products for the user's needs
 */
export async function rankProducts(
    query: string,
    products: Product[],
    intent: LLMIntentResponse,
    provider: LLMProvider = "google"
): Promise<Array<{ productId: string; matchScore: number; highlights: string[]; whyRecommended: string }>> {
    if (products.length === 0) {
        return [];
    }

    const productList = products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        tags: p.tags,
    }));

    const prompt = `You are a product recommendation assistant for Smart Avenue retail store.

Customer query: "${query}"

Intent analysis:
- Use case: ${intent.useCase}
- Requirements: ${intent.requirements.join(", ") || "none specified"}
- Preferences: ${intent.preferences.join(", ") || "none specified"}
- Budget: ${intent.budgetMin ? `₹${intent.budgetMin}` : "any"} - ${intent.budgetMax ? `₹${intent.budgetMax}` : "any"}

Available products:
${JSON.stringify(productList, null, 2)}

Rank the top 3-5 most suitable products for this customer. For each product, explain why it matches their needs.

Respond with a JSON array (and nothing else) in this exact format:
[
  {
    "productId": "the product ID",
    "matchScore": 0-100 indicating how well it matches,
    "highlights": ["key features that match their needs"],
    "whyRecommended": "A 1-2 sentence explanation of why this product is recommended"
  }
]

Only include products that are relevant. If no products match well, return an empty array.`;

    const response = await callLLM(prompt, provider);
    return parseJSONFromResponse<Array<{ productId: string; matchScore: number; highlights: string[]; whyRecommended: string }>>(response);
}

/**
 * Generate a summary response for the user
 */
export async function generateSummary(
    query: string,
    recommendationCount: number,
    topProductName: string | null,
    provider: LLMProvider = "google"
): Promise<string> {
    if (recommendationCount === 0) {
        return "I couldn't find specific products matching your requirements. Could you provide more details about what you're looking for?";
    }

    const prompt = `You are a friendly product recommendation assistant for Smart Avenue retail store in India.

Customer asked: "${query}"

You found ${recommendationCount} product recommendation(s)${topProductName ? `, with "${topProductName}" being the top match` : ""}.

Write a brief, friendly 1-2 sentence summary to introduce the recommendations. Be helpful and conversational. Do not use markdown formatting.`;

    const response = await callLLM(prompt, provider);
    return response.trim().replace(/```/g, "").replace(/^["']|["']$/g, "");
}

/**
 * Combined ranking and summary generation in a single LLM call
 * Reduces API calls from 3 to 2 for better performance
 */
export async function rankAndSummarize(
    query: string,
    products: Product[],
    intent: LLMIntentResponse,
    provider: LLMProvider = "google"
): Promise<{
    rankings: Array<{ productId: string; matchScore: number; highlights: string[]; whyRecommended: string }>;
    summary: string;
}> {
    if (products.length === 0) {
        return {
            rankings: [],
            summary: "I couldn't find specific products matching your requirements. Could you provide more details about what you're looking for?",
        };
    }

    const productList = products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        tags: p.tags,
    }));

    const prompt = `You are a product recommendation assistant for Smart Avenue retail store in India.

Customer query: "${query}"

Intent analysis:
- Use case: ${intent.useCase}
- Requirements: ${intent.requirements.join(", ") || "none specified"}
- Preferences: ${intent.preferences.join(", ") || "none specified"}
- Budget: ${intent.budgetMin ? `₹${intent.budgetMin}` : "any"} - ${intent.budgetMax ? `₹${intent.budgetMax}` : "any"}

Available products:
${JSON.stringify(productList, null, 2)}

Do two things:
1. Rank the top 3-5 most suitable products for this customer
2. Write a brief, friendly 1-2 sentence summary to introduce the recommendations

Respond with a JSON object (and nothing else) in this exact format:
{
  "rankings": [
    {
      "productId": "the product ID",
      "matchScore": 0-100 indicating how well it matches,
      "highlights": ["key features that match their needs"],
      "whyRecommended": "A 1-2 sentence explanation"
    }
  ],
  "summary": "A brief, friendly 1-2 sentence summary for the customer"
}

Only include relevant products. If no products match well, return empty rankings.`;

    const response = await callLLM(prompt, provider);
    return parseJSONFromResponse<{
        rankings: Array<{ productId: string; matchScore: number; highlights: string[]; whyRecommended: string }>;
        summary: string;
    }>(response);
}
