"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getSiteConfig, updateSiteConfig } from "@/app/actions/site-config";
import { SiteConfig, FrontendLabels } from "@/types/site-config";
import { Loader2, ArrowLeft, Save, Tag, Type } from "lucide-react";
import Link from "next/link";

export default function LabelsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/admin/login");
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        if (user) {
            loadConfig();
        }
    }, [user]);

    const loadConfig = async () => {
        setLoading(true);
        try {
            const data = await getSiteConfig();
            setConfig(data);
        } catch (error) {
            console.error("Failed to load config:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!config) return;

        setSaving(true);
        setSaved(false);

        const result = await updateSiteConfig(config);

        if (result.success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } else {
            alert("Failed to save: " + (result.error || "Unknown error"));
        }
        setSaving(false);
    };

    const updateLabel = (section: keyof FrontendLabels, field: string, value: string) => {
        if (!config || !config.labels) return;

        setConfig({
            ...config,
            labels: {
                ...config.labels,
                [section]: {
                    ...config.labels[section],
                    [field]: value
                }
            }
        });
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Tag className="w-6 h-6 text-amber-600" />
                            Frontend Labels
                        </h1>
                        <p className="text-gray-500">Customize text, buttons, and placeholders across the site</p>
                    </div>
                </div>

                {loading || !config ? (
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-6">

                        {/* Placeholders */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Type className="w-5 h-5 text-gray-500" />
                                Input Placeholders
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Bar</label>
                                    <input
                                        type="text"
                                        value={config.labels?.placeholders?.search || ""}
                                        onChange={(e) => updateLabel("placeholders", "search", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Input</label>
                                    <input
                                        type="text"
                                        value={config.labels?.placeholders?.email || ""}
                                        onChange={(e) => updateLabel("placeholders", "email", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">B</div>
                                Button Text
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subscribe Button</label>
                                    <input
                                        type="text"
                                        value={config.labels?.buttons?.subscribe || ""}
                                        onChange={(e) => updateLabel("buttons", "subscribe", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">View Collection</label>
                                    <input
                                        type="text"
                                        value={config.labels?.buttons?.viewCollection || ""}
                                        onChange={(e) => updateLabel("buttons", "viewCollection", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Shop Now</label>
                                    <input
                                        type="text"
                                        value={config.labels?.buttons?.shopNow || ""}
                                        onChange={(e) => updateLabel("buttons", "shopNow", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Button</label>
                                    <input
                                        type="text"
                                        value={config.labels?.buttons?.search || ""}
                                        onChange={(e) => updateLabel("buttons", "search", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Type className="w-5 h-5 text-gray-500" />
                                System Messages & Microcopy
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Success Message</label>
                                    <input
                                        type="text"
                                        value={config.labels?.messages?.success || ""}
                                        onChange={(e) => updateLabel("messages", "success", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Error Message</label>
                                    <input
                                        type="text"
                                        value={config.labels?.messages?.error || ""}
                                        onChange={(e) => updateLabel("messages", "error", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loading Text</label>
                                    <input
                                        type="text"
                                        value={config.labels?.messages?.loading || ""}
                                        onChange={(e) => updateLabel("messages", "loading", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Footer: Connect Title</label>
                                    <input
                                        type="text"
                                        value={config.labels?.messages?.footerConnect || ""}
                                        onChange={(e) => updateLabel("messages", "footerConnect", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Footer: No Spam Text</label>
                                    <input
                                        type="text"
                                        value={config.labels?.messages?.footerNoSpam || ""}
                                        onChange={(e) => updateLabel("messages", "footerNoSpam", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                                    <input
                                        type="text"
                                        value={config.labels?.messages?.copyright || ""}
                                        onChange={(e) => updateLabel("messages", "copyright", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            {saved && (
                                <span className="text-green-600 text-sm font-medium">✓ Labels saved successfully!</span>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Labels
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
