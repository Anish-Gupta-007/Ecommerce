"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import Image from "next/image";

// Mock fetch for admin products table
const fetchAdminProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return [
    { _id: "1", name: "The Chronograph Eclipse", price: 4500, category: "Timepieces", stock: 12, images: ["/api/images/product-watch"] },
    { _id: "2", name: "Lumière Eau de Parfum", price: 285, category: "Fragrances", stock: 45, images: ["/api/images/product-perfume"] },
    { _id: "3", name: "Solstice Aviators", price: 420, category: "Accessories", stock: 8, images: ["/api/images/product-sunglasses"] },
    { _id: "4", name: "Classic Bifold Wallet", price: 350, category: "Leather Goods", stock: 0, images: ["/api/images/product-wallet"] },
  ];
};

export default function AdminProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchAdminProducts,
  });

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary mb-2">Products</h1>
          <p className="text-muted font-sans text-sm uppercase tracking-widest">Manage inventory and collections</p>
        </div>
        <button className="bg-primary text-background px-6 py-3 font-sans text-xs tracking-widest uppercase flex items-center gap-2 hover:bg-luxury transition-colors">
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </header>

      {/* Controls */}
      <div className="mb-8 flex justify-between items-center bg-background p-4 border border-surface shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 bg-transparent border border-surface focus:border-primary outline-none font-sans text-sm"
          />
        </div>
        <div className="flex gap-4">
          <select className="bg-transparent border border-surface px-4 py-2 font-sans text-sm outline-none cursor-pointer text-primary">
            <option>All Categories</option>
            <option>Timepieces</option>
            <option>Leather Goods</option>
            <option>Fragrances</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-background border border-surface shadow-sm overflow-x-auto">
        <table className="w-full text-left font-sans">
          <thead>
            <tr className="border-b border-surface bg-surface/30">
              <th className="p-4 text-xs tracking-widest uppercase text-muted font-normal">Product</th>
              <th className="p-4 text-xs tracking-widest uppercase text-muted font-normal">Category</th>
              <th className="p-4 text-xs tracking-widest uppercase text-muted font-normal">Price</th>
              <th className="p-4 text-xs tracking-widest uppercase text-muted font-normal">Stock</th>
              <th className="p-4 text-xs tracking-widest uppercase text-muted font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3].map(n => (
                <tr key={n} className="border-b border-surface animate-pulse">
                  <td className="p-4"><div className="h-10 w-32 bg-surface" /></td>
                  <td className="p-4"><div className="h-4 w-20 bg-surface" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-surface" /></td>
                  <td className="p-4"><div className="h-4 w-12 bg-surface" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-surface ml-auto" /></td>
                </tr>
              ))
            ) : products?.map(product => (
              <tr key={product._id} className="border-b border-surface hover:bg-surface/20 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-surface flex-shrink-0">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <span className="text-primary font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted">{product.category}</td>
                <td className="p-4 text-sm text-primary font-medium">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs uppercase tracking-widest ${product.stock > 10 ? 'bg-success/10 text-success' : product.stock > 0 ? 'bg-luxury/10 text-luxury' : 'bg-error/10 text-error'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-muted hover:text-primary transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-muted hover:text-error transition-colors">
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
