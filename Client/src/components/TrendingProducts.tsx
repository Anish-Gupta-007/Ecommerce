"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard, { Product } from "./ProductCard";

const fetchTrending = async (): Promise<Product[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  // Grab 4 products from the middle to simulate trending
  return data.products.slice(2, 6);
};

export default function TrendingProducts() {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["trending-products"],
    queryFn: fetchTrending,
  });

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-12 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[#6D735E] via-[#9DA38D] to-[#D3D6CB]">
      <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col justify-center">
        
        {/* Editorial Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-8 md:mb-10"
        >
          <div className="w-px h-8 bg-white/20 mb-4" />
          <p className="text-[#1A1C16] font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] mb-3 font-semibold opacity-90">
            Highly Coveted
          </p>
          <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight font-light tracking-tight max-w-4xl">
            Trending Now.
          </h2>
          <Link 
            href="/collections/trending" 
            className="mt-6 border-b border-white/30 pb-1 text-white/90 font-sans uppercase tracking-[0.2em] text-[10px] hover:border-white transition-colors"
          >
            Discover the full edit
          </Link>
        </motion.div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col gap-6 animate-pulse">
                <div className="aspect-[4/5] bg-white/20 rounded-[2rem]" />
                <div className="flex flex-col gap-2 px-2">
                  <div className="h-6 bg-white/20 w-3/4 rounded" />
                  <div className="h-4 bg-white/20 w-1/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-[#2B2D26] font-sans text-xs tracking-[0.2em] uppercase">Failed to load trending items.</p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#2B2D26]/50 font-serif text-2xl italic">Trending data is being analyzed...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={product} darkTheme={false} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
