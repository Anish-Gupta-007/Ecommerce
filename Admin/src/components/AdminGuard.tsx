"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const controls = useAnimation();

  useEffect(() => {
    if (email.length === 4) {
      controls.start({
        scale: [1, 1.02, 1],
        boxShadow: [
          "0 30px 60px -15px rgba(0,0,0,0.8), 0 0 0px rgba(212,175,55,0)",
          "0 30px 60px -15px rgba(0,0,0,0.8), 0 0 60px rgba(212,175,55,0.3)",
          "0 30px 60px -15px rgba(0,0,0,0.8), 0 0 0px rgba(212,175,55,0)"
        ],
        transition: { duration: 0.8, ease: "easeInOut" }
      });
    }
  }, [email, controls]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }
      
      if (data.user.role !== "admin") {
        toast.error("Unauthorized: Admin access required.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsAuthenticated(true);
      toast.success("Welcome to AURA Admin");
    } catch (error) {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) return null;

  if (!isAuthenticated) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512] relative overflow-hidden perspective-[1000px]">
        
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay z-0" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[#D4AF37] rounded-full blur-[200px] pointer-events-none mix-blend-screen z-0"
          animate={{ 
            scale: Math.min(1 + (email.length * 0.05), 1.6),
            opacity: Math.min(email.length * 0.02, 0.3)
          }}
          transition={{ type: "spring", stiffness: 50 }}
        />

        <div className="w-full max-w-[440px] relative z-10 px-4">
          <motion.div 
            animate={controls}
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#101210]/60 backdrop-blur-xl p-10 sm:p-14 border border-[#3A3D34]/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative rounded-sm overflow-hidden"
          >
            
            <motion.div 
              className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/0 via-[#D4AF37]/5 to-transparent pointer-events-none"
              animate={{ 
                opacity: email.length > 3 ? 1 : 0,
                backgroundPosition: ["0% 0%", "100% 100%"] 
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
            />

            <div className="mb-10 text-center relative z-10">
              <h1 className="text-3xl font-serif text-[#E8E9E4] tracking-wide mb-2">Admin Portal</h1>
              <p className="text-[#A4A69C] font-sans text-[9px] uppercase tracking-[0.3em]">
                Secure Authentication Required
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-7 relative z-10">
              <div className="space-y-2 group relative">
                <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#A4A69C] group-focus-within:text-[#D4AF37] transition-colors flex justify-between">
                  Email
                  <AnimatePresence>
                    {email.length > 4 && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0, rotate: 45 }}
                        className="text-[#D4AF37]"
                      >
                        <Sparkles className="w-3 h-3" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-[#3A3D34] py-2 outline-none font-sans text-sm text-[#E8E9E4] transition-all px-1 peer relative z-10"
                  />
                  <motion.div 
                    className="absolute bottom-0 left-0 h-[1.5px] bg-[#D4AF37] shadow-[0_0_8px_#D4AF37] z-20"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min((email.length / 15) * 100, 100)}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </div>
              </div>
              
              <div className="space-y-2 group relative">
                <label className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#A4A69C] group-focus-within:text-[#D4AF37] transition-colors">
                  Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-[#3A3D34] py-2 outline-none font-sans text-sm text-[#E8E9E4] transition-all px-1 pr-10 peer relative z-10"
                  />
                  <motion.div 
                    className="absolute bottom-0 left-0 h-[1.5px] bg-[#D4AF37] shadow-[0_0_8px_#D4AF37] z-20"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min((password.length / 8) * 100, 100)}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#A4A69C] hover:text-[#E8E9E4] transition-colors p-2 z-30"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading} 
                className="w-full group relative overflow-hidden bg-[#D4AF37] text-[#101210] py-4 font-sans text-[10px] uppercase tracking-[0.2em] font-semibold transition-all mt-10 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
              >
                <motion.div 
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                  animate={{ translateX: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  {isLoading ? "Authenticating..." : "Sign In"}
                  {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
