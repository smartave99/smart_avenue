/**
 * API Key Manager
 * 
 * Manages multiple API keys with automatic rotation, rate limit detection,
 * and health monitoring for high availability.
 */

import {
    APIKeyConfig,
    APIKeyManagerStatus,
    KeyHealthStatus,
    APIKeyExhaustedError
} from "@/types/assistant-types";

// Cooldown duration in milliseconds after a key is rate-limited
const RATE_LIMIT_COOLDOWN_MS = 60 * 1000; // 1 minute

// Cooldown duration after consecutive errors
const ERROR_COOLDOWN_MS = 30 * 1000; // 30 seconds

// Max consecutive errors before key cooldown
const MAX_CONSECUTIVE_ERRORS = 3;

class APIKeyManager {
    private keys: APIKeyConfig[] = [];
    private activeKeyIndex: number = 0;
    private lastRotation: Date | null = null;
    private initialized: boolean = false;

    constructor() {
        this.initializeKeys();
    }

    private initializeKeys(): void {
        if (this.initialized) return;

        const keyEnvVars = [
            process.env.GEMINI_API_KEY_1,
            process.env.GEMINI_API_KEY_2,
            process.env.GEMINI_API_KEY_3,
        ];

        this.keys = keyEnvVars
            .filter((key): key is string => !!key && key.trim() !== "")
            .map((key, index) => ({
                key: key.trim(),
                index,
                callCount: 0,
                lastUsed: null,
                errorCount: 0,
                consecutiveErrors: 0,
                rateLimited: false,
                cooldownUntil: null,
            }));

        if (this.keys.length === 0) {
            console.warn("[APIKeyManager] No API keys configured. Set GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.");
        } else {
            console.log(`[APIKeyManager] Initialized with ${this.keys.length} API key(s)`);
        }

        this.initialized = true;
    }

    /**
     * Get the current active API key, rotating if necessary
     */
    public getActiveKey(): string {
        if (this.keys.length === 0) {
            throw new APIKeyExhaustedError("No API keys configured");
        }

        // Find a healthy key
        const healthyKey = this.findHealthyKey();
        if (!healthyKey) {
            throw new APIKeyExhaustedError();
        }

        return healthyKey.key;
    }

    /**
     * Find the next healthy key (not rate-limited, not in cooldown)
     */
    private findHealthyKey(): APIKeyConfig | null {
        const now = new Date();

        // First, try to use the current active key if healthy
        const activeKey = this.keys[this.activeKeyIndex];
        if (activeKey && this.isKeyHealthy(activeKey, now)) {
            return activeKey;
        }

        // Otherwise, find any healthy key
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            if (this.isKeyHealthy(key, now)) {
                this.rotateToKey(i);
                return key;
            }
        }

        // Check if any keys can be recovered from cooldown
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            if (key.cooldownUntil && key.cooldownUntil <= now) {
                // Reset key state after cooldown
                key.cooldownUntil = null;
                key.rateLimited = false;
                key.consecutiveErrors = 0;
                this.rotateToKey(i);
                return key;
            }
        }

        return null;
    }

    private isKeyHealthy(key: APIKeyConfig, now: Date): boolean {
        // Key is in cooldown
        if (key.cooldownUntil && key.cooldownUntil > now) {
            return false;
        }

        // Key is currently rate-limited
        if (key.rateLimited) {
            return false;
        }

        return true;
    }

    private rotateToKey(index: number): void {
        if (index !== this.activeKeyIndex) {
            console.log(`[APIKeyManager] Rotating from key ${this.activeKeyIndex} to key ${index}`);
            this.activeKeyIndex = index;
            this.lastRotation = new Date();
        }
    }

    /**
     * Mark that the key was used successfully
     */
    public markKeySuccess(key: string): void {
        const keyConfig = this.keys.find(k => k.key === key);
        if (keyConfig) {
            keyConfig.callCount++;
            keyConfig.lastUsed = new Date();
            keyConfig.consecutiveErrors = 0;
        }
    }

    /**
     * Mark that the key encountered an error
     */
    public markKeyFailed(key: string): void {
        const keyConfig = this.keys.find(k => k.key === key);
        if (keyConfig) {
            keyConfig.errorCount++;
            keyConfig.consecutiveErrors++;
            keyConfig.lastUsed = new Date();

            // Put key in cooldown after too many consecutive errors
            if (keyConfig.consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
                console.warn(`[APIKeyManager] Key ${keyConfig.index} reached max consecutive errors, entering cooldown`);
                keyConfig.cooldownUntil = new Date(Date.now() + ERROR_COOLDOWN_MS);
            }
        }
    }

    /**
     * Mark that the key was rate-limited (429 response)
     */
    public markKeyRateLimited(key: string): void {
        const keyConfig = this.keys.find(k => k.key === key);
        if (keyConfig) {
            console.warn(`[APIKeyManager] Key ${keyConfig.index} rate-limited, entering cooldown`);
            keyConfig.rateLimited = true;
            keyConfig.cooldownUntil = new Date(Date.now() + RATE_LIMIT_COOLDOWN_MS);
            keyConfig.lastUsed = new Date();
        }
    }

    /**
     * Get health status for monitoring
     */
    public getHealthStatus(): APIKeyManagerStatus {
        const now = new Date();

        return {
            totalKeys: this.keys.length,
            activeKeyIndex: this.activeKeyIndex,
            lastRotation: this.lastRotation,
            keys: this.keys.map((key): KeyHealthStatus => ({
                index: key.index,
                maskedKey: this.maskKey(key.key),
                callCount: key.callCount,
                isActive: key.index === this.activeKeyIndex,
                isHealthy: this.isKeyHealthy(key, now),
                rateLimited: key.rateLimited,
                cooldownRemaining: key.cooldownUntil
                    ? Math.max(0, Math.ceil((key.cooldownUntil.getTime() - now.getTime()) / 1000))
                    : null,
            })),
        };
    }

    private maskKey(key: string): string {
        if (key.length <= 8) return "****";
        return key.substring(0, 4) + "****" + key.substring(key.length - 4);
    }

    /**
     * Check if manager has any configured keys
     */
    public hasKeys(): boolean {
        return this.keys.length > 0;
    }

    /**
     * Get total number of configured keys
     */
    public getKeyCount(): number {
        return this.keys.length;
    }
}

// Singleton instance
let apiKeyManagerInstance: APIKeyManager | null = null;

export function getAPIKeyManager(): APIKeyManager {
    if (!apiKeyManagerInstance) {
        apiKeyManagerInstance = new APIKeyManager();
    }
    return apiKeyManagerInstance;
}

export { APIKeyManager };
