"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          ease: "power3.inOut",
          duration: 1.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        textRef.current?.children ? Array.from(textRef.current.children) : [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-transparent py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Image Side */}
          <div ref={imageRef} className="relative aspect-[3/4] lg:aspect-[4/5] w-full group overflow-hidden">
            <Image
              src="/api/images/brand-story"
              alt="Artisan crafting luxury goods"
              fill
              className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 border border-white/10 pointer-events-none z-10 mix-blend-overlay"></div>
          </div>

          {/* Text Side */}
          <div ref={textRef} className="flex flex-col gap-10 lg:pl-8">
            <div>
              <p className="text-luxury font-sans text-[10px] uppercase tracking-[0.4em] mb-6 font-medium">
                The Heritage
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] tracking-tight">
                A Legacy of <br /> <span className="italic text-white/90 font-light">Craftsmanship.</span>
              </h2>
            </div>
            
            <div className="flex flex-col gap-8 text-white/70 font-sans text-lg font-light leading-relaxed border-l border-white/20 pl-8 ml-2">
              <p>
                Founded on the principles of timeless elegance and uncompromising quality, 
                AURA represents the pinnacle of modern luxury. Every piece is a testament to 
                the dedication of our master artisans.
              </p>
              <p>
                We source only the rarest materials, transforming them through meticulous 
                techniques passed down through generations. It is not just about creating 
                products; it is about preserving a legacy.
              </p>
            </div>

            <Link 
              href="/collections" 
              className="inline-block border-b border-white/30 text-white font-sans uppercase tracking-[0.2em] text-[10px] pb-1 w-fit hover:text-luxury hover:border-luxury transition-colors mt-8"
            >
              Explore The Archives
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
