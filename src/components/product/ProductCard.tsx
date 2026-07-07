"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { useQuickViewStore } from "@/store/quickViewStore";
import { useCompareStore } from "@/store/compareStore";
import { useCartDrawerStore } from "@/store/cartDrawerStore";
import { toast } from "sonner";
import { Star, ShoppingBag, Eye, Scale, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  layout?: "grid" | "list";
}

export default function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openQuickView = useQuickViewStore((state) => state.openModal);
  const { items: compareItems, addToCompare, removeFromCompare } = useCompareStore();
  const openCartDrawer = useCartDrawerStore((state) => state.openDrawer);

  const isComparing = compareItems.some((item) => item.id === product.id);

  const discountAmount = product.discountPercentage;
  const originalPrice = Math.round((product.price * 100) / (100 - discountAmount));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success("Added to cart", {
      description: `${product.title} has been added to your shopping cart.`,
    });
    setTimeout(() => {
      openCartDrawer();
    }, 150);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  // Stock Badge Color
  const getStockBadge = () => {
    if (product.stock <= 0) {
      return (
        <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
          Out of Stock
        </span>
      );
    }
    if (product.stock < 10) {
      return (
        <span className="absolute top-3 left-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
          Low Stock ({product.stock})
        </span>
      );
    }
    return null;
  };

  const compareTopClass = (product.stock <= 0 || product.stock < 10) ? "top-12" : "top-3";

  if (layout === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="group relative flex flex-col sm:flex-row w-full overflow-hidden rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 gap-4"
      >
        {/* Product Image Section */}
        <div className="relative aspect-square w-full sm:w-56 overflow-hidden bg-muted/30 shrink-0">
          {/* Stock Badge */}
          {getStockBadge()}

          {/* Compare Checkbox Button */}
          <button
            onClick={handleToggleCompare}
            className={`absolute ${compareTopClass} left-3 z-20 flex h-7 items-center gap-1.5 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border transition-all cursor-pointer ${
              isComparing
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background/85 backdrop-blur-md text-foreground border-border hover:bg-background"
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>{isComparing ? "Comparing" : "Compare"}</span>
          </button>

          {/* Discount Badge */}
          {discountAmount > 0 && (
            <span className="absolute top-3 right-3 bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
              {Math.round(discountAmount)}% OFF
            </span>
          )}

          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="224px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Action Overlays */}
          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={handleQuickView}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground text-foreground shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
              aria-label="Quick View Product"
            >
              <Eye className="h-5 w-5" />
            </button>
            <Link
              href={`/products/${product.id}`}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground text-foreground shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
              aria-label="View Full Details"
            >
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col grow p-5 sm:py-6">
          {/* Category & Brand */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
            <span>{product.category}</span>
            {product.brand && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/45" />
                <span className="font-semibold text-foreground/80">{product.brand}</span>
              </>
            )}
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} className="block mb-2 group-hover:text-primary transition-colors">
            <h3 className="font-bold text-lg text-foreground group-hover:underline">
              {product.title}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-amber-400" : "text-muted"}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {product.rating.toFixed(1)}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-xl mb-4">
            {product.description}
          </p>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-foreground">${product.price}</span>
              {discountAmount > 0 && (
                <span className="text-xs text-muted-foreground line-through font-medium">
                  ${originalPrice}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col w-full overflow-hidden rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20"
    >

      {/* Product Image Section */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/30">

        {/* Stock Badge */}
        {getStockBadge()}

        {/* Compare Checkbox Button */}
        <button
          onClick={handleToggleCompare}
          className={`absolute ${compareTopClass} left-3 z-20 flex h-7 items-center gap-1.5 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border transition-all cursor-pointer ${
            isComparing
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background/85 backdrop-blur-md text-foreground border-border hover:bg-background"
          }`}
        >
          <Scale className="h-3.5 w-3.5" />
          <span>{isComparing ? "Comparing" : "Compare"}</span>
        </button>

        {/* Discount Badge */}
        {discountAmount > 0 && (
          <span className="absolute top-3 right-3 bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
            {Math.round(discountAmount)}% OFF
          </span>
        )}

        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Action Overlays */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleQuickView}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground text-foreground shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            aria-label="Quick View Product"
          >
            <Eye className="h-5 w-5" />
          </button>
          <Link
            href={`/products/${product.id}`}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground text-foreground shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
            aria-label="View Full Details"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground text-foreground shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to Cart"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col grow p-4">
        {/* Category & Brand */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider mb-1">
          <span>{product.category}</span>
          {product.brand && (
            <>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/45" />
              <span className="font-semibold text-foreground/80">{product.brand}</span>
            </>
          )}
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.id}`} className="block mb-2 group-hover:text-primary transition-colors">
          <h3 className="font-semibold text-base text-foreground line-clamp-1 group-hover:underline">
            {product.title}
          </h3>
        </Link>

        {/* Ratings */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-amber-400" : "text-muted"
                  }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Pricing & Add to Cart (Desktop footer view fallback) */}
        <div className="flex items-end justify-between mt-auto pt-2 border-t border-border/40">
          <div className="flex flex-col">
            {discountAmount > 0 && (
              <span className="text-xs text-muted-foreground line-through font-medium">
                ${originalPrice}
              </span>
            )}
            <span className="text-lg font-bold text-foreground">
              ${product.price}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
}
