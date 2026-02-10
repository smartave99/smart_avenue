"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
    LayoutDashboard,
    Star,
    Zap,
    MousePointerClick,
    ArrowLeft,
    ChevronRight,
    Home,
    ExternalLink
} from "lucide-react";
import Link from "next/link";

const homepageSections = [
    {
        name: "Hero Section",
        description: "The main headline, subtitle, and background image at the top of the home page.",
        href: "/admin/content/hero",
        icon: LayoutDashboard,
        color: "text-brand-blue",
        bgColor: "bg-brand-blue/10"
    },
    {
        name: "Highlights",
        description: "Showcase key products or categories with a special section and rating highlights.",
        href: "/admin/content/highlights",
        icon: Star,
        color: "text-brand-gold",
        bgColor: "bg-brand-gold/10"
    },
    {
        name: "Features",
        description: "List the main benefits and services like store pickup and warranty.",
        href: "/admin/content/features",
        icon: Zap,
        color: "text-brand-lime",
        bgColor: "bg-brand-lime/10"
    },
    {
        name: "CTA Section",
        description: "The final 'Call to Action' section at the bottom of the home page.",
        href: "/admin/content/cta",
        icon: MousePointerClick,
        color: "text-brand-green",
        bgColor: "bg-brand-green/10"
    }
];

export default function StorefrontManagement() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/admin/login");
        }
    }, [authLoading, user, router]);

    if (authLoading || !user) {
        return null;
    }

    return (
        <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 tracking-tight">Homepage Management</h2>
                            <p className="text-gray-500 text-sm mt-1">Manage all sections of your storefront home page.</p>
                        </div>
                    </div>

                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View Live Store
                    </Link>
                </header>

                <div className="grid grid-cols-1 gap-4">
                    {homepageSections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <Link
                                key={section.href}
                                href={section.href}
                                className="group bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-gold/30 transition-all flex items-center gap-6"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${section.bgColor}`}>
                                    <Icon className={`w-7 h-7 ${section.color}`} />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-brand-green transition-colors">
                                        {section.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                                        {section.description}
                                    </p>
                                </div>

                                <div className="p-2 text-gray-300 group-hover:text-brand-gold transition-colors">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Info Note */}
                <div className="mt-8 p-6 bg-brand-gold/10 rounded-2xl border border-brand-gold/20 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0">
                        <Home className="w-5 h-5 text-brand-gold" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">Quick Tip</h4>
                        <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                            These sections control the dynamic content on your main landing page. Changes made here will be visible to all customers immediately after saving.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
