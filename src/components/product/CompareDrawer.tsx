"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCompareStore } from "@/store/compareStore";
import { useCartStore } from "@/store/cartStore";
import { useCartDrawerStore } from "@/store/cartDrawerStore";
import { X, SlidersHorizontal, Check, ShoppingBag, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function CompareDrawer() {
  const { items, removeFromCompare, clearCompare } = useCompareStore();
  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useCartDrawerStore((state) => state.openDrawer);

  const [modalOpen, setModalOpen] = useState(false);

  if (items.length === 0) return null;

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    toast.success("Added to cart", {
      description: `${product.title} added to shopping cart.`,
    });
    // Open cart drawer
    setTimeout(() => {
      openCartDrawer();
    }, 150);
  };

  return (
    <>
      {/* Sticky Bottom Compare Bar */}
      <AnimatePresence>
        {!modalOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border p-4 shadow-lg"
          >
            <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Compare Products</h4>
                  <p className="text-xs text-muted-foreground">
                    Selected {items.length} of 3 products to compare side-by-side.
                  </p>
                </div>
              </div>

              {/* Selected Thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full">
                {items.map((product) => (
                  <div
                    key={product.id}
                    className="relative h-12 w-12 rounded-lg border border-border bg-card overflow-hidden shrink-0 flex items-center justify-center group"
                  >
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      aria-label={`Remove ${product.title} from compare`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {items.length < 3 && (
                  <div className="h-12 w-12 rounded-lg border border-dashed border-border bg-muted/20 flex items-center justify-center text-muted-foreground text-xs shrink-0 select-none">
                    +{3 - items.length}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={clearCompare}
                  className="px-4 py-2 border border-border bg-card hover:bg-muted/40 text-xs font-semibold rounded-xl transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setModalOpen(true)}
                  disabled={items.length < 2}
                  className="px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Compare Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal Table Overlay */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-background border border-border/80 w-full max-w-5xl rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-6">
                <div>
                  <h3 className="font-extrabold text-xl">Product Comparison</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Compare technical specifications and pricing details.
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close comparison details modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Responsive Scroll Table Wrapper */}
              <div className="flex-1 overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="py-4 font-bold text-sm text-muted-foreground w-1/4">Feature</th>
                      {items.map((product) => (
                        <th key={product.id} className="py-4 px-4 w-1/4 font-semibold text-sm">
                          <div className="flex flex-col gap-2 relative">
                            <button
                              onClick={() => {
                                removeFromCompare(product.id);
                                if (items.length <= 2) setModalOpen(false);
                              }}
                              className="absolute -top-2 -right-2 p-1 bg-muted hover:bg-destructive hover:text-white rounded-full text-muted-foreground transition-all duration-150"
                              aria-label="Remove item"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="relative h-24 w-24 rounded-xl border border-border/50 bg-muted/20 overflow-hidden mx-auto">
                              <Image
                                src={product.thumbnail}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <h4 className="font-bold text-xs line-clamp-2 text-center text-foreground mt-1 max-w-[150px] mx-auto">
                              {product.title}
                            </h4>
                          </div>
                        </th>
                      ))}
                      {/* Empty column slots to fill 3 slots */}
                      {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, idx) => (
                        <th key={`empty-slot-${idx}`} className="py-4 px-4 w-1/4 text-center text-xs text-muted-foreground border-l border-dashed border-border/30">
                          Empty Slot
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-xs sm:text-sm text-muted-foreground">
                    {/* Price Row */}
                    <tr>
                      <td className="py-3 font-semibold text-foreground">Price</td>
                      {items.map((p) => (
                        <td key={p.id} className="py-3 px-4 font-bold text-foreground">
                          ${p.price}
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, idx) => (
                        <td key={`empty-price-${idx}`} className="py-3 px-4 text-center">-</td>
                      ))}
                    </tr>
                    {/* Brand Row */}
                    <tr>
                      <td className="py-3 font-semibold text-foreground">Brand</td>
                      {items.map((p) => (
                        <td key={p.id} className="py-3 px-4 capitalize font-medium text-foreground/80">
                          {p.brand || "Exclusive Brand"}
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, idx) => (
                        <td key={`empty-brand-${idx}`} className="py-3 px-4 text-center">-</td>
                      ))}
                    </tr>
                    {/* Category Row */}
                    <tr>
                      <td className="py-3 font-semibold text-foreground">Category</td>
                      {items.map((p) => (
                        <td key={p.id} className="py-3 px-4 capitalize">
                          {p.category}
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, idx) => (
                        <td key={`empty-cat-${idx}`} className="py-3 px-4 text-center">-</td>
                      ))}
                    </tr>
                    {/* Ratings Row */}
                    <tr>
                      <td className="py-3 font-semibold text-foreground">Rating</td>
                      {items.map((p) => (
                        <td key={p.id} className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-foreground">{p.rating.toFixed(1)}</span>
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, idx) => (
                        <td key={`empty-rate-${idx}`} className="py-3 px-4 text-center">-</td>
                      ))}
                    </tr>
                    {/* Stock Status Row */}
                    <tr>
                      <td className="py-3 font-semibold text-foreground">Stock Status</td>
                      {items.map((p) => (
                        <td key={p.id} className="py-3 px-4">
                          {p.stock > 0 ? (
                            <span className="text-emerald-500 font-semibold flex items-center gap-1">
                              <Check className="h-3.5 w-3.5" /> In Stock ({p.stock})
                            </span>
                          ) : (
                            <span className="text-destructive font-semibold">Out of Stock</span>
                          )}
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, idx) => (
                        <td key={`empty-stock-${idx}`} className="py-3 px-4 text-center">-</td>
                      ))}
                    </tr>
                    {/* Shipping Info Row */}
                    <tr>
                      <td className="py-3 font-semibold text-foreground">Shipping Info</td>
                      {items.map((p) => (
                        <td key={p.id} className="py-3 px-4 text-xs">
                          {p.shippingInformation || "Standard Delivery"}
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, idx) => (
                        <td key={`empty-ship-${idx}`} className="py-3 px-4 text-center">-</td>
                      ))}
                    </tr>
                    {/* Action Row */}
                    <tr className="border-t border-border/40">
                      <td className="py-4"></td>
                      {items.map((p) => (
                        <td key={p.id} className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleAddToCart(p)}
                            disabled={p.stock <= 0}
                            className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-primary/95 transition-all shadow-sm disabled:opacity-50"
                          >
                            <ShoppingBag className="h-3 w-3" />
                            <span>Add</span>
                          </button>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, idx) => (
                        <td key={`empty-action-${idx}`} className="py-4 px-4 text-center"></td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
