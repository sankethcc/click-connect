"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useCartDrawerStore } from "@/store/cartDrawerStore";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const router = useRouter();
  const { items, increaseQuantity, decreaseQuantity, removeItem, getTotals } = useCartStore();
  const { isOpen, closeDrawer } = useCartDrawerStore();

  const totals = getTotals();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    closeDrawer();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-background border-l border-border shadow-2xl p-6 z-50 flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-lg text-foreground">Shopping Bag ({totalItems})</h2>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Items List */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Your bag is empty</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                      Looks like you haven&apos;t added any items to your bag yet.
                    </p>
                  </div>
                  <button
                    onClick={closeDrawer}
                    className="mt-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 rounded-xl border border-border/60 bg-card/45 relative group"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-16 w-16 rounded-lg border border-border/50 overflow-hidden bg-muted/20 shrink-0">
                      <Image
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    {/* Information */}
                    <div className="flex-1 min-w-0 pr-6">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        {item.product.category}
                      </span>
                      <h4 className="text-xs font-semibold text-foreground truncate mt-0.5 leading-snug">
                        {item.product.title}
                      </h4>
                      <p className="text-xs font-bold text-foreground mt-1.5">${item.product.price}</p>
                    </div>

                    {/* Quantity selectors */}
                    <div className="absolute bottom-3 right-3 flex items-center h-7 border border-border rounded-lg bg-background">
                      <button
                        onClick={() => decreaseQuantity(item.product.id)}
                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.product.id)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer Summary */}
            {items.length > 0 && (
              <div className="border-t border-border/40 pt-4 mt-auto space-y-4">
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground">${totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-emerald-500 font-medium">
                      <span>Promo Discount</span>
                      <span>-${totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-foreground">
                      {totals.shipping === 0 ? "FREE" : `$${totals.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-foreground border-t border-border/20 pt-2 mt-2">
                    <span>Est. Total</span>
                    <span>${totals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/95 transition-all shadow-md text-sm"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="w-full h-10 rounded-xl border border-border bg-card text-foreground hover:bg-muted/40 font-semibold flex items-center justify-center text-xs transition-all"
                  >
                    View Full Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
