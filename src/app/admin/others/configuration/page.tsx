"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getSiteConfig, updateSiteConfig } from "@/app/actions/site-config";
import { SiteConfig, SystemConfig } from "@/types/site-config";
import { Loader2, ArrowLeft, Save, ShieldAlert, FileCode, Terminal } from "lucide-react";
import Link from "next/link";

export default function ConfigurationPage() {
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

    const updateSystemConfig = (field: keyof SystemConfig, value: any) => {
        if (!config) return;
        setConfig({
            ...config,
            system: {
                ...config.system,
                [field]: value
            }
        });
    };

    const updateScripts = (field: keyof SystemConfig['scripts'], value: string) => {
        if (!config) return;
        setConfig({
            ...config,
            system: {
                ...config.system,
                scripts: {
                    ...config.system.scripts,
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
                            <ShieldAlert className="w-6 h-6 text-amber-600" />
                            System Configuration
                        </h1>
                        <p className="text-gray-500">Manage maintenance mode, SEO files, and tracking scripts</p>
                    </div>
                </div>

                {loading || !config ? (
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-6">

                        {/* Maintenance Mode */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-red-500" />
                                Maintenance Controls
                            </h2>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <label htmlFor="maintenance-mode" className="font-medium text-gray-900 block">
                                        Enable Maintenance Mode
                                    </label>
                                    <p className="text-sm text-gray-500 mt-1">
                                        When enabled, only administrators can access the site. Visitors will see a "Under Maintenance" page.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="maintenance-mode"
                                        checked={config.system?.maintenanceMode || false}
                                        onChange={(e) => updateSystemConfig("maintenanceMode", e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                </label>
                            </div>
                        </div>

                        {/* Robots & Sitemap */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FileCode className="w-5 h-5 text-blue-500" />
                                SEO Files
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Robots.txt Content
                                    </label>
                                    <textarea
                                        value={config.system?.robotsTxt || ""}
                                        onChange={(e) => updateSystemConfig("robotsTxt", e.target.value)}
                                        rows={6}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                                        placeholder="User-agent: *&#10;Allow: /"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Directly edit the content served at /robots.txt
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Scripts & Tracking */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-gray-700" />
                                Scripts & Tracking
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Google Analytics ID
                                    </label>
                                    <input
                                        type="text"
                                        value={config.system?.scripts?.googleAnalyticsId || ""}
                                        onChange={(e) => updateScripts("googleAnalyticsId", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        placeholder="G-XXXXXXXXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Facebook Pixel ID
                                    </label>
                                    <input
                                        type="text"
                                        value={config.system?.scripts?.facebookPixelId || ""}
                                        onChange={(e) => updateScripts("facebookPixelId", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        placeholder="1234567890"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Custom Head Scripts
                                    </label>
                                    <textarea
                                        value={config.system?.scripts?.customHeadScript || ""}
                                        onChange={(e) => updateScripts("customHeadScript", e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                                        placeholder="<script>...</script>"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Injected at the end of the &lt;head&gt; tag. Be careful with syntax errors.
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Custom Body Scripts
                                    </label>
                                    <textarea
                                        value={config.system?.scripts?.customBodyScript || ""}
                                        onChange={(e) => updateScripts("customBodyScript", e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                                        placeholder="<script>...</script>"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Injected at the end of the &lt;body&gt; tag.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            {saved && (
                                <span className="text-green-600 text-sm font-medium">✓ System settings saved successfully!</span>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Configuration
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
