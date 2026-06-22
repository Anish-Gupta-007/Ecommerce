"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AccountContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  return (
    <div className="w-full bg-background min-h-screen pt-32 pb-24 px-4 md:px-12 flex items-center justify-center">
      <div className="w-full max-w-md bg-surface/30 p-12 border border-surface">
        <h1 className="text-3xl font-serif text-primary mb-2 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-muted font-sans text-xs uppercase tracking-widest text-center mb-10">
          {isLogin ? "Sign in to your AURA account" : "Join the AURA Society"}
        </p>

        <form className="space-y-6" onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
            const body = isLogin ? { email, password } : { name, email, password };
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${endpoint}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });
            
            const data = await res.json();
            
            if (!res.ok) {
              toast.error(data.message || "Authentication failed");
              return;
            }
            
            toast.success(isLogin ? "Welcome back to AURA" : "Welcome to the AURA Society");
            
            // Save token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            
            // Redirect based on role
            if (data.user.role === "admin") {
              toast.info("Admin detected. Redirecting to Admin Portal...");
              window.location.href = "http://localhost:3001";
            } else {
              router.push(redirectPath);
            }
            
          } catch (error) {
            toast.error("Network error. Please try again later.");
          } finally {
            setIsLoading(false);
          }
        }}>
          {!isLogin && (
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest text-muted">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full bg-transparent border-b border-surface py-2 outline-none focus:border-primary font-sans text-sm transition-colors text-primary"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="font-sans text-xs uppercase tracking-widest text-muted">Email Address</label>
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
            {isLoading ? "Processing..." : isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-muted font-sans text-xs uppercase tracking-widest hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1"
          >
            {isLogin ? "Create an account" : "Already have an account?"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AccountContent />
    </Suspense>
  );
}
