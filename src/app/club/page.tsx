"use client";

import { motion } from "framer-motion";
import { Check, Crown, CreditCard, Gift, Truck } from "lucide-react";
import { CLUB_TIERS } from "@/lib/data";

export default function ClubPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <section className="bg-brand-dark text-white py-20 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <span className="text-brand-gold font-medium tracking-widest text-sm uppercase mb-4 block">Loyalty Program</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">The Smart <span className="text-brand-gold">Club</span></h1>
                    <p className="text-gray-300 text-lg">
                        Unlock a world of exclusive privileges, priority services, and rewards tailored just for you.
                    </p>
                </div>
            </section>

            {/* Tiers Grid */}
            <section className="py-20 px-4 md:px-6 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {CLUB_TIERS.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative rounded-3xl p-8 border ${tier.name === 'Gold Elite' ? 'border-brand-gold shadow-2xl scale-105 z-10 bg-white' : 'border-gray-100 bg-white shadow-lg'} flex flex-col`}
                        >
                            {tier.name === 'Gold Elite' && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-2xl font-serif font-bold text-gray-900">{tier.name}</h3>
                                <div className="text-3xl font-bold mt-2 text-brand-green">{tier.price}</div>
                            </div>

                            <div className="space-y-4 flex-grow mb-8">
                                {tier.benefits.map((benefit) => (
                                    <div key={benefit} className="flex items-start gap-3">
                                        <div className="p-1 rounded-full bg-green-100 text-green-600 mt-0.5">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-gray-600 text-sm">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`w-full py-3 rounded-xl font-semibold transition-all ${tier.name === 'Platinum Access'
                                    ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white hover:shadow-lg'
                                    : tier.name === 'Gold Elite'
                                        ? 'bg-brand-gold text-brand-dark hover:bg-yellow-500 hover:shadow-lg'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}>
                                Join {tier.name}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Benefits Showcase */}
            <section className="bg-white py-20 border-t border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-serif font-bold text-brand-dark mb-12">Why Join The Club?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: Crown, label: "VIP Access", desc: "Early access to sales" },
                            { icon: Truck, label: "Free Delivery", desc: "On orders above ₹500" },
                            { icon: Gift, label: "Birthday Treats", desc: "Special surprises" },
                            { icon: CreditCard, label: "Smart Points", desc: "Earn on every spend" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-brand-green/5 flex items-center justify-center text-brand-green mb-4">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1">{item.label}</h4>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
