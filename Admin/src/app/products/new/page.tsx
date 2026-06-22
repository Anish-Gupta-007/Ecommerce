"use client";

import { useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Timepieces");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (images.length + filesArray.length > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }
      
      setImages(prev => [...prev, ...filesArray]);
      
      // Create preview URLs
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("description", description);
      
      images.forEach((img) => {
        formData.append("images", img);
      });

      // TODO: Replace with actual token from Auth state once implemented
      const token = localStorage.getItem("token") || "mock-token";

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      toast.success("Product created successfully!");
      router.push("/products");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products" className="p-2 bg-surface hover:bg-surface/80 transition-colors rounded-full">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif text-primary">New Product</h1>
            <p className="text-muted font-sans text-xs uppercase tracking-widest mt-1">Add a new luxury item</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-background border border-surface shadow-sm p-8 space-y-6">
          <h2 className="font-serif text-xl text-primary border-b border-surface pb-4">Basic Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest text-muted">Product Title</label>
              <input 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                type="text" 
                className="w-full bg-surface/30 border border-surface px-4 py-3 outline-none focus:border-primary font-sans text-sm transition-colors"
                placeholder="e.g. The Noir Tote"
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest text-muted">Category</label>
              <select 
                required
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-surface/30 border border-surface px-4 py-3 outline-none focus:border-primary font-sans text-sm transition-colors"
              >
                <option>Timepieces</option>
                <option>Leather Goods</option>
                <option>Fragrances</option>
                <option>Jewelry</option>
                <option>Accessories</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest text-muted">Price (USD)</label>
              <input 
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                type="number" 
                min="0"
                step="0.01"
                className="w-full bg-surface/30 border border-surface px-4 py-3 outline-none focus:border-primary font-sans text-sm transition-colors"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest text-muted">Initial Stock</label>
              <input 
                required
                value={stock}
                onChange={e => setStock(e.target.value)}
                type="number" 
                min="0"
                className="w-full bg-surface/30 border border-surface px-4 py-3 outline-none focus:border-primary font-sans text-sm transition-colors"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-sans text-xs uppercase tracking-widest text-muted">Description</label>
            <textarea 
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              className="w-full bg-surface/30 border border-surface px-4 py-3 outline-none focus:border-primary font-sans text-sm transition-colors resize-none"
              placeholder="Enter product description..."
            />
          </div>
        </div>

        <div className="bg-background border border-surface shadow-sm p-8 space-y-6">
          <h2 className="font-serif text-xl text-primary border-b border-surface pb-4">Media (Up to 5 images)</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative aspect-square border border-surface bg-surface group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-background p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-surface hover:border-primary transition-colors flex flex-col items-center justify-center cursor-pointer bg-surface/10 text-muted hover:text-primary">
                <Upload className="w-6 h-6 mb-2" />
                <span className="font-sans text-xs uppercase tracking-widest">Upload</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Link href="/products" className="px-8 py-4 border border-surface text-primary font-sans text-xs uppercase tracking-widest hover:bg-surface transition-colors">
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 bg-primary text-background font-sans text-xs uppercase tracking-widest hover:bg-luxury transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
