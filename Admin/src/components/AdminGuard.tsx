"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check token from URL (if redirected from Client) or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      // Clean URL
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface/30 p-12 border border-surface shadow-xl">
          <h1 className="text-3xl font-serif text-primary mb-2 text-center">Admin Portal</h1>
          <p className="text-muted font-sans text-xs uppercase tracking-widest text-center mb-10">
            Secure Authentication Required
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest text-muted">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-surface py-2 outline-none focus:border-primary font-sans text-sm transition-colors text-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest text-muted">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-surface py-2 outline-none focus:border-primary font-sans text-sm transition-colors text-primary"
              />
            </div>
            <button disabled={isLoading} className="w-full bg-primary text-background py-4 font-sans text-xs uppercase tracking-widest hover:bg-luxury transition-colors mt-8 disabled:opacity-50">
              {isLoading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
