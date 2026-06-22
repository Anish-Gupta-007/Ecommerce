"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Eye, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

// Fetch from API
const fetchAdminOrders = async (search: string, status: string) => {
  const query = new URLSearchParams();
  if (search) query.append("keyword", search);
  if (status && status !== "All Statuses") query.append("status", status);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders?${query.toString()}`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  const data = await res.json();
  return data.orders;
};

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ orderStatus: status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated in real-time");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update order status");
    }
  });

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["admin-orders", search, statusFilter],
    queryFn: () => fetchAdminOrders(search, statusFilter),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Shipped": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Processing": return "bg-luxury/20 text-luxury border-luxury/30";
      case "Packaging": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Out For Delivery": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Cancelled": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-white/10 text-white/60 border-white/20";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Orders</h1>
          <p className="text-white/60 font-sans text-sm uppercase tracking-widest">Manage fulfillment and tracking</p>
        </div>
      </header>

      {/* Controls */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 backdrop-blur-md p-4 border border-white/10 shadow-xl rounded-2xl">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID..." 
            className="w-full pl-10 pr-4 py-2 bg-transparent border border-white/10 focus:border-white outline-none font-sans text-sm text-white placeholder-white/40 rounded-lg transition-colors"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border border-white/10 px-4 py-2 font-sans text-sm outline-none cursor-pointer text-white rounded-lg focus:border-white transition-colors [&>option]:bg-[#2B2D26]"
          >
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Packaging</option>
            <option>Shipped</option>
            <option>Out For Delivery</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl overflow-x-auto">
        <table className="w-full text-left font-sans">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Order ID</th>
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Date</th>
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Customer</th>
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Total</th>
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Status</th>
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3].map(n => (
                <tr key={n} className="border-b border-white/10 animate-pulse">
                  <td className="p-4"><div className="h-4 w-20 bg-white/10 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-24 bg-white/10 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-32 bg-white/10 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-white/10 rounded" /></td>
                  <td className="p-4"><div className="h-6 w-24 bg-white/10 rounded-full" /></td>
                  <td className="p-4"><div className="h-4 w-8 bg-white/10 rounded ml-auto" /></td>
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-red-400 font-sans tracking-widest text-sm uppercase bg-white/5 rounded-lg m-4">
                  Failed to load orders. Ensure you are logged in as admin.
                </td>
              </tr>
            ) : orders?.map((order: any) => (
              <React.Fragment key={order._id}>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white/90 text-xs">{order._id}</td>
                  <td className="p-4 text-sm text-white/60">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-sm text-white/80">{order.user?.name || "Unknown"}</td>
                  <td className="p-4 text-sm text-white/90 font-medium">${order.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4">
                    <div className="relative inline-block w-full max-w-[140px]">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateStatusMutation.mutate({ id: order._id, status: e.target.value })}
                        disabled={updateStatusMutation.isPending}
                        className={`w-full appearance-none px-3 py-1.5 pr-8 text-[10px] uppercase tracking-widest font-bold rounded-full border cursor-pointer transition-all outline-none disabled:opacity-50 ${getStatusColor(order.orderStatus)} [&>option]:bg-[#2B2D26] [&>option]:text-white [&>option]:font-sans [&>option]:tracking-normal`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Packaging">Packaging</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out For Delivery">Out For Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${getStatusColor(order.orderStatus).split(' ')[1]}`} />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                        className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
                      >
                        <Eye className="w-4 h-4" />
                        {expandedOrder === order._id ? "Close" : "View"}
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedOrder === order._id && (
                  <tr className="bg-white/5 border-b border-white/10">
                    <td colSpan={6} className="p-6">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-serif text-white mb-4">Shipping Details</h4>
                          <p className="text-sm font-sans text-white/60 leading-relaxed">
                            {order.shippingAddress?.street}<br />
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                            {order.shippingAddress?.country}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-serif text-white mb-4">Order Items</h4>
                          <div className="space-y-3">
                            {order.orderItems?.map((item: any) => (
                              <div key={item._id} className="flex justify-between items-center text-sm font-sans">
                                <span className="text-white/60">x{item.quantity} {item.name || item.product?.title || "Product"}</span>
                                <span className="text-white/90">${item.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
