"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  images: { url: string }[];
}

interface ProductCardProps {
  product: Product;
  darkTheme?: boolean;
}

export default function ProductCard({ product, darkTheme = false }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product._id);

  const imageRef = useRef<HTMLDivElement>(null);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (imageRef.current) {
      const card = imageRef.current;
      const clone = card.cloneNode(true) as HTMLElement;
      const rect = card.getBoundingClientRect();
      
      // Setup Clone styles
      clone.style.position = 'fixed';
      clone.style.top = `${rect.top}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.zIndex = '9999';
      clone.style.borderRadius = '2rem';
      clone.style.overflow = 'hidden';
      clone.style.pointerEvents = 'none'; // so it doesn't block clicks
      
      // Clean up hover elements from the clone so it looks like just the image
      const btns = clone.querySelectorAll('button');
      btns.forEach(btn => btn.remove());
      
      document.body.appendChild(clone);
      
      const cartIcon = document.getElementById("nav-cart-icon");
      const cartRect = cartIcon 
        ? cartIcon.getBoundingClientRect() 
        : { top: 20, left: window.innerWidth - 60, width: 24, height: 24 };

      // Phase 1: Pop up and wavy shake
      gsap.timeline({
        onComplete: () => {
          clone.remove();
          addItem({
            _id: product._id,
            title: product.title,
            price: product.price,
            image: product.images?.[0]?.url || "",
            quantity: 1
          });
        }
      })
      .to(clone, {
        scale: 1.05,
        rotation: -4,
        y: -10,
        duration: 0.15,
        ease: "power1.out"
      })
      .to(clone, {
        rotation: 4,
        duration: 0.15,
        ease: "power1.inOut"
      })
      .to(clone, {
        rotation: -2,
        duration: 0.15,
        ease: "power1.inOut"
      })
      // Phase 2: Travel to Cart and scale out
      .to(clone, {
        top: cartRect.top + cartRect.height / 2 - rect.height / 2,
        left: cartRect.left + cartRect.width / 2 - rect.width / 2,
        scale: 0.05,
        opacity: 0,
        rotation: 0,
        duration: 0.8,
        ease: "power3.inOut"
      }, "+=0.1");

    } else {
      // Fallback if ref is missing
      addItem({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0]?.url || "",
        quantity: 1
      });
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeWishlist(product._id);
    } else {
      addWishlist(product);
    }
  };

  return (
    <div className="group flex flex-col gap-6 cursor-pointer">
      <div ref={imageRef} className="relative aspect-[4/5] overflow-hidden bg-surface rounded-[2rem] shadow-sm group-hover:shadow-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border border-primary/5">
        <Link href={`/products/${product._id}`}>
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover opacity-95 group-hover:opacity-100 transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <ShoppingBag className="w-12 h-12 text-white/20" />
            </div>
          )}
        </Link>
        
        {/* Subtle Overlay Gradient for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Wishlist Button */}
        <motion.button
          onClick={handleWishlistToggle}
          whileHover={{ scale: 1.1, rotate: [0, -15, 15, -15, 0] }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isWishlisted 
              ? "bg-red-500/90 text-white shadow-lg opacity-100 translate-y-0" 
              : "bg-white/10 text-white opacity-0 -translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white/20"
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
        </motion.button>

        {/* Hover Action: Elegant Floating Button */}
        <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 w-full px-2 md:px-8 flex justify-center z-10">
          <button 
            onClick={handleQuickAdd}
            className="bg-background/95 backdrop-blur-md text-primary px-3 py-2 md:px-8 md:py-3.5 rounded-full flex items-center justify-center gap-1.5 md:gap-3 hover:bg-primary hover:text-background transition-colors font-sans uppercase tracking-[0.1em] md:tracking-[0.2em] text-[9px] md:text-[10px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] font-semibold w-[90%] sm:w-auto whitespace-nowrap"
          >
            <ShoppingBag className="w-3 h-3 hidden sm:block" />
            Add to bag
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 px-2">
        <div className="flex justify-between items-start">
          <Link href={`/products/${product._id}`}>
            <h3 className={`font-serif text-xl md:text-2xl group-hover:text-luxury transition-colors line-clamp-1 ${darkTheme ? 'text-white' : 'text-primary'}`}>
              {product.title}
            </h3>
          </Link>
          <span className={`font-sans text-sm md:text-base mt-1 ${darkTheme ? 'text-white/80' : 'text-primary'}`}>
            ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <span className={`font-sans text-[10px] uppercase tracking-[0.2em] ${darkTheme ? 'text-white/40' : 'text-secondary'}`}>
          {product.category}
        </span>
      </div>
    </div>
  );
}
