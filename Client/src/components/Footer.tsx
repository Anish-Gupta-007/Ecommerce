"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Twitter, Facebook } from "lucide-react";

const FOOTER_LINKS = {
  shop: [
    { label: "Timepieces", href: "/shop/timepieces" },
    { label: "Leather Goods", href: "/shop/leather-goods" },
    { label: "Fragrances", href: "/shop/fragrances" },
    { label: "Jewelry", href: "/shop/jewelry" },
  ],
  discover: [
    { label: "Our Story", href: "/about" },
    { label: "All Products", href: "/products" },
    { label: "Collections", href: "/collections" },
    { label: "My Account", href: "/account" },
  ]
};

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/account') return null;

  return (
    <footer className="w-full bg-[#050604] pt-16 md:pt-24 pb-8 px-6 md:px-12 overflow-hidden relative">
      
      {/* Crazy Premium Ambient Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#3A3D34]/20 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-30%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-luxury/10 blur-[150px] pointer-events-none z-0" />
      
      {/* Film Grain Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 mix-blend-overlay" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Brand & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 pb-8 border-b border-white/10">
          <div className="flex flex-col">
            <Link href="/" className="font-serif text-5xl text-white tracking-widest mb-4">
              AURA
            </Link>
            <p className="text-white/40 font-sans text-xs tracking-widest uppercase max-w-sm">
              The pinnacle of modern luxury.
            </p>
          </div>

          <div className="flex gap-6 mt-8 md:mt-0">
            <a href="#" className="text-white/40 hover:text-luxury transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/40 hover:text-luxury transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/40 hover:text-luxury transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 mb-16">
          <div className="flex flex-col">
            <h4 className="font-sans uppercase tracking-[0.3em] text-[10px] text-white/40 mb-8 font-medium">
              Shop
            </h4>
            <ul className="flex flex-col gap-5">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/80 hover:text-luxury transition-colors text-xs md:text-sm font-sans tracking-wide">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            <h4 className="font-sans uppercase tracking-[0.3em] text-[10px] text-white/40 mb-8 font-medium">
              Discover
            </h4>
            <ul className="flex flex-col gap-5">
              {FOOTER_LINKS.discover.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/80 hover:text-luxury transition-colors text-xs md:text-sm font-sans tracking-wide">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-end items-start sm:items-end col-span-2 sm:col-span-1 mt-8 sm:mt-0">
            <p className="text-white/40 font-serif italic text-lg leading-relaxed max-w-xs sm:text-right">
              "Elegance is not about being noticed, it's about being remembered."
            </p>
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="flex justify-center md:justify-end items-center gap-6">
          <p className="text-white/30 font-sans text-[10px] tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} AURA COMMERCE. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Massive Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0 overflow-hidden translate-y-[20%]">
        <h1 className="text-[22vw] font-serif font-light bg-clip-text text-transparent bg-gradient-to-b from-white/10 to-transparent leading-none tracking-tighter whitespace-nowrap">
          AURA COMMERCE
        </h1>
      </div>
    </footer>
  );
}
