"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

const MagneticButton = ({ children, href }: { children: React.ReactNode, href: string }) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    gsap.to(buttonRef.current, { x: x * 0.4, y: y * 0.4, duration: 1, ease: "power3.out" });
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
  };

  return (
    <Link href={href} passHref>
      <div 
        ref={buttonRef} 
        onMouseMove={handleMouseMove} 
        onMouseLeave={handleMouseLeave}
        className="relative inline-flex items-center justify-center px-12 py-5 border border-transparent rounded-full text-background font-sans text-xs uppercase tracking-[0.2em] overflow-hidden group cursor-pointer bg-luxury shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="absolute inset-0 bg-primary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full" />
        <span className="relative z-10 group-hover:text-background transition-colors duration-500">{children}</span>
      </div>
    </Link>
  );
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Setup
      gsap.set(textRef.current?.children as Element[], { y: 100, opacity: 0 });
      gsap.set(overlayRef.current, { opacity: 1 });

      const tl = gsap.timeline();

      // Video scale and overlay fade
      tl.to(overlayRef.current, {
        opacity: 0.5, // Make gradient slightly more transparent
        duration: 2,
        ease: "power2.inOut"
      }, 0)
      .fromTo(videoRef.current, 
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.5, ease: "power3.out" },
        0
      )
      // Text Reveal
      .to(textRef.current?.children as Element[], {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out"
      }, 0.5);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen flex items-end justify-center bg-primary overflow-hidden"
    >
      {/* Cinematic Background */}
      <div 
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
        >
          {/* Coverr Free Fashion Video */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-walking-in-a-luxurious-environment-20164-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Organic Film Grain Overlay for Premium Texture */}
      <div 
        className="absolute inset-0 z-[1] opacity-[0.35] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* Premium Luxury Gradient Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 z-[2] bg-gradient-to-t from-primary via-primary/50 to-transparent pointer-events-none"
      />

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-32 flex flex-col items-center text-center">
        <div ref={textRef} className="flex flex-col items-center">
          <p className="text-background/80 font-sans text-xs md:text-sm uppercase tracking-[0.4em] mb-6 drop-shadow-sm font-medium">
            The New Era
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif  leading-[1.1] mb-8 drop-shadow-2xl text-white">
            Aura <br className="md:hidden" />
            <span className="italic font-light text-white">Collection</span>
          </h1>
          <p className="text-surface/80 font-sans text-sm md:text-base max-w-lg mb-12 leading-relaxed font-light drop-shadow-md">
            Discover a symphony of elegant gradients, cinematic visuals, and modern luxury. Redefining e-commerce with every pixel.
          </p>
          
          {/* Single Magnetic CTA Button */}
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <MagneticButton href="/products">
              Shop Collection
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
