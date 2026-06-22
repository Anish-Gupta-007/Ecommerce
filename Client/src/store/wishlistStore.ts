import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/components/ProductCard';

interface WishlistStore {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        if (!items.find((i) => i._id === item._id)) {
          set({ items: [...items, item] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i._id !== id) });
      },
      isInWishlist: (id) => {
        return get().items.some((i) => i._id === id);
      },
    }),
    {
      name: 'aura-wishlist-storage',
    }
  )
);
