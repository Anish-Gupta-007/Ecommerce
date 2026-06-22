"use client";

import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Package, ShoppingCart, Users } from "lucide-react";

// Mock fetching function for admin stats
const fetchStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    revenue: 124500,
    orders: 342,
    products: 85,
    users: 1205
  };
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
  });

  const cards = [
    { title: "Total Revenue", value: stats ? `₹${stats.revenue.toLocaleString('en-IN')}` : "...", icon: TrendingUp, trend: "+12.5%" },
    { title: "Total Orders", value: stats ? stats.orders : "...", icon: ShoppingCart, trend: "+5.2%" },
    { title: "Active Products", value: stats ? stats.products : "...", icon: Package, trend: "-1.5%" },
    { title: "Registered Users", value: stats ? stats.users : "...", icon: Users, trend: "+18.2%" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-serif text-primary mb-2">Dashboard Overview</h1>
        <p className="text-muted font-sans text-sm uppercase tracking-widest">Welcome back, Administrator</p>
      </header>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <div key={i} className="bg-background p-6 border border-surface shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-surface/50 rounded-none">
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <span className={`text-xs font-sans tracking-widest ${card.trend.startsWith("+") ? "text-success" : "text-error"}`}>
                {card.trend}
              </span>
            </div>
            <h3 className="text-muted font-sans text-xs uppercase tracking-widest mb-1">{card.title}</h3>
            {isLoading ? (
              <div className="h-8 bg-surface animate-pulse w-1/2 mt-2" />
            ) : (
              <p className="text-2xl font-serif text-primary">{card.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity (Placeholder for future development) */}
      <div className="bg-background border border-surface shadow-sm p-8">
        <h2 className="text-xl font-serif text-primary mb-6">Recent Orders</h2>
        <div className="text-center py-12 text-muted font-sans tracking-widest uppercase text-sm border-2 border-dashed border-surface">
          Order table goes here
        </div>
      </div>
    </div>
  );
}
