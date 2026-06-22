"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }, 1000);
  };

  return (
    <section className="w-full bg-primary py-24 md:py-32 px-4 md:px-12 text-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        {/* Subtle background texture/pattern could go here */}
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
      </div>
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
          The AURA Society
        </h2>
        <p className="text-background/70 font-sans text-lg mb-12 font-light">
          Join our exclusive newsletter to receive early access to new collections, 
          private events, and editorial content.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto">
          <div className="relative flex items-center border-b border-background/30 focus-within:border-background transition-colors duration-300 pb-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-transparent border-none outline-none text-background placeholder:text-background/40 font-sans text-sm tracking-widest uppercase pr-12"
              disabled={status === "loading" || status === "success"}
              required
            />
            <button 
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-background/60 hover:text-background transition-colors disabled:opacity-50"
            >
              {status === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-luxury" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <div className="mt-8 overflow-hidden h-6">
            <p className={`text-xs tracking-widest text-luxury font-sans uppercase transition-transform duration-500 ${status === "success" ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
              Welcome to the society.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
