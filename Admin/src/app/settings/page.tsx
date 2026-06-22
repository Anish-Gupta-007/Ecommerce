"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    toast.success("Settings updated successfully");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Settings</h1>
        <p className="text-white/60 font-sans text-sm uppercase tracking-widest">Configure platform preferences</p>
      </header>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl">
        <form onSubmit={handleSave} className="p-8 space-y-12">
          
          {/* General Settings */}
          <section>
            <h2 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-widest text-white/60">Store Name</label>
                <input 
                  type="text" 
                  defaultValue="AURA"
                  className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-white font-sans text-sm transition-colors text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-widest text-white/60">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="concierge@aura-commerce.com"
                  className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-white font-sans text-sm transition-colors text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-widest text-white/60">Currency</label>
                <select className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-white font-sans text-sm transition-colors text-white cursor-pointer [&>option]:bg-[#2B2D26]">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-widest text-white/60">Timezone</label>
                <select className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-white font-sans text-sm transition-colors text-white cursor-pointer [&>option]:bg-[#2B2D26]">
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                </select>
              </div>
            </div>
          </section>

          {/* Payment & Tax */}
          <section>
            <h2 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">Payment & Tax</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-widest text-white/60">Stripe Public Key</label>
                <input 
                  type="password" 
                  defaultValue="pk_test_1234567890"
                  className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-white font-sans text-sm transition-colors text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-widest text-white/60">Tax Rate (%)</label>
                <input 
                  type="number" 
                  defaultValue="8.5"
                  step="0.1"
                  className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-white font-sans text-sm transition-colors text-white"
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="pt-8 border-t border-white/10 flex justify-end">
            <button 
              disabled={isLoading}
              className="bg-white text-black px-8 py-3 font-sans text-xs uppercase tracking-widest hover:bg-luxury hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50 rounded-full shadow-lg"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
