"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Package, Clock, CheckCircle2, Truck, ArrowLeft, MapPin, CreditCard, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push(`/account?redirect=/orders/${id}`);
    } else {
      setToken(t);
    }
  }, [router, id]);

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch order details");
      const data = await res.json();
      return data.order;
    },
    enabled: !!token && !!id,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending": return <Clock className="w-5 h-5 text-red-400" />;
      case "Processing": return <Package className="w-5 h-5 text-luxury" />;
      case "Shipped": return <Truck className="w-5 h-5 text-blue-400" />;
      case "Delivered": return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      default: return <Clock className="w-5 h-5 text-white/40" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Shipped": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Processing": return "bg-luxury/20 text-luxury border-luxury/30";
      case "Pending": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-white/10 text-white/60 border-white/20";
    }
  };

  if (!token) return <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512]" />;

  return (
    <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512] min-h-screen text-white overflow-hidden">
      
      <main className="max-w-6xl mx-auto px-4 md:px-12 pt-32 pb-24">
        
        <Link href="/orders" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors font-sans text-[10px] uppercase tracking-[0.2em] mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-24 bg-white/5 rounded-2xl border border-white/10 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-white/5 rounded-2xl border border-white/10" />
              <div className="h-96 bg-white/5 rounded-2xl border border-white/10" />
            </div>
          </div>
        ) : isError || !order ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-16 text-center border border-white/10 bg-white/5 rounded-2xl shadow-xl backdrop-blur-md"
          >
            <p className="text-red-400 font-sans text-xs uppercase tracking-widest mb-4">Order not found or access denied.</p>
            <Link href="/orders" className="text-white hover:text-luxury transition-colors font-sans text-[10px] uppercase tracking-[0.2em] underline">
              Return to Orders
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Header Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-2xl md:text-4xl font-serif text-white mb-2">Order Details</h1>
                <p className="font-mono text-xs md:text-sm text-white/60">ID: {order._id}</p>
                <p className="font-sans text-xs text-white/40 uppercase tracking-widest mt-2">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className={`px-5 py-2.5 rounded-full border flex items-center gap-2 shadow-lg backdrop-blur-md ${getStatusColor(order.orderStatus || order.status || 'Pending')}`}>
                {getStatusIcon(order.orderStatus || order.status || 'Pending')}
                <span className="font-sans text-xs uppercase tracking-widest font-bold">
                  {order.orderStatus || order.status || 'Pending'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Order Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-6 md:p-10">
                  <h2 className="font-serif text-2xl text-white mb-8 border-b border-white/10 pb-4">Items Ordered</h2>
                  <div className="space-y-8">
                    {order.orderItems?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-6 items-center group">
                        <div className="relative w-24 h-32 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 flex items-center justify-center">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.title || "Product"} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              loading="lazy" 
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Package className="w-8 h-8 text-white/20" />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="font-serif text-white/90 text-lg md:text-xl mb-1 group-hover:text-luxury transition-colors">{item.title || "Aura Product"}</h4>
                          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">Item ID: {item.product}</p>
                          <div className="flex justify-between items-end">
                            <p className="font-sans text-xs uppercase tracking-widest text-white/60">Qty: {item.quantity}</p>
                            <p className="font-sans text-base text-luxury">₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Summary & Info */}
              <div className="space-y-8">
                
                {/* Order Summary */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-6 md:p-8">
                  <h2 className="font-serif text-xl text-white mb-6 border-b border-white/10 pb-4">Payment Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between font-sans text-xs text-white/70">
                      <span>Subtotal</span>
                      <span>₹{order.totalAmount?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between font-sans text-xs text-white/70">
                      <span>Shipping</span>
                      <span className="text-luxury">Complimentary</span>
                    </div>
                  </div>
                  <div className="flex justify-between font-serif text-2xl text-white pt-4 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-luxury">₹{order.totalAmount?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-6 md:p-8">
                  <h2 className="font-serif text-xl text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-white/40" />
                    Shipping Details
                  </h2>
                  {order.shippingAddress ? (
                    <div className="space-y-2 font-sans text-sm text-white/70 leading-relaxed">
                      <p className="font-medium text-white">{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                      <p className="pt-2 text-white/40 text-xs">Phone: {order.shippingAddress.phone}</p>
                    </div>
                  ) : (
                    <p className="font-sans text-xs text-white/40">No shipping details available.</p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-6 md:p-8">
                  <h2 className="font-serif text-xl text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-white/40" />
                    Payment Method
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      {order.paymentMethod === 'Razorpay' ? (
                        <ShieldCheck className="w-5 h-5 text-luxury" />
                      ) : (
                        <Truck className="w-5 h-5 text-luxury" />
                      )}
                    </div>
                    <div>
                      <p className="font-sans text-sm text-white">{order.paymentMethod === 'Razorpay' ? 'Paid Online' : 'Cash on Delivery'}</p>
                      {order.paymentResult?.status === 'Paid' && (
                        <p className="font-sans text-[10px] uppercase tracking-widest text-green-400 mt-1">Payment Verified</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </motion.div>
        )}
      </main>
    </div>
  );
}
