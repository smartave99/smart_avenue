"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ClubTier } from "@/app/club-actions";


interface ClientClubTiersProps {
    tiers: ClubTier[];
}

export default function ClientClubTiers({ tiers }: ClientClubTiersProps) {
    if (tiers.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
                <p className="text-gray-500 text-lg">Club tiers are currently being updated. Please check back soon.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, index) => (
                <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`relative rounded-3xl p-8 border ${tier.recommended ? 'border-brand-gold shadow-2xl scale-105 z-10 bg-white' : 'border-gray-100 bg-white shadow-lg'} flex flex-col`}
                >
                    {tier.recommended && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            Most Popular
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-2xl font-serif font-bold text-gray-900">{tier.name}</h3>
                        <div className="text-3xl font-bold mt-2 text-brand-green">{tier.price}</div>
                    </div>

                    <div className="space-y-4 flex-grow mb-8">
                        {tier.benefits.map((benefit: string, i: number) => (

                            <div key={i} className="flex items-start gap-3">
                                <div className="p-1 rounded-full bg-green-100 text-green-600 mt-0.5">
                                    <Check className="w-3 h-3" />
                                </div>
                                <span className="text-gray-600 text-sm">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    <button className={`w-full py-3 rounded-xl font-semibold transition-all ${tier.color.includes('bg-slate-800')
                        ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white hover:shadow-lg'
                        : tier.color.includes('bg-yellow-400')
                            ? 'bg-brand-gold text-brand-dark hover:bg-yellow-500 hover:shadow-lg'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}>
                        Join {tier.name}
                    </button>
                </motion.div>
            ))}
        </div>
    );
}
