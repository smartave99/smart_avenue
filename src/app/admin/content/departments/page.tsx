"use client";

import { useState, useEffect } from "react";
import {
    getDepartments,
    updateDepartments,
    getSiteContent,
    updateSiteContent,
    getCategories,
    DepartmentContent,
    DepartmentsPageContent,
    Category
} from "@/app/actions";
import { Plus, Trash2, Save, Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

import CloudinaryUpload from "@/components/CloudinaryUpload";

const defaultPageContent: DepartmentsPageContent = {
    heroTitle: "Our Departments",
    heroSubtitle: "Curated collections for the modern lifestyle.",
    heroImage: "",
    heroLabel: "Explore Zones"
};

export default function DepartmentsAdminPage() {
    const { user, loading: authLoading, role, permissions } = useAuth();
    const router = useRouter();

    const [departments, setDepartments] = useState<DepartmentContent[]>([]);
    const [pageContent, setPageContent] = useState<DepartmentsPageContent>(defaultPageContent);
    const [categories, setCategories] = useState<Category[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Authorization check
    const hasAccess = role?.toLowerCase() === "admin" || permissions?.includes("*") || permissions?.includes("departments");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/admin/login");
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [deptData, siteData, catData] = await Promise.all([
                getDepartments(),
                getSiteContent<DepartmentsPageContent>("departments-page"),
                getCategories()
            ]);

            setDepartments(deptData);
            setCategories(catData);
            if (siteData) {
                setPageContent({ ...defaultPageContent, ...siteData });
            }
        } catch (err) {
            setError("Failed to load departments data");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!hasAccess) {
            setError("You do not have permission to save changes.");
            return;
        }

        setIsSaving(true);
        setError("");
        setSuccess("");
        try {
            const [deptResult, siteResult] = await Promise.all([
                updateDepartments(departments),
                updateSiteContent("departments-page", pageContent as unknown as Record<string, unknown>)
            ]);

            if (deptResult.success && siteResult.success) {
                setSuccess("All changes updated successfully!");
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError(deptResult.error || siteResult.error || "Failed to save some changes");
            }
        } catch (err) {
            setError("An error occurred while saving");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const addDepartment = () => {
        setDepartments([
            ...departments,
            {
                id: crypto.randomUUID(),
                title: "New Department",
                description: "Description",
                image: "",
                icon: "Package",
                link: ""
            }
        ]);
    };

    const removeDepartment = (id: string) => {
        setDepartments(departments.filter(d => d.id !== id));
    };

    const updateDepartment = (id: string, field: keyof DepartmentContent, value: string) => {
        setDepartments(departments.map(d =>
            d.id === id ? { ...d, [field]: value } : d
        ));
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-brand-dark">Manage Departments</h1>
                            <p className="text-slate-500">Edit the public departments page and department cards.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasAccess}
                        className="flex items-center gap-2 bg-brand-blue text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-blue/90 disabled:opacity-50 transition-all shadow-lg shadow-brand-blue/20"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save All Changes
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
                        <span className="font-bold">Error:</span> {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl border border-green-100 flex items-center gap-2">
                        <span className="font-bold">Success:</span> {success}
                    </div>
                )}

                {/* Hero Section Editor */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-brand-blue" />
                        Hero Section
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hero Label</label>
                                <input
                                    type="text"
                                    value={pageContent.heroLabel || ""}
                                    onChange={(e) => setPageContent({ ...pageContent, heroLabel: e.target.value })}
                                    placeholder="e.g., Explore Zones"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hero Title</label>
                                <input
                                    type="text"
                                    value={pageContent.heroTitle}
                                    onChange={(e) => setPageContent({ ...pageContent, heroTitle: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hero Subtitle</label>
                                <textarea
                                    value={pageContent.heroSubtitle}
                                    onChange={(e) => setPageContent({ ...pageContent, heroSubtitle: e.target.value })}
                                    rows={2}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 resize-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hero Background Image</label>
                            <CloudinaryUpload
                                onUpload={(files) => {
                                    if (files[0]) setPageContent({ ...pageContent, heroImage: files[0].url });
                                }}
                                folder="departments"
                                maxFiles={1}
                                currentImages={pageContent.heroImage ? [pageContent.heroImage] : []}
                                onRemoveImage={() => setPageContent({ ...pageContent, heroImage: "" })}
                            />
                        </div>
                    </div>
                </section>

                {/* Department Items Editor */}
                <h2 className="text-xl font-bold text-gray-800 mb-6">Department Cards</h2>
                <div className="grid gap-6">
                    {departments.map((dept) => (
                        <div key={dept.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1 grid gap-4 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={dept.title}
                                                onChange={(e) => updateDepartment(dept.id, "title", e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                                            <textarea
                                                value={dept.description}
                                                onChange={(e) => updateDepartment(dept.id, "description", e.target.value)}
                                                rows={3}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Link to Category</label>
                                            <select
                                                value={dept.link || ""}
                                                onChange={(e) => updateDepartment(dept.id, "link", e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                                            >
                                                <option value="">Select a Category (Custom Link)</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={`/products?category=${cat.id}`}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                value={dept.link || ""}
                                                onChange={(e) => updateDepartment(dept.id, "link", e.target.value)}
                                                placeholder="Or enter custom path: /custom-page"
                                                className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Department Card Image</label>
                                            <CloudinaryUpload
                                                onUpload={(files) => {
                                                    if (files[0]) updateDepartment(dept.id, "image", files[0].url);
                                                }}
                                                folder="departments"
                                                maxFiles={1}
                                                currentImages={dept.image ? [dept.image] : []}
                                                onRemoveImage={() => updateDepartment(dept.id, "image", "")}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeDepartment(dept.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove Department"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={addDepartment}
                        className="flex items-center gap-2 text-slate-500 hover:text-brand-blue font-medium px-4 py-2 rounded-lg hover:bg-brand-blue/5 transition-colors border border-dashed border-slate-300 hover:border-brand-blue/50"
                    >
                        <Plus className="w-4 h-4" />
                        Add Department Card
                    </button>
                </div>
            </div>
        </div>
    );
}
