"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/account?redirect=/checkout");
    }
  }, [router]);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12 bg-[#141512] flex flex-col items-center justify-center">
        <h1 className="font-serif text-3xl text-white mb-4">Your cart is empty</h1>
        <Link href="/products" className="text-luxury border-b border-luxury pb-1 font-sans text-xs uppercase tracking-widest hover:text-white transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (paymentMethod === "COD") {
        // Place COD Order directly
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderItems: items.map(item => ({ 
              product: item._id, 
              title: item.title,
              image: item.image,
              price: item.price,
              quantity: item.quantity 
            })),
            shippingAddress,
            paymentMethod: "COD",
            totalAmount: getCartTotal()
          }),
        });

        const data = await res.json();
        if (data.success) {
          toast.success("Order placed successfully via COD!");
          clearCart();
          router.push("/account"); // Redirect to orders or account
        } else {
          toast.error(data.message || "Failed to place order.");
        }
      } else if (paymentMethod === "Razorpay") {
        // 1. Create Razorpay order on backend
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/payment/razorpay`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: getCartTotal() }),
        });

        const data = await res.json();
        
        if (!data.success) {
          toast.error(data.message || "Failed to initialize payment.");
          setIsLoading(false);
          return;
        }

        // 2. Open Razorpay Checkout
        const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RcqBGtB5tOewQW";
        
        // If no real keys are provided, simulate the payment for demo purposes
        if (!rzpKey || rzpKey === "rzp_test_dummy_key" || data.isMocked) {
          toast.info("Test Mode: Simulating successful Razorpay payment...");
          setTimeout(async () => {
            try {
              const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  orderItems: items.map(item => ({ 
                    product: item._id, 
                    title: item.title,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity 
                  })),
                  shippingAddress,
                  paymentMethod: "Razorpay",
                  totalAmount: getCartTotal(),
                  paymentResult: {
                    id: `pay_mock_${Date.now()}`,
                    status: "Paid",
                    update_time: new Date().toISOString(),
                  }
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                toast.success("Payment successful! Order placed.");
                clearCart();
                router.push("/account");
              } else {
                toast.error(verifyData.message || "Order verification failed.");
              }
            } catch (error) {
              toast.error("Failed to verify mock payment.");
            } finally {
              setIsLoading(false);
            }
          }, 2000);
          return;
        }

        const options = {
          key: rzpKey,
          amount: data.order.amount,
          currency: "INR",
          name: "AURA Luxury",
          description: "Premium Purchase",
          order_id: data.order.id,
          handler: async function (response: any) {
            // 3. Verify and Save Order on success
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                orderItems: items.map(item => ({ 
                  product: item._id, 
                  title: item.title,
                  image: item.image,
                  price: item.price,
                  quantity: item.quantity 
                })),
                shippingAddress,
                paymentMethod: "Razorpay",
                totalAmount: getCartTotal(),
                paymentResult: {
                  id: response.razorpay_payment_id,
                  status: "Paid",
                  update_time: new Date().toISOString(),
                }
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success("Payment successful! Order placed.");
              clearCart();
              router.push("/account");
            } else {
              toast.error(verifyData.message || "Failed to place order.");
            }
            setIsLoading(false);
          },
          theme: {
            color: "#3A3D34"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any){
           toast.error("Payment failed. Please try again.");
           setIsLoading(false);
        });
        rzp.open();
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12 bg-[#141512]">
      <div className="max-w-[1200px] mx-auto">
        <Link href="/products" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors font-sans text-[10px] uppercase tracking-[0.2em] mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Checkout Form - Left */}
          <div className="lg:col-span-7">
            <h1 className="font-serif text-4xl text-white mb-10 tracking-tight">Secure Checkout</h1>
            
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-12">
              {/* Shipping Information */}
              <div className="space-y-6">
                <h2 className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/50 border-b border-white/10 pb-4">
                  1. Shipping Information
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-sans text-xs text-white/60 uppercase tracking-widest">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:border-luxury outline-none transition-colors" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-sans text-xs text-white/60 uppercase tracking-widest">Phone</label>
                      <input 
                        required
                        type="text" 
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:border-luxury outline-none transition-colors" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-xs text-white/60 uppercase tracking-widest">Street Address</label>
                    <input 
                      required
                      type="text" 
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:border-luxury outline-none transition-colors" 
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="font-sans text-xs text-white/60 uppercase tracking-widest">City</label>
                      <input 
                        required
                        type="text" 
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:border-luxury outline-none transition-colors" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-sans text-xs text-white/60 uppercase tracking-widest">State</label>
                      <input 
                        required
                        type="text" 
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:border-luxury outline-none transition-colors" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-sans text-xs text-white/60 uppercase tracking-widest">Pincode</label>
                      <input 
                        required
                        type="text" 
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:border-luxury outline-none transition-colors" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-6">
                <h2 className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/50 border-b border-white/10 pb-4">
                  2. Payment Method
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`cursor-pointer border p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${paymentMethod === 'Razorpay' ? 'border-luxury bg-luxury/10' : 'border-white/10 hover:border-white/30 bg-white/[0.02]'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="Razorpay" 
                      className="sr-only" 
                      checked={paymentMethod === 'Razorpay'}
                      onChange={() => setPaymentMethod('Razorpay')}
                    />
                    <ShieldCheck className={`w-8 h-8 ${paymentMethod === 'Razorpay' ? 'text-luxury' : 'text-white/40'}`} />
                    <span className="font-sans text-xs uppercase tracking-widest text-white text-center">Pay Online<br/><span className="text-[9px] text-white/40">(Credit/Debit/UPI)</span></span>
                  </label>
                  
                  <label className={`cursor-pointer border p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${paymentMethod === 'COD' ? 'border-luxury bg-luxury/10' : 'border-white/10 hover:border-white/30 bg-white/[0.02]'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="COD" 
                      className="sr-only"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <Truck className={`w-8 h-8 ${paymentMethod === 'COD' ? 'text-luxury' : 'text-white/40'}`} />
                    <span className="font-sans text-xs uppercase tracking-widest text-white text-center">Cash on Delivery<br/><span className="text-[9px] text-white/40">(Pay at Doorstep)</span></span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary - Right */}
          <div className="lg:col-span-5">
            <div className="bg-white/[0.02] border border-white/10 p-8 sticky top-32 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
              <h2 className="font-serif text-2xl text-white mb-8 border-b border-white/10 pb-4">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                {items.map(item => (
                  <div key={item._id} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-white/5 flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      ) : (
                        <span className="text-[8px] uppercase tracking-widest text-white/40">No Image</span>
                      )}
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <h3 className="font-serif text-sm text-white line-clamp-1">{item.title}</h3>
                      <p className="font-sans text-xs text-white/50 mt-1">Qty: {item.quantity}</p>
                      <p className="font-sans text-sm text-white mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6 mb-8">
                <div className="flex justify-between font-sans text-xs text-white/70">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal().toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between font-sans text-xs text-white/70">
                  <span>Shipping</span>
                  <span>Complimentary</span>
                </div>
                <div className="flex justify-between font-serif text-2xl text-white pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span>₹{getCartTotal().toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={isLoading}
                className="w-full bg-white text-[#141512] py-5 font-sans text-xs uppercase tracking-[0.2em] font-medium hover:bg-luxury hover:text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isLoading ? "Processing..." : "Place Order"}
                {!isLoading && <CheckCircle2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
