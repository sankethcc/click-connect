"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  X,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  const {
    items,
    promoCode,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    applyPromoCode,
    removePromoCode,
    getTotals,
  } = useCartStore();

  // Avoid hydration issues by waiting until mount to render items
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const totals = getTotals();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const success = applyPromoCode(couponInput.trim());
    if (success) {
      toast.success("Promo code applied!", {
        description: `Successfully applied discount coupon "${couponInput.toUpperCase()}".`,
      });
      setCouponInput("");
    } else {
      toast.error("Invalid coupon", {
        description: "The coupon code you entered is invalid or expired.",
      });
    }
  };

  const handleRemoveCoupon = () => {
    removePromoCode();
    toast.info("Promo code removed", {
      description: "Discount coupon code has been removed from your checkout summary.",
    });
  };

  if (!mounted) {
    return (
      <div className="grow flex items-center justify-center min-h-100">
        <span className="text-sm text-muted-foreground font-medium">Loading your cart...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 grow flex flex-col items-center justify-center text-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Cart is Empty</h1>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Looks like you haven&apos;t added any products to your cart yet. Discover our latest items!
          </p>
        </div>
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
        >
          <span>Start Shopping</span>
          <ArrowRight className="h-4.5 w-4.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 grow w-full">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

        {/* Cart items list - Left column (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => {
              return (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-border/80 bg-card shadow-sm glass transition-colors hover:border-primary/10"
                >
                  {/* Thumbnail */}
                  <div className="relative h-24 w-24 rounded-xl border border-border/50 overflow-hidden bg-muted/20 shrink-0">
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Title / Description */}
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {item.product.brand || "Exclusive"}
                    </span>
                    <Link
                      href={`/products/${item.product.id}`}
                      className="block font-semibold text-base text-foreground hover:text-primary transition-colors truncate"
                    >
                      {item.product.title}
                    </Link>
                    <span className="text-xs text-muted-foreground mt-0.5 block">
                      Category: {item.product.category}
                    </span>
                  </div>

                  {/* Pricing / Controls */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-6 sm:gap-2 w-full sm:w-auto">

                    {/* Quantity selectors */}
                    <div className="flex items-center h-8 border border-border rounded-lg bg-background">
                      <button
                        onClick={() => decreaseQuantity(item.product.id)}
                        className="px-2 h-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-l-lg"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.product.id)}
                        className="px-2 h-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-r-lg"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Price display */}
                    <div className="text-right">
                      <p className="font-bold text-sm">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-muted-foreground">
                          (${item.product.price} each)
                        </p>
                      )}
                    </div>

                    {/* Delete Icon */}
                    <button
                      onClick={() => {
                        removeItem(item.product.id);
                        toast.info("Item removed", {
                          description: `${item.product.title} has been removed from your cart.`,
                        });
                      }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Checkout Summary panel - Right column (1/3 width) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm glass space-y-6">
            <h2 className="font-bold text-lg border-b border-border/40 pb-4">Order Summary</h2>

            {/* Calculations items */}
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">${totals.subtotal.toFixed(2)}</span>
              </div>

              {/* Active Coupons display */}
              {promoCode && (
                <div className="flex justify-between text-emerald-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Coupon Discount ({promoCode === "SAVE10" ? "10%" : "20%"})</span>
                  </span>
                  <span>-${totals.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-foreground">${totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-semibold text-foreground">
                  {totals.shipping === 0 ? (
                    <span className="text-emerald-500 font-bold">FREE</span>
                  ) : (
                    `$${totals.shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between text-base font-bold border-t border-border/40 pt-4 mt-2">
                <span>Grand Total</span>
                <span className="text-lg">${totals.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="border-t border-border/40 pt-5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Promo Code
              </label>

              {promoCode ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-xs font-medium">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Applied: <b>{promoCode}</b></span>
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 rounded hover:bg-emerald-500/10 text-emerald-500"
                    aria-label="Remove promo code"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME20"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/45 text-xs"
                  />
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-lg bg-secondary text-secondary-foreground font-semibold text-xs hover:bg-muted/40 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {!promoCode && (
                <p className="text-[10px] text-muted-foreground">
                  Try entering code <code className="bg-muted px-1 py-0.5 rounded font-bold">SAVE10</code> or <code className="bg-muted px-1 py-0.5 rounded font-bold">WELCOME20</code> for mock discounts!
                </p>
              )}
            </div>

            {/* Checkout triggers */}
            <div className="border-t border-border/40 pt-5 space-y-3.5">
              <Link
                href="/checkout"
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
              >
                <Lock className="h-4 w-4" />
                <span>Secure Checkout</span>
              </Link>
              <Link
                href="/products"
                className="w-full h-12 rounded-xl border border-border bg-card hover:bg-muted/40 font-semibold text-sm flex items-center justify-center transition-colors"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
