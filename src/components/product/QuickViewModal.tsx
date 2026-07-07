"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuickViewStore } from "@/store/quickViewStore";
import { useCartStore } from "@/store/cartStore";
import { useCartDrawerStore } from "@/store/cartDrawerStore";
import { X, Star, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function QuickViewModal() {
  const { isOpen, product, closeModal } = useQuickViewStore();
  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useCartDrawerStore((state) => state.openDrawer);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  // Reset local state when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedImage("");
    }
  }, [product]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  if (!product) return null;

  const discountAmount = product.discountPercentage;
  const originalPrice = Math.round((product.price * 100) / (100 - discountAmount));
  const imagesList = product.images || [product.thumbnail];
  const activeImage = selectedImage || imagesList[0] || product.thumbnail;

  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity((q) => Math.min(product.stock, q + 1));

  const handleAddToCart = () => {
    addItem(product, quantity);
    closeModal();
    toast.success("Added to cart", {
      description: `${quantity}x ${product.title} added to shopping cart.`,
    });
    // Open the mini-cart drawer after a small delay
    setTimeout(() => {
      openCartDrawer();
    }, 150);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-background border border-border/80 w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Gallery Column */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded-2xl border border-border/60 overflow-hidden bg-muted/20">
                {product.stock <= 0 && (
                  <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm z-10 animate-pulse">
                    Out of Stock
                  </span>
                )}
                {discountAmount > 0 && (
                  <span className="absolute top-3 right-3 bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-xs font-bold shadow-sm z-10">
                    {Math.round(discountAmount)}% OFF
                  </span>
                )}
                <Image
                  src={activeImage}
                  alt={product.title}
                  fill
                  priority
                  className="object-contain p-4"
                />
              </div>

              {/* Thumbnails */}
              {imagesList.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative h-14 w-14 rounded-lg border-2 shrink-0 overflow-hidden bg-muted/15 transition-all ${activeImage === img ? "border-primary" : "border-border hover:border-muted-foreground/30"
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} gallery ${idx + 1}`}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Column */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category & Brand */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  <span>{product.category}</span>
                  {product.brand && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/45" />
                      <span className="font-semibold text-foreground/80">{product.brand}</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight leading-tight mb-2">
                  {product.title}
                </h2>

                {/* Ratings */}
                <div className="flex items-center gap-1 mb-4">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-amber-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {product.rating.toFixed(1)}
                  </span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-extrabold text-foreground">${product.price}</span>
                  {discountAmount > 0 && (
                    <span className="text-sm text-muted-foreground line-through font-medium">
                      ${originalPrice}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                  {product.description}
                </p>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-4 pt-4 border-t border-border/40 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Quantity
                  </span>
                  <div className="flex items-center h-10 border border-border rounded-xl bg-background">
                    <button
                      onClick={handleDecrease}
                      disabled={quantity <= 1 || product.stock <= 0}
                      className="px-3 h-full text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-3 text-sm font-semibold text-foreground select-none">
                      {product.stock <= 0 ? 0 : quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      disabled={quantity >= product.stock || product.stock <= 0}
                      className="px-3 h-full text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="h-4.5 w-4.5" />
                    <span>Add to Cart</span>
                  </button>
                  <Link
                    href={`/products/${product.id}`}
                    onClick={closeModal}
                    className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl border border-border bg-card text-foreground hover:bg-muted/40 text-xs font-semibold transition-all"
                  >
                    <span>Full Product Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
