"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Search, Loader2, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const fetchAdminProducts = async (search: string, category: string) => {
  const query = new URLSearchParams();
  if (search) query.append("keyword", search);
  if (category && category !== "All Categories") query.append("category", category);
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products;
};

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products", search, category],
    queryFn: () => fetchAdminProducts(search, category),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: () => {
      toast.error("Failed to delete product");
    }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Products</h1>
          <p className="text-white/60 font-sans text-sm uppercase tracking-widest">Manage inventory and collections</p>
        </div>
        <Link href="/products/new" className="bg-white text-black px-6 py-3 font-sans text-xs tracking-widest uppercase flex items-center gap-2 hover:bg-luxury hover:text-white transition-colors rounded-full shadow-lg">
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </header>

      {/* Controls */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 backdrop-blur-md p-4 border border-white/10 shadow-xl rounded-2xl">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 bg-transparent border border-white/10 focus:border-white outline-none font-sans text-sm text-white placeholder-white/40 rounded-lg transition-colors"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent border border-white/10 px-4 py-2 font-sans text-sm outline-none cursor-pointer text-white rounded-lg focus:border-white transition-colors [&>option]:bg-[#2B2D26]"
          >
            <option>All Categories</option>
            <option>Timepieces</option>
            <option>Leather Goods</option>
            <option>Fragrances</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl overflow-x-auto">
        <table className="w-full text-left font-sans">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Product</th>
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Category</th>
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Price</th>
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium">Stock</th>
              <th className="p-4 text-xs tracking-widest uppercase text-white/60 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3].map(n => (
                <tr key={n} className="border-b border-white/10 animate-pulse">
                  <td className="p-4"><div className="h-10 w-32 bg-white/10 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-20 bg-white/10 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-white/10 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-12 bg-white/10 rounded" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-white/10 rounded ml-auto" /></td>
                </tr>
              ))
            ) : products?.map(product => (
              <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-white/10 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {product.images[0]?.url ? (
                        <Image src={product.images[0].url} alt={product.title} fill className="object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-white/40" />
                      )}
                    </div>
                    <span className="text-white/90 font-medium">{product.title}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-white/60">{product.category}</td>
                <td className="p-4 text-sm text-white/90 font-medium">${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs uppercase tracking-widest rounded-full ${product.stock > 10 ? 'bg-green-500/20 text-green-400' : product.stock > 0 ? 'bg-luxury/20 text-luxury' : 'bg-red-500/20 text-red-400'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/products/${product._id}/edit`} className="text-white/60 hover:text-white transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this product?")) {
                          deleteMutation.mutate(product._id);
                        }
                      }}
                      className="text-white/60 hover:text-red-400 transition-colors disabled:opacity-50"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
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
