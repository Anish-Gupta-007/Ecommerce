"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/store/uiStore";
import { X, Search as SearchIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products?keyword=${query}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setResults(data.products || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!mounted) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 z-[100] bg-background transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSearchOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="absolute top-8 right-8 z-10">
          <button onClick={closeSearch} className="text-primary hover:text-luxury transition-colors p-2">
            <X className="w-8 h-8" strokeWidth={1} />
          </button>
        </div>

        <div className="h-full flex flex-col max-w-5xl mx-auto px-6 pt-32 pb-12">
          <div className="relative border-b border-primary/20 pb-4 mb-12">
            <input 
              type="text"
              placeholder="What are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-4xl md:text-6xl font-serif text-primary placeholder-primary/30 outline-none focus:ring-0"
              autoFocus={isSearchOpen}
            />
            <SearchIcon className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/30 w-8 h-8" strokeWidth={1} />
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-primary/50 font-sans text-sm tracking-widest uppercase">
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {results.map((product: any) => (
                  <Link 
                    href={`/products/${product._id}`} 
                    key={product._id}
                    onClick={closeSearch}
                    className="group flex flex-col"
                  >
                    <div className="relative aspect-[3/4] bg-surface overflow-hidden mb-4">
                      {product.images?.[0] ? (
                        <Image 
                          src={product.images[0].url} 
                          alt={product.title} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface text-primary/30 font-serif text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3 className="font-serif text-lg text-primary line-clamp-1 group-hover:text-luxury transition-colors">{product.title}</h3>
                    <p className="font-sans text-sm text-primary/70">₹{product.price.toLocaleString('en-IN')}</p>
                  </Link>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="font-serif text-2xl text-primary mb-4">No results found for "{query}"</p>
                <p className="font-sans text-sm text-primary/50">Try checking your spelling or using different keywords.</p>
              </div>
            ) : (
              <div className="py-10">
                <p className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-6">Popular Searches</p>
                <div className="flex flex-wrap gap-4">
                  {['Leather', 'Cashmere', 'Watch', 'Boots', 'Bag'].map(term => (
                    <button 
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-6 py-2 border border-primary/20 text-primary hover:border-primary transition-colors font-sans text-xs tracking-widest uppercase rounded-full"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
