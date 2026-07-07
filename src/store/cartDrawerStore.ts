import { create } from "zustand";

interface CartDrawerState {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartDrawerStore = create<CartDrawerState>((set) => ({
  isOpen: false,
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
}));
