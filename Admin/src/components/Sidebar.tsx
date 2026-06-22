"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Menu, X } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: Package },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Users", href: "/users", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1A1C16]/90 backdrop-blur-md border-b border-white/10 z-40 flex items-center justify-between px-4">
        <Link href="/" className="font-serif text-xl tracking-widest text-white">
          AURA
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={clsx(
        "w-64 bg-[#141512]/95 md:bg-transparent border-r border-white/10 flex flex-col h-screen fixed md:sticky top-0 z-50 backdrop-blur-xl transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl tracking-widest text-white" onClick={() => setIsOpen(false)}>
            AURA
            <span className="block font-sans text-xs uppercase tracking-widest text-white/50 mt-1">
              Admin Portal
            </span>
          </Link>
          <button className="md:hidden text-white/60" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link 
              key={link.name}
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 font-sans text-sm tracking-widest uppercase transition-colors",
                isActive 
                  ? "text-white bg-white/10 rounded-lg" 
                  : "text-white/60 hover:text-white hover:bg-white/5 rounded-lg"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-white/60 hover:text-red-400 font-sans text-sm tracking-widest uppercase transition-colors rounded-lg hover:bg-white/5"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
      </aside>
    </>
  );
}
