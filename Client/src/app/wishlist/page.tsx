"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col mb-12 border-b border-white/10 pb-8">
          <p className="text-luxury font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] mb-3 font-medium opacity-80">
            Your Curated Selection
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight font-light tracking-tight">
            Wishlist
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h2 className="text-2xl font-serif text-white mb-4">Your wishlist is empty</h2>
            <p className="text-white/60 font-sans mb-8 max-w-md">
              Discover our exclusive collections and save your favorite pieces for later.
            </p>
            <Link 
              href="/collections"
              className="bg-luxury text-background px-8 py-3 rounded-full font-sans text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} darkTheme={true} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
