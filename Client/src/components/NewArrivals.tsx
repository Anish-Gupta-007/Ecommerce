"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard, { Product } from "./ProductCard";

const fetchNewArrivals = async (): Promise<Product[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  // For New Arrivals, return first 4
  return data.products.slice(0, 4);
};

export default function NewArrivals() {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: fetchNewArrivals,
  });

  return (
    <section className="relative w-full py-16 md:py-24 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[#2C2E27] via-[#4A5041] to-[#6A705B]">
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 border-b border-white/10 pb-6"
        >
          <div>
            <p className="text-luxury font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] mb-3 md:mb-4 font-medium opacity-80">
              Just In
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight font-light tracking-tight max-w-2xl">
              New Arrivals.
            </h2>
          </div>
          <Link 
            href="/products" 
            className="group flex items-center gap-3 mt-6 md:mt-0 text-white/80 font-sans uppercase tracking-[0.2em] text-[10px] hover:text-luxury transition-colors"
          >
            Shop the Edit
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col gap-6 animate-pulse">
                <div className="aspect-[4/5] bg-surface/10 rounded-[2rem]" />
                <div className="flex flex-col gap-2 px-2">
                  <div className="h-6 bg-surface/10 w-3/4 rounded" />
                  <div className="h-4 bg-surface/10 w-1/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-error font-sans text-xs tracking-[0.2em] uppercase">Failed to load new arrivals.</p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/50 font-serif text-2xl italic">The edit is being curated...</p>
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
                <ProductCard product={product} darkTheme={true} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
