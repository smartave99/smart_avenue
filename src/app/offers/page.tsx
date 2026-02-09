import { getOffers } from "@/app/actions";
import OffersList from "@/components/OffersList";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
    const offers = await getOffers();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Tech Editorial Header */}
            <div className="relative py-32 bg-brand-dark text-white overflow-hidden">
                {/* Abstract Tech Background */}
                <div className="absolute inset-0 bg-[#0A0A0A]" />
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-brand-lime/10 to-transparent" />
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)", backgroundSize: "30px 30px" }}
                />

                <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                    <span className="text-brand-blue font-bold tracking-[0.2em] uppercase text-xs mb-4 block animate-pulse">
                        Smart Club Exclusives
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Weekly <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-brand-blue">Offers</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Curated deals and premium privileges for our valued members.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-16 -mt-10 relative z-20">
                <OffersList offers={offers} />
            </div>
        </div>
    );
}
