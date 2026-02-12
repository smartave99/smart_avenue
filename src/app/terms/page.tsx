import Link from "next/link";

export default function TermsPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <nav className="flex mb-8 text-sm font-medium text-slate-500">
                    <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
                    <span className="mx-2 text-slate-300">/</span>
                    <span className="text-slate-900">Terms of Service</span>
                </nav>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">
                        Terms of <span className="text-brand-blue">Service</span>
                    </h1>

                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using the Smart Avenue website and store services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use of Services</h2>
                            <p>
                                You agree to use our services only for lawful purposes. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Product Information and Pricing</h2>
                            <p>
                                We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content are error-free. We reserve the right to correct any errors and to change or update information at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Limitation of Liability</h2>
                            <p>
                                Smart Avenue shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of, or inability to use, our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Governing Law</h2>
                            <p>
                                These terms are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Patna, Bihar.
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
