"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, use } from "react";
import gsap from "gsap";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const fetchProductById = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  const data = await res.json();
  return data.product;
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, params is a Promise
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
  });

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const galleryRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && product) {
      const ctx = gsap.context(() => {
        // Image reveal animation
        gsap.fromTo(
          galleryRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" }
        );

        // Content stagger animation
        gsap.fromTo(
          contentRef.current?.children ? Array.from(contentRef.current.children) : [],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out", delay: 0.2 }
        );
      });

      return () => ctx.revert();
    }
  }, [isLoading, product]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      _id: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0]?.url || "",
      quantity: quantity
    });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512] pt-32 pb-24 px-4 md:px-12 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/50">Curating Details...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="w-full min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512] pt-32 pb-24 px-4 md:px-12 flex items-center justify-center">
        <p className="text-error font-sans text-[10px] uppercase tracking-[0.2em]">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512]">
      <div className="max-w-[1400px] mx-auto">
        <Link href="/products" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors font-sans text-[10px] uppercase tracking-[0.2em] mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Gallery Left */}
          <div ref={galleryRef} className="flex flex-col-reverse md:flex-row gap-6">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
              {product.images?.map((img: any, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-24 flex-shrink-0 bg-white/5 border transition-colors duration-300 ${activeImage === idx ? 'border-white' : 'border-transparent hover:border-white/50'}`}
                >
                  <Image src={img.url} alt={`Gallery ${idx}`} fill className="object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
            
            <div className="relative aspect-[4/5] w-full bg-white/5 group overflow-hidden flex items-center justify-center">
              {product.images && product.images[activeImage]?.url ? (
                <Image 
                  src={product.images[activeImage].url} 
                  alt={product.title} 
                  fill 
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 cursor-zoom-in" 
                  priority
                />
              ) : (
                <div className="text-white/40 uppercase tracking-widest text-xs">No Image</div>
              )}
            </div>
          </div>

          {/* Details Right */}
          <div ref={contentRef} className="flex flex-col py-4">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-luxury mb-4">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 tracking-tight">
              {product.title}
            </h1>
            <p className="font-sans text-2xl text-white mb-8">
              ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>

            <div className="prose prose-sm font-sans text-white/70 font-light leading-relaxed mb-10">
              <p>{product.description}</p>
            </div>

            {product.materials && product.materials.length > 0 && (
              <div className="mb-10">
                <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/50 mb-4 border-b border-white/10 pb-2">Materials</h3>
                <ul className="flex flex-wrap gap-3">
                  {product.materials.map((mat: string, idx: number) => (
                    <li key={idx} className="font-sans text-xs tracking-wide text-white/80 bg-white/5 px-4 py-2">
                      {mat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
              <div className="flex items-center border border-white/20">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-4 hover:bg-white/10 transition-colors text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-sans text-sm text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="p-4 hover:bg-white/10 transition-colors text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <span className={`font-sans text-[10px] uppercase tracking-[0.2em] ${product.stock > 0 ? 'text-luxury' : 'text-error'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-transparent border border-white text-white py-4 font-sans text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-[#141512] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
              <button 
                disabled={product.stock === 0}
                className="flex-1 bg-white border border-white text-[#141512] py-4 font-sans text-[10px] uppercase tracking-[0.2em] hover:bg-luxury hover:text-white hover:border-luxury transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Accordion Details (Placeholder) */}
            <div className="mt-16 space-y-4">
              {['Shipping & Returns', 'Care Instructions', 'Authenticity Guarantee'].map((item, i) => (
                <div key={i} className="border-b border-white/10 pb-4">
                  <button className="w-full flex justify-between items-center text-left hover:text-luxury transition-colors group">
                    <span className="font-sans text-xs tracking-widest uppercase text-white/80 group-hover:text-luxury">{item}</span>
                    <Plus className="w-4 h-4 text-white/40 group-hover:text-luxury" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
