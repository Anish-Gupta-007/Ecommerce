"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Package, Clock, CheckCircle2, Truck, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function MyOrdersPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/account?redirect=/orders");
    } else {
      setToken(t);
    }
  }, [router]);

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/my-orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      return data.orders;
    },
    enabled: !!token,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending": return <Clock className="w-4 h-4 text-error" />;
      case "Processing": return <Package className="w-4 h-4 text-luxury" />;
      case "Shipped": return <Truck className="w-4 h-4 text-primary" />;
      case "Delivered": return <CheckCircle2 className="w-4 h-4 text-success" />;
      default: return <Clock className="w-4 h-4 text-muted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-500/20 text-green-400";
      case "Shipped": return "bg-blue-500/20 text-blue-400";
      case "Processing": return "bg-luxury/20 text-luxury";
      case "Pending": return "bg-red-500/20 text-red-400";
      default: return "bg-white/10 text-white/60";
    }
  };

  if (!token) return <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512]" />; // Prevent flash before redirect

  return (
    <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512] min-h-screen text-white">
      
      <main className="max-w-6xl mx-auto px-4 md:px-12 pt-32 pb-24">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">My Orders</h1>
          <p className="text-white/60 font-sans text-xs md:text-sm uppercase tracking-widest">
            Track and manage your recent purchases
          </p>
        </motion.header>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-40 bg-white/5 animate-pulse rounded-2xl border border-white/10" />
            ))}
          </div>
        ) : isError ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center border border-white/10 bg-white/5 rounded-2xl shadow-xl"
          >
            <p className="text-red-400 font-sans text-xs uppercase tracking-widest">Failed to load your orders.</p>
          </motion.div>
        ) : !orders || orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-16 text-center border border-white/10 bg-white/5 rounded-2xl shadow-xl flex flex-col items-center backdrop-blur-md"
          >
            <Package className="w-12 h-12 text-white/40 mb-4" />
            <p className="text-white font-serif text-xl mb-2">No orders found</p>
            <p className="text-white/60 font-sans text-xs uppercase tracking-widest mb-8">You haven't placed any orders yet.</p>
            <Link href="/products" className="bg-white text-black px-8 py-3 font-sans text-xs uppercase tracking-widest hover:bg-luxury hover:text-white transition-colors rounded-full shadow-lg">
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {orders.map((order: any, index: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                key={order._id} 
                className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row"
              >
                
                {/* Order Summary Info */}
                <div className="p-6 md:p-8 md:w-1/3 bg-white/5 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-sans text-xs uppercase tracking-widest text-white/60">Order ID</span>
                      <span className={`px-3 py-1 font-sans text-[10px] uppercase tracking-widest rounded-full ${getStatusColor(order.status || order.orderStatus || 'Pending')} flex items-center gap-1 shadow-sm`}>
                        {getStatusIcon(order.status || order.orderStatus || 'Pending')}
                        {order.status || order.orderStatus || 'Pending'}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-white/90 mb-6 truncate">{order._id}</p>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <span className="block font-sans text-[10px] uppercase tracking-widest text-white/60 mb-1">Date Placed</span>
                        <span className="font-sans text-sm text-white/90">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div>
                        <span className="block font-sans text-[10px] uppercase tracking-widest text-white/60 mb-1">Total Amount</span>
                        <span className="font-sans text-lg text-white font-medium">${order.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link href={`/orders/${order._id}`} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-sans text-xs uppercase tracking-widest w-max mt-4 md:mt-0">
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                </div>

                {/* Order Items Preview */}
                <div className="p-6 md:p-8 md:w-2/3">
                  <h3 className="font-serif text-lg text-white mb-6">Order Items</h3>
                  <div className="space-y-6">
                    {order.orderItems?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-center group">
                        <div className="relative w-20 h-24 bg-white/5 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 flex items-center justify-center">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.title || "Product"} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              loading="lazy" 
                              onError={(e) => {
                                e.currentTarget.onerror = null; // Prevent infinite loop
                                e.currentTarget.style.display = 'none'; // Hide broken image
                              }}
                            />
                          ) : (
                            <Package className="w-6 h-6 text-white/40" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif text-white/90 text-base md:text-lg mb-1">{item.title || "Aura Product"}</h4>
                          <p className="font-sans text-xs uppercase tracking-widest text-white/60 mb-2">Qty: {item.quantity}</p>
                          <p className="font-sans text-sm text-luxury">${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
