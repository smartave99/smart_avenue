import Link from "next/link";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <nav className="flex mb-8 text-sm font-medium text-slate-500">
                    <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
                    <span className="mx-2 text-slate-300">/</span>
                    <span className="text-slate-900">Privacy Policy</span>
                </nav>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">
                        Privacy <span className="text-brand-blue">Policy</span>
                    </h1>

                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
                            <p>
                                At Smart Avenue, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our store or use our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
                            <p>
                                We may collect information that identifies, relates to, describes, or could reasonably be linked, directly or indirectly, with you or your household:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Identifiers such as your name, alias, postal address, email address, or phone number.</li>
                                <li>Commercial information, including records of products purchased or considered.</li>
                                <li>Internet or other electronic network activity information.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
                            <p>
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Process your transactions and manage your account.</li>
                                <li>Improve our products and services.</li>
                                <li>Send you promotional materials and updates (with your consent).</li>
                                <li>Ensure the security and integrity of our systems.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Sharing Your Information</h2>
                            <p>
                                We do not sell your personal information. We may share your information with third-party service providers who perform services for us, such as payment processing and delivery services.
                            </p>
                        </section>

                        <p className="text-sm text-slate-400 mt-12 italic">
                            Last Updated: February 12, 2026
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
