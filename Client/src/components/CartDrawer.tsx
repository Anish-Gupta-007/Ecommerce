"use client";

import { useCartStore } from "@/store/cartStore";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      closeCart();
      router.push("/account?redirect=/checkout");
    } else {
      closeCart();
      router.push("/checkout");
    }
  };

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[450px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512] border-l border-white/10 z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/10 bg-white/[0.02]">
          <h2 className="font-serif text-3xl text-white tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-luxury" />
            Your Cart
          </h2>
          <button 
            onClick={closeCart}
            className="text-white/40 hover:text-white transition-all duration-300 p-2 hover:rotate-90"
          >
            <X className="w-6 h-6" strokeWidth={1} />
          </button>
        </div>

        {/* Cart Items */}
        <div 
          data-lenis-prevent="true" 
          className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 overscroll-contain"
        >
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-6">
              <ShoppingBag className="w-16 h-16 opacity-20" strokeWidth={1} />
              <p className="font-sans text-sm uppercase tracking-[0.2em] text-center">Your cart is beautifully empty</p>
              <button 
                onClick={closeCart}
                className="text-white border-b border-white/30 pb-1 font-sans text-xs uppercase tracking-[0.2em] hover:text-luxury hover:border-luxury transition-colors mt-4"
              >
                Discover The Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="flex gap-6 group relative p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/[0.05] hover:border-white/20">
                <div className="relative w-28 h-36 bg-white/5 flex-shrink-0 overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/products/${item._id}`} onClick={closeCart} className="font-serif text-xl text-white hover:text-luxury transition-colors line-clamp-2 pr-4 leading-tight">
                        {item.title}
                      </Link>
                      <button onClick={() => removeItem(item._id)} className="text-white/30 hover:text-error transition-colors mt-1 hover:scale-110">
                        <X className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    </div>
                    <p className="font-sans text-white/90 text-lg tracking-wide">
                      ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  
                  <div className="flex items-center border border-white/20 w-fit backdrop-blur-sm bg-white/5 mt-4">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-3 hover:bg-white/10 transition-colors text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-10 text-center font-sans text-xs text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-3 hover:bg-white/10 transition-colors text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="p-8 border-t border-white/10 bg-white/[0.02] backdrop-blur-md relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-end mb-8">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1">Estimated Total</span>
              <span className="font-serif text-4xl text-white tracking-tight">
                ₹{getCartTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-white text-[#141512] py-5 font-sans text-xs uppercase tracking-[0.2em] font-medium hover:bg-luxury hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(109,115,94,0.3)]"
            >
              Secure Checkout
            </button>
            <p className="text-center font-sans text-[9px] uppercase tracking-[0.2em] text-white/30 mt-4">
              Taxes and shipping calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
