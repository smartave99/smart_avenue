import { getProducts, getCategories, getOffers, searchProducts } from "@/app/actions";
import Link from "next/link";
import { Package, Search, Filter, ChevronRight, Zap, X } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductsPage({
    searchParams
}: {
    searchParams: Promise<{ category?: string; subcategory?: string; search?: string }>
}) {
    const params = await searchParams;
    const [products, categories, offers] = await Promise.all([
        params.search
            ? searchProducts(params.search, params.category, params.subcategory)
            : getProducts(),
        getCategories(),
        getOffers()
    ]);

    const mainCategories = categories.filter(c => !c.parentId);
    const getSubcategories = (parentId: string) => categories.filter(c => c.parentId === parentId);
    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || "Unknown";
    const getOffer = (id?: string) => id ? offers.find(o => o.id === id) : null;

    // Filter products
    let filteredProducts = params.search
        ? products
        : products.filter(p => p.available);

    if (!params.search) {
        if (params.category) {
            filteredProducts = filteredProducts.filter(p =>
                p.categoryId === params.category || p.subcategoryId === params.category
            );
        }
        if (params.subcategory) {
            filteredProducts = filteredProducts.filter(p => p.subcategoryId === params.subcategory);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Tech Header */}
            <div className="relative py-20 bg-brand-dark text-white overflow-hidden">
                <div className="absolute inset-0 bg-[#0A0A0A]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-lime/10 via-transparent to-transparent" />
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)", backgroundSize: "30px 30px" }}
                />
                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <span className="text-brand-lime font-bold tracking-widest uppercase text-xs mb-2 block">Catalog</span>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-brand-blue">Collection</span>
                        </h1>
                    </div>
                    <p className="text-slate-400 max-w-md text-sm md:text-base leading-relaxed hidden md:block text-right">
                        Explore our premium tech-forward inventory. Quality assured, delivered tomorrow.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Modern Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                                <Filter className="w-4 h-4 text-brand-blue" />
                                <h3 className="font-bold text-brand-dark">Filters</h3>
                            </div>

                            <nav className="space-y-1">
                                <Link
                                    href="/products"
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${!params.category
                                        ? "bg-brand-dark text-white font-medium"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-brand-dark"
                                        }`}
                                >
                                    All Products
                                    {!params.category && <ChevronRight className="w-3 h-3" />}
                                </Link>

                                <div className="h-px bg-slate-100 my-2" />

                                {mainCategories.map(cat => {
                                    const subs = getSubcategories(cat.id);
                                    const isActive = params.category === cat.id;

                                    return (
                                        <div key={cat.id} className="group">
                                            <Link
                                                href={`/products?category=${cat.id}`}
                                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${isActive
                                                    ? "bg-brand-blue/10 text-brand-blue font-bold"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-dark"
                                                    }`}
                                            >
                                                {cat.name}
                                                {isActive && <ChevronRight className="w-3 h-3" />}
                                            </Link>

                                            {/* Subcategories */}
                                            {subs.length > 0 && (isActive || params.category === cat.id) && (
                                                <div className="ml-4 mt-1 border-l-2 border-slate-100 pl-2 space-y-1">
                                                    {subs.map(sub => (
                                                        <Link
                                                            key={sub.id}
                                                            href={`/products?category=${cat.id}&subcategory=${sub.id}`}
                                                            className={`block px-3 py-1.5 rounded-lg text-xs transition-colors ${params.subcategory === sub.id
                                                                ? "text-brand-blue font-bold bg-blue-50"
                                                                : "text-slate-500 hover:text-brand-dark hover:bg-slate-50"
                                                                }`}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* active filters bar */}
                        {(params.search || params.category) && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                {params.search && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-dark text-white text-xs rounded-full">
                                        <Search className="w-3 h-3" />
                                        &quot;{params.search}&quot;
                                        <Link href="/products" className="hover:text-brand-lime"><X className="w-3 h-3" /></Link>
                                    </div>
                                )}
                                {params.category && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-700 text-xs rounded-full font-medium">
                                        Category: {getCategoryName(params.category)}
                                        <Link href="/products" className="hover:text-red-500"><X className="w-3 h-3" /></Link>
                                    </div>
                                )}
                                <span className="text-xs text-slate-400 ml-auto">
                                    {filteredProducts.length} Results
                                </span>
                            </div>
                        )}

                        {filteredProducts.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <Package className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">No products found</h3>
                                <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
                                <Link href="/products" className="inline-block mt-6 px-6 py-2 bg-brand-dark text-white rounded-full text-sm font-bold hover:bg-brand-blue transition-colors">
                                    Clear All Filters
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => {
                                    const offer = getOffer(product.offerId);

                                    return (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.id}`} // Assuming detailed page exists or will exist, otherwise just #
                                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-brand-lime/30 flex flex-col"
                                        >
                                            {/* Image Area */}
                                            <div className="relative aspect-square overflow-hidden bg-slate-100">
                                                {product.imageUrl ? (
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <Package className="w-10 h-10" />
                                                    </div>
                                                )}

                                                {/* Badges */}
                                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                    {offer && (
                                                        <span className="bg-brand-lime text-brand-dark text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                                                            -{offer.discount}
                                                        </span>
                                                    )}
                                                    {product.featured && (
                                                        <span className="bg-brand-dark text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                                                            <Zap className="w-3 h-3 fill-current" /> Hot
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Hover Action */}
                                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                                                    <button className="w-full py-2 bg-white text-brand-dark text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-brand-lime transition-colors">
                                                        Quick View
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="mb-2">
                                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                                                        {getCategoryName(product.categoryId)}
                                                    </p>
                                                    <h3 className="text-base font-bold text-brand-dark group-hover:text-brand-blue transition-colors line-clamp-1">
                                                        {product.name}
                                                    </h3>
                                                </div>

                                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className={`text-lg font-bold ${product.originalPrice ? 'text-brand-blue' : 'text-slate-900'}`}>
                                                            ₹{product.price.toLocaleString()}
                                                        </span>
                                                        {product.originalPrice && (
                                                            <span className="text-xs text-slate-400 line-through">
                                                                ₹{product.originalPrice.toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-dark group-hover:text-white transition-colors">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
