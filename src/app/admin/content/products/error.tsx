"use client";

import { useEffect } from "react";

export default function ProductsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error with digest for debugging
        console.error("Products page error:", error.message, "Digest:", error.digest);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-red-100 max-w-md text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
                <p className="text-gray-600 mb-4">
                    There was an error loading the products page.
                    {error.digest && (
                        <span className="block text-xs text-gray-400 mt-2 font-mono bg-gray-100 p-1 rounded">
                            Error ID: {error.digest}
                        </span>
                    )}
                </p>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium shadow-sm"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
