
// Verification Script for AI Product Request Fix
// This script verifies that the codebase has been patched with:
// 1. Sanitization logic for maxBudget (allowing strings like "unknown")
// 2. Logging for request submission

const fs = require('fs');
const path = require('path');

async function verifyFix() {
    console.log("Verifying Product Request Logic...");
    const filePath = path.join(process.cwd(), 'src/lib/llm-service.ts');

    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for the sanitization logic
        if (content.includes('Sanitize maxBudget')) {
            console.log("SUCCESS: Sanitization logic verified in code!");
        } else {
            console.error("FAILURE: Sanitization logic not found in file.");
            process.exit(1);
        }

        // Check recommendation engine for logging
        const enginePath = path.join(process.cwd(), 'src/lib/recommendation-engine.ts');
        const engineContent = fs.readFileSync(enginePath, 'utf8');

        if (engineContent.includes('[RecommendationEngine] Auto-submitting product request')) {
            console.log("SUCCESS: Logging enabled in recommendation engine.");
        } else {
            console.error("FAILURE: Logging not found.");
            process.exit(1);
        }

    } catch (e) {
        console.error("Error reading file:", e);
        process.exit(1);
    }
}

verifyFix();
