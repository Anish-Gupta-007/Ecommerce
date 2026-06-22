import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-background border-r border-surface flex flex-col hidden md:flex">
        <div className="p-8 border-b border-surface">
          <Link href="/admin" className="font-serif text-2xl tracking-widest text-primary">
            AURA
            <span className="block font-sans text-xs uppercase tracking-widest text-muted mt-1">
              Admin Portal
            </span>
          </Link>
        </div>

        <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-primary bg-surface/50 font-sans text-sm tracking-widest uppercase hover:bg-surface transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary font-sans text-sm tracking-widest uppercase hover:bg-surface/50 transition-colors">
            <Package className="w-4 h-4" />
            Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary font-sans text-sm tracking-widest uppercase hover:bg-surface/50 transition-colors">
            <ShoppingCart className="w-4 h-4" />
            Orders
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary font-sans text-sm tracking-widest uppercase hover:bg-surface/50 transition-colors">
            <Users className="w-4 h-4" />
            Users
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-muted hover:text-primary font-sans text-sm tracking-widest uppercase hover:bg-surface/50 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-surface">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-muted hover:text-error font-sans text-sm tracking-widest uppercase transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
