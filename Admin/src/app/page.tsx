"use client";

import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Package, ShoppingCart, Users } from "lucide-react";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Fetch live admin stats
const fetchDashboardData = async () => {
  const token = localStorage.getItem("token");
  
  const [statsRes, ordersRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/dashboard/stats`, {
      headers: { "Authorization": `Bearer ${token}` }
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders?limit=5`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
  ]);

  if (!statsRes.ok || !ordersRes.ok) throw new Error("Failed to fetch dashboard data");
  
  const statsData = await statsRes.json();
  const ordersData = await ordersRes.json();
  
  return {
    stats: statsData.stats,
    recentOrders: ordersData.orders.slice(0, 5) // ensure 5 max
  };
};

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchDashboardData,
  });

  const stats = data?.stats;
  const recentOrders = data?.recentOrders;

  const cards = [
    { title: "Total Revenue", value: stats ? `$${stats.totalRevenue.toLocaleString()}` : "...", icon: TrendingUp, trend: "+12.5%" },
    { title: "Total Orders", value: stats ? stats.totalOrders : "...", icon: ShoppingCart, trend: "+5.2%" },
    { title: "Active Products", value: stats ? stats.totalProducts : "...", icon: Package, trend: "-1.5%" },
    { title: "Registered Users", value: stats ? stats.totalUsers : "...", icon: Users, trend: "+18.2%" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Dashboard Overview</h1>
        <p className="text-white/60 font-sans text-sm uppercase tracking-widest">Welcome back, Administrator</p>
      </header>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md p-6 border border-white/10 shadow-xl rounded-2xl hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-full">
                <card.icon className="w-5 h-5 text-luxury" />
              </div>
              <span className={`text-xs font-sans tracking-widest px-2 py-1 rounded-full ${card.trend.startsWith("+") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {card.trend}
              </span>
            </div>
            <h3 className="text-white/60 font-sans text-xs uppercase tracking-widest mb-1">{card.title}</h3>
            {isLoading ? (
              <div className="h-8 bg-white/10 animate-pulse w-1/2 mt-2 rounded" />
            ) : (
              <p className="text-2xl font-serif text-white">{card.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-serif text-white">Recent Orders</h2>
          <Link href="/orders" className="text-luxury hover:text-white transition-colors flex items-center gap-2 font-sans text-xs tracking-widest uppercase">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(n => <div key={n} className="h-12 bg-white/10 rounded animate-pulse" />)}
          </div>
        ) : recentOrders?.length === 0 ? (
          <div className="text-center py-12 text-white/60 font-sans tracking-widest uppercase text-sm border-2 border-dashed border-white/10 m-6 rounded-xl">
            No recent orders found
          </div>
        ) : (
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Order ID</th>
                <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Customer</th>
                <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Total</th>
                <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((order: any) => (
                <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white/90 font-medium text-xs">{order._id}</td>
                  <td className="p-4 text-sm text-white/80">{order.user?.name || "Unknown"}</td>
                  <td className="p-4 text-sm text-white/90 font-medium">${order.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-right">
                    <span className={`px-3 py-1 text-xs uppercase tracking-widest rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 
                      order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' : 
                      order.status === 'Processing' ? 'bg-luxury/20 text-luxury' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
