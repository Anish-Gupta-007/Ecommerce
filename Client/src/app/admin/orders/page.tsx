"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, Eye } from "lucide-react";

// Mock fetch for admin orders table
const fetchAdminOrders = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return [
    { _id: "ORD-001", date: "2026-06-15", customer: "Elena R.", total: 4500, status: "Processing" },
    { _id: "ORD-002", date: "2026-06-14", customer: "Marcus T.", total: 1850, status: "Shipped" },
    { _id: "ORD-003", date: "2026-06-14", customer: "Sophia L.", total: 320, status: "Delivered" },
    { _id: "ORD-004", date: "2026-06-12", customer: "James W.", total: 8900, status: "Pending" },
  ];
};

export default function AdminOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchAdminOrders,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-success/10 text-success";
      case "Shipped": return "bg-primary/10 text-primary";
      case "Processing": return "bg-luxury/10 text-luxury";
      case "Pending": return "bg-error/10 text-error";
      default: return "bg-surface text-muted";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary mb-2">Orders</h1>
          <p className="text-muted font-sans text-sm uppercase tracking-widest">Manage fulfillment and tracking</p>
        </div>
      </header>

      {/* Controls */}
      <div className="mb-8 flex justify-between items-center bg-background p-4 border border-surface shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search by order ID or customer..." 
            className="w-full pl-10 pr-4 py-2 bg-transparent border border-surface focus:border-primary outline-none font-sans text-sm"
          />
        </div>
        <div className="flex gap-4">
          <select className="bg-transparent border border-surface px-4 py-2 font-sans text-sm outline-none cursor-pointer text-primary">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-background border border-surface shadow-sm overflow-x-auto">
        <table className="w-full text-left font-sans">
          <thead>
            <tr className="border-b border-surface bg-surface/30">
              <th className="p-4 text-xs tracking-widest uppercase text-muted font-normal">Order ID</th>
              <th className="p-4 text-xs tracking-widest uppercase text-muted font-normal">Date</th>
              <th className="p-4 text-xs tracking-widest uppercase text-muted font-normal">Customer</th>
              <th className="p-4 text-xs tracking-widest uppercase text-muted font-normal">Total</th>
              <th className="p-4 text-xs tracking-widest uppercase text-muted font-normal">Status</th>
              <th className="p-4 text-xs tracking-widest uppercase text-muted font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3].map(n => (
                <tr key={n} className="border-b border-surface animate-pulse">
                  <td className="p-4"><div className="h-4 w-20 bg-surface" /></td>
                  <td className="p-4"><div className="h-4 w-24 bg-surface" /></td>
                  <td className="p-4"><div className="h-4 w-32 bg-surface" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-surface" /></td>
                  <td className="p-4"><div className="h-6 w-24 bg-surface rounded" /></td>
                  <td className="p-4"><div className="h-4 w-8 bg-surface ml-auto" /></td>
                </tr>
              ))
            ) : orders?.map(order => (
              <tr key={order._id} className="border-b border-surface hover:bg-surface/20 transition-colors">
                <td className="p-4 font-medium text-primary">{order._id}</td>
                <td className="p-4 text-sm text-muted">{order.date}</td>
                <td className="p-4 text-sm text-primary">{order.customer}</td>
                <td className="p-4 text-sm text-primary font-medium">₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end">
                    <button className="text-muted hover:text-primary transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
