"use client";

import { useEffect, useRef } from "react";

/**
 * VersionManager
 * 
 * Periodically checks /version.json to see if the server has a newer version.
 * If a new version is detected, it clears caches and reloads the page.
 */
export default function VersionManager() {
    // Use a ref to track if we're currently checking to avoid race conditions
    const isChecking = useRef(false);

    useEffect(() => {
        // Check immediately on mount
        checkVersion();

        // Check every 60 seconds
        const interval = setInterval(() => {
            checkVersion();
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const checkVersion = async () => {
        if (isChecking.current) return;

        // Don't check if offline
        if (typeof navigator !== "undefined" && !navigator.onLine) return;

        try {
            isChecking.current = true;

            // Fetch version.json with no-cache to get the truth from server
            const res = await fetch("/version.json?t=" + Date.now(), {
                cache: "no-store",
                headers: {
                    "Pragma": "no-cache",
                    "Cache-Control": "no-cache"
                }
            });

            if (!res.ok) return;

            const data = await res.json();
            const serverBuildId = data.buildId;

            if (!serverBuildId) return;

            const currentBuildId = localStorage.getItem("app_build_id");

            if (!currentBuildId) {
                // First run, store the build ID
                localStorage.setItem("app_build_id", serverBuildId);
            } else if (currentBuildId !== serverBuildId) {
                console.log(`New version detected: ${serverBuildId} (Current: ${currentBuildId}). Updating...`);

                // Update local storage
                localStorage.setItem("app_build_id", serverBuildId);

                // Clear caches
                if ("caches" in window) {
                    try {
                        const keys = await caches.keys();
                        await Promise.all(keys.map(key => caches.delete(key)));
                        console.log("Caches cleared.");
                    } catch (e) {
                        console.error("Failed to clear caches:", e);
                    }
                }

                // Unregister service workers to force update
                if ("serviceWorker" in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (const registration of registrations) {
                        await registration.unregister();
                    }
                }

                // Reload page
                window.location.reload();
            }
        } catch (e) {
            console.error("Failed to check version:", e);
        } finally {
            isChecking.current = false;
        }
    };

    return null; // This component renders nothing
}
