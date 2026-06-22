"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Search, Heart, X, Package } from "lucide-react";
import clsx from "clsx";
import gsap from "gsap";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { openCart, getCartCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isSearchOpen, openSearch, closeSearch } = useUIStore();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const heartIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mounted && wishlistItems.length > 0) {
      gsap.fromTo(
        heartIconRef.current,
        { scale: 1, rotation: 0 },
        {
          scale: 1.3,
          rotation: [0, -15, 15, -15, 0],
          duration: 0.6,
          ease: "back.out(1.7)",
          clearProps: "all"
        }
      );
    }
  }, [wishlistItems.length, mounted]);

  const toggleSearch = () => {
    if (isSearchOpen) closeSearch();
    else openSearch();
  };

  useEffect(() => {
    if (isSearchOpen) {
      gsap.to(searchContainerRef.current, {
        width: "100%",
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
        display: "flex"
      });
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      gsap.to(searchContainerRef.current, {
        width: "0%",
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut",
        display: "none"
      });
    }
  }, [isSearchOpen]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={clsx(
          "fixed z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between",
          isScrolled 
            ? "top-6 left-1/2 -translate-x-1/2 w-[85%] md:w-[75%] max-w-6xl py-3 px-8 rounded-full bg-primary/85 backdrop-blur-2xl border border-background/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-background" 
            : `top-0 left-0 w-full py-8 px-6 md:px-12 bg-transparent border-transparent ${isHomePage ? 'text-[#0A0A0A]/85' : 'text-white/90'}`
        )}
      >
        <div className="w-full flex items-center justify-between md:grid md:grid-cols-3">
          
          {/* Logo - Left */}
          <div className="flex justify-start">
            <Link href="/" className="font-serif text-2xl tracking-widest text-inherit">
              AURA
            </Link>
          </div>

          {/* Desktop Nav & Search - Center */}
          <div className="hidden md:flex items-center justify-center relative w-full h-full col-span-1">
            
            {/* Links */}
            <nav className={clsx(
              "flex items-center gap-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isSearchOpen ? "opacity-0 invisible scale-95 absolute" : "opacity-100 visible scale-100 relative"
            )}>
              <Link href="/products" className="text-[11px] uppercase tracking-[0.2em] font-sans transition-colors relative group text-inherit opacity-80 hover:opacity-100">
                Shop
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-current transition-all duration-500 ease-out group-hover:w-full"></span>
              </Link>
              <Link href="/collections" className="text-[11px] uppercase tracking-[0.2em] font-sans transition-colors relative group text-inherit opacity-80 hover:opacity-100">
                Collections
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-current transition-all duration-500 ease-out group-hover:w-full"></span>
              </Link>
              <Link href="/about" className="text-[11px] uppercase tracking-[0.2em] font-sans transition-colors relative group text-inherit opacity-80 hover:opacity-100">
                Editorial
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-current transition-all duration-500 ease-out group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Search Input */}
            <div 
              ref={searchContainerRef} 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 opacity-0 overflow-hidden hidden items-center justify-center z-10"
            >
              <input 
                ref={inputRef} 
                type="text" 
                placeholder="Search AURA..." 
                className="w-full max-w-md bg-transparent border-b border-current py-2 px-4 outline-none font-sans text-xs uppercase tracking-[0.2em] placeholder:text-inherit/40 text-inherit text-center transition-colors focus:border-current/80" 
              />
            </div>

          </div>



          {/* Icons - Right */}
          <div className="flex items-center justify-end gap-6 text-inherit">
            <button 
              onClick={toggleSearch} 
              className="transition-all duration-300 opacity-80 hover:opacity-100 hidden md:block hover:scale-110"
            >
              {isSearchOpen ? (
                <X strokeWidth={1.5} size={18} />
              ) : (
                <Search strokeWidth={1.5} size={18} />
              )}
            </button>
            <Link href="/wishlist" className="transition-opacity opacity-80 hover:opacity-100 flex items-center gap-2 group">
              <div className="relative" ref={heartIconRef}>
                <Heart strokeWidth={1.5} size={18} className="transition-transform duration-500 ease-out group-hover:scale-110" />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-sans shadow-lg">
                    {wishlistItems.length}
                  </span>
                )}
              </div>
            </Link>
            <Link href="/orders" className="transition-opacity opacity-80 hover:opacity-100 block">
              <Package strokeWidth={1.5} size={18} />
            </Link>
            <Link href="/account" className="transition-opacity opacity-80 hover:opacity-100 block">
              <User strokeWidth={1.5} size={18} />
            </Link>
            <button 
              id="nav-cart-icon"
              onClick={openCart}
              className="transition-opacity opacity-80 hover:opacity-100 flex items-center gap-2 group"
            >
              <div className="relative">
                <ShoppingBag strokeWidth={1.5} size={18} className="transition-transform duration-500 ease-out group-hover:scale-110" />
                {mounted && getCartCount() > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-luxury text-background text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-sans shadow-lg">
                    {getCartCount()}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
