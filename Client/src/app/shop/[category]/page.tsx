"use client";

import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { use } from "react";

// Helper to format URL slug to DB category string
const formatCategory = (slug: string) => {
  const map: Record<string, string> = {
    "timepieces": "Timepieces",
    "leather-goods": "Leather Goods",
    "fragrances": "Fragrances",
    "accessories": "Accessories",
    "jewelry": "Jewelry",
  };
  return map[slug.toLowerCase()] || slug;
};

const fetchCategoryProducts = async (categorySlug: string) => {
  const categoryName = formatCategory(categorySlug);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products?category=${encodeURIComponent(categoryName)}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products;
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.category;
  const categoryName = formatCategory(categorySlug);

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["products-category", categorySlug],
    queryFn: () => fetchCategoryProducts(categorySlug),
  });

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512]">
      <div className="max-w-[1400px] mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors font-sans text-[10px] uppercase tracking-[0.2em] mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-16 border-b border-white/10 pb-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-4 tracking-tight">{categoryName}</h1>
          <p className="text-white/60 font-sans text-lg max-w-md">
            Explore our exclusive collection of {categoryName.toLowerCase()}, crafted with uncompromising attention to detail.
          </p>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col gap-6 animate-pulse">
                <div className="aspect-[4/5] bg-white/10 rounded-[2rem]" />
                <div className="flex flex-col gap-2 px-2">
                  <div className="h-6 bg-white/10 w-3/4 rounded" />
                  <div className="h-4 bg-white/10 w-1/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-20 text-error font-sans tracking-[0.2em] text-xs uppercase">
            Failed to load collection.
          </div>
        ) : !products || products.length === 0 ? (
          <div className="py-20 text-white/50 font-serif text-2xl italic border-t border-white/10">
            No products found in this collection yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} darkTheme={true} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
