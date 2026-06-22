"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    id: 1,
    title: "Signature Timepieces",
    subtitle: "MENS COLLECTION",
    badge: "NEW",
    image: "/api/images/watch",
    href: "/shop/timepieces",
  },
  {
    id: 2,
    title: "Premium Leather Goods",
    subtitle: "WOMENS COLLECTION",
    badge: "BESTSELLER",
    image: "/api/images/handbag",
    href: "/shop/leather-goods",
  },
  {
    id: 3,
    title: "Artisan Fragrances",
    subtitle: "UNISEX COLLECTION",
    badge: "SALE",
    image: "/api/images/fragrance",
    href: "/shop/fragrances",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-16 px-6 md:px-12 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512]">
      
      <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-10 border-b border-white/10 pb-4 md:pb-6"
        >
          <div>
            <p className="text-luxury font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] mb-2 md:mb-3 font-medium opacity-90">
              Curated Selection
            </p>
            <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight font-light tracking-tight">
              A feeling of pure exclusivity.
            </h2>
          </div>
          <Link 
            href="/collections" 
            className="group flex items-center gap-3 mt-4 md:mt-0 text-white/80 font-sans uppercase tracking-[0.2em] text-[10px] hover:text-luxury transition-colors"
          >
            Explore All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {CATEGORIES.map((category, index) => (
            <motion.div 
              key={category.id} 
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer flex flex-col"
            >
              {/* Card Image Container (Optimized height) */}
              <Link 
                href={category.href}
                className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#1A1C23] shadow-lg group-hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] mb-4 md:mb-5 border border-white/5"
              >
                {/* Image */}
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                  <span className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full font-sans text-[9px] uppercase tracking-[0.2em] font-medium border border-white/10">
                    {category.badge}
                  </span>
                </div>

                {/* Floating Action Button on Hover */}
                <div className="absolute bottom-6 right-6 z-10 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <span className="w-12 h-12 rounded-full bg-luxury text-[#101216] flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </Link>

              {/* Text Content Below Card */}
              <div className="flex justify-between items-start px-2">
                <div>
                  <h3 className="text-white font-serif text-2xl md:text-3xl mb-2 group-hover:text-luxury transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-white/50 font-sans text-[10px] uppercase tracking-[0.2em]">
                    {category.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}