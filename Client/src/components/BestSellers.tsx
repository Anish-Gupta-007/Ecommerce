"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ProductCard, { Product } from "./ProductCard";

const fetchBestSellers = async (): Promise<Product[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  // For best sellers, return last 4 items as a mock logic
  return data.products.slice(-4);
};

export default function BestSellers() {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: fetchBestSellers,
  });

  return (
    <section className="relative w-full py-16 md:py-24 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[#141512] via-[#1E2019] to-[#2B2D26]">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-white/10" />

      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-12 md:mb-16"
        >
          <p className="text-luxury font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] mb-3 md:mb-4 font-medium opacity-80">
            The Signature Series
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight font-light tracking-tight max-w-3xl">
            Iconic Pieces.
          </h2>
          <p className="text-white/60 font-sans text-sm md:text-base max-w-md mt-4 leading-relaxed">
            Our most coveted designs, celebrated for their extraordinary craftsmanship and timeless appeal.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col gap-6 animate-pulse">
                <div className="aspect-[4/5] bg-surface rounded-[2rem]" />
                <div className="flex flex-col gap-2 px-2">
                  <div className="h-6 bg-surface w-3/4 rounded" />
                  <div className="h-4 bg-surface w-1/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-error font-sans text-xs tracking-[0.2em] uppercase">Failed to load signature pieces.</p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-primary/50 font-serif text-2xl italic">Collection update in progress...</p>
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
