"use client";

import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";

const fetchAllProducts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products;
};

export default function ProductsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: fetchAllProducts,
  });

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-4 tracking-tight">The Collection</h1>
            <p className="text-white/60 font-sans text-lg max-w-md">
              Discover our complete range of exceptionally crafted luxury goods.
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <select className="bg-transparent border-b border-white/20 py-2 px-4 font-sans text-sm uppercase tracking-widest outline-none focus:border-luxury transition-colors text-white flex-1 md:flex-none">
              <option className="bg-[#141512]">All Categories</option>
              <option className="bg-[#141512]">Timepieces</option>
              <option className="bg-[#141512]">Leather Goods</option>
              <option className="bg-[#141512]">Fragrances</option>
              <option className="bg-[#141512]">Jewelry</option>
            </select>
            <select className="bg-transparent border-b border-white/20 py-2 px-4 font-sans text-sm uppercase tracking-widest outline-none focus:border-luxury transition-colors text-white flex-1 md:flex-none">
              <option className="bg-[#141512]">Sort By</option>
              <option className="bg-[#141512]">Price: High to Low</option>
              <option className="bg-[#141512]">Price: Low to High</option>
              <option className="bg-[#141512]">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="flex flex-col gap-6 animate-pulse">
                <div className="aspect-[4/5] bg-white/10 rounded-[2rem]" />
                <div className="flex flex-col gap-2 px-2">
                  <div className="h-6 bg-white/10 w-3/4 rounded" />
                  <div className="h-4 bg-white/10 w-1/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {products?.map((product: any) => (
              <ProductCard key={product._id} product={product} darkTheme={true} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
