"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getSiteConfig, updateSiteConfig } from "@/app/actions/site-config";
import { SiteConfig, ManifestConfig } from "@/types/site-config";
import { Loader2, ArrowLeft, Save, Smartphone, Palette } from "lucide-react";
import Link from "next/link";

export default function ManifestPage() {
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

    const updateManifest = (field: keyof ManifestConfig, value: string) => {
        if (!config) return;
        setConfig({
            ...config,
            manifest: {
                ...config.manifest,
                [field]: value
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
                            <Smartphone className="w-6 h-6 text-amber-600" />
                            PWA Manifest
                        </h1>
                        <p className="text-gray-500">Configure how your app looks when installed on devices</p>
                    </div>
                </div>

                {loading || !config ? (
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-6">

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-blue-500" />
                                App Identity
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
                                    <input
                                        type="text"
                                        value={config.manifest?.name || ""}
                                        onChange={(e) => updateManifest("name", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        placeholder="Full App Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
                                    <input
                                        type="text"
                                        value={config.manifest?.shortName || ""}
                                        onChange={(e) => updateManifest("shortName", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        placeholder="Short Name (Home Screen)"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={config.manifest?.description || ""}
                                        onChange={(e) => updateManifest("description", e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        placeholder="App description..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Palette className="w-5 h-5 text-purple-500" />
                                Theme & Display
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={config.manifest?.themeColor || "#000000"}
                                            onChange={(e) => updateManifest("themeColor", e.target.value)}
                                            className="h-10 w-10 p-0 border-0 rounded overflow-hidden"
                                        />
                                        <input
                                            type="text"
                                            value={config.manifest?.themeColor || ""}
                                            onChange={(e) => updateManifest("themeColor", e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={config.manifest?.backgroundColor || "#ffffff"}
                                            onChange={(e) => updateManifest("backgroundColor", e.target.value)}
                                            className="h-10 w-10 p-0 border-0 rounded overflow-hidden"
                                        />
                                        <input
                                            type="text"
                                            value={config.manifest?.backgroundColor || ""}
                                            onChange={(e) => updateManifest("backgroundColor", e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Mode</label>
                                    <select
                                        value={config.manifest?.display || "standalone"}
                                        onChange={(e) => updateManifest("display", e.target.value as ManifestConfig['display'])}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="standalone">Standalone (App-like)</option>
                                        <option value="fullscreen">Fullscreen</option>
                                        <option value="minimal-ui">Minimal UI</option>
                                        <option value="browser">Browser</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start URL</label>
                                    <input
                                        type="text"
                                        value={config.manifest?.startUrl || "/"}
                                        onChange={(e) => updateManifest("startUrl", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            {saved && (
                                <span className="text-green-600 text-sm font-medium">✓ Manifest saved!</span>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Manifest
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
