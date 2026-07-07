import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  grandTotal: number;
}

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  getTotals: () => CartTotals;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,

      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      increaseQuantity: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }));
      },

      decreaseQuantity: (productId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.id === productId
                ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                : item
            ),
        }));
      },

      clearCart: () => set({ items: [], promoCode: null }),

      applyPromoCode: (code) => {
        const normalized = code.toUpperCase();
        if (normalized === "SAVE10" || normalized === "WELCOME20") {
          set({ promoCode: normalized });
          return true;
        }
        return false;
      },

      removePromoCode: () => set({ promoCode: null }),

      getTotals: () => {
        const { items, promoCode } = get();
        const subtotal = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        let discount = 0;
        if (promoCode === "SAVE10") {
          discount = subtotal * 0.1;
        } else if (promoCode === "WELCOME20") {
          discount = subtotal * 0.2;
        }

        const taxableAmount = Math.max(0, subtotal - discount);
        const tax = taxableAmount * 0.08; // 8% tax

        const shippingThreshold = 150;
        const shipping = taxableAmount > 0 && taxableAmount < shippingThreshold ? 15 : 0;

        const grandTotal = taxableAmount + tax + shipping;

        return {
          subtotal,
          discount,
          tax,
          shipping,
          grandTotal,
        };
      },
    }),
    {
      name: "click-connect-cart",
    }
  )
);
