"use client";

import { AuthProvider } from "@/context/auth-context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {/* Full-screen overlay that covers the parent Header/Footer */}
            <div className="fixed inset-0 z-50 bg-gray-100">
                {children}
            </div>
        </AuthProvider>
    );
}
