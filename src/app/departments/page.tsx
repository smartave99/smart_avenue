import { getDepartments } from "@/app/actions";
import DepartmentsGrid from "@/components/DepartmentsGrid";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
    const departments = await getDepartments();

    return (
        <div className="min-h-screen bg-brand-sand">
            {/* Editorial Header */}
            <div className="relative py-24 bg-brand-dark text-white text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543888518-a6210f763e9b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />

                <div className="relative z-10 container mx-auto px-4">
                    <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Curated Zones</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                        Explore Our <span className="text-brand-gold italic font-light">Departments</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Discover a world of premium products across our specialized retail zones.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-20 -mt-10 relative z-20">
                <DepartmentsGrid departments={departments} />
            </div>
        </div>
    );
}
