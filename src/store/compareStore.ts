import { create } from "zustand";
import { Product } from "@/types/product";
import { toast } from "sonner";

interface CompareState {
  items: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  items: [],
  addToCompare: (product) => {
    const { items } = get();
    if (items.some((item) => item.id === product.id)) {
      return;
    }
    if (items.length >= 3) {
      toast.warning("Comparison limit reached", {
        description: "You can compare up to 3 products at a time.",
      });
      return;
    }
    set({ items: [...items, product] });
    toast.success("Added to comparison", {
      description: `${product.title} added.`,
    });
  },
  removeFromCompare: (productId) => {
    set({ items: get().items.filter((item) => item.id !== productId) });
  },
  clearCompare: () => set({ items: [] }),
}));
