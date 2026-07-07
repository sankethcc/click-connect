"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import { useCartStore } from "@/store/cartStore";
import { useCartDrawerStore } from "@/store/cartDrawerStore";
import ProductCard from "@/components/product/ProductCard";
import RelatedProducts from "@/components/product/RelatedProducts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingBag,
  Plus,
  Minus,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductDetailsContentProps {
  productId: number;
}

export default function ProductDetailsContent({
  productId,
}: ProductDetailsContentProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");

  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useCartDrawerStore((state) => state.openDrawer);

  // Fetch product detail
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => ProductService.getProductDetails(productId),
  });



  if (isLoading) {
    return (
      <div className="grow flex flex-col items-center justify-center min-h-100 gap-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Fetching details...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center grow flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-destructive">Product Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          The product ID may be invalid or it has been removed from our listings.
        </p>
        <Link
          href="/products"
          className="px-5 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 flex items-center justify-center shadow-md shadow-primary/10"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const originalPrice = Math.round((product.price * 100) / (100 - product.discountPercentage));

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success("Added to cart", {
      description: `${quantity}x ${product.title} added to your shopping cart.`,
    });
    setTimeout(() => {
      openCartDrawer();
    }, 150);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 grow">

      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 text-xs text-muted-foreground uppercase tracking-wider mb-8 min-w-0">
        <Link href="/" className="hover:text-foreground shrink-0">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-foreground shrink-0">Products</Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <Link href={`/products?category=${product.category}`} className="hover:text-foreground shrink-0">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <span className="text-foreground font-semibold max-w-50 truncate inline-block">
          {product.title}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">

        {/* Gallery column */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-3xl border border-border/80 overflow-hidden bg-muted/20">
            <Image
              src={selectedImage || product.images[0] || product.thumbnail}
              alt={product.title}
              fill
              priority
              className="object-contain p-6 transition-all duration-300"
            />
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-20 w-20 rounded-xl border-2 shrink-0 overflow-hidden bg-muted/15 transition-all ${selectedImage === img || (selectedImage === "" && idx === 0)
                    ? "border-primary shadow-sm"
                    : "border-border hover:border-muted-foreground/35"
                    }`}
                >
                  <Image src={img} alt={`${product.title}-${idx}`} fill className="object-contain p-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information column */}
        <div className="flex flex-col gap-6">
          <div>
            {/* Brand & Category */}
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {product.brand || "Click & Connect Exclusive"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 mb-2">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4.5 w-4.5 ${i < Math.round(product.rating) ? "fill-amber-400" : "text-muted"
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{product.rating.toFixed(1)} Rating</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground">SKU: {product.sku || "N/A"}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-5 rounded-2xl bg-muted/40 border border-border/50">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold">${product.price}</span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-base text-muted-foreground line-through font-medium">
                    ${originalPrice}
                  </span>
                  <span className="bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                    {Math.round(product.discountPercentage)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tax included. Free shipping for orders above $150.
            </p>
          </div>

          {/* Controls: Quantity Selector and Stock Status */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Quantity
              </span>
              <div className="flex items-center h-10 border border-border rounded-xl bg-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 h-full hover:bg-muted hover:text-foreground text-muted-foreground transition-colors rounded-l-xl"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 h-full hover:bg-muted hover:text-foreground text-muted-foreground transition-colors rounded-r-xl"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Availability
              </span>
              <div className="h-10 flex items-center">
                {product.stock <= 0 ? (
                  <span className="text-sm font-bold text-destructive">Out of Stock</span>
                ) : product.stock < 10 ? (
                  <span className="text-sm font-bold text-amber-500">
                    Low Stock ({product.stock} items left)
                  </span>
                ) : (
                  <span className="text-sm font-bold text-emerald-500">In Stock</span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 flex items-center min-h-12 justify-center gap-2 h-12 rounded-xl border border-primary text-primary hover:bg-primary/5 text-sm font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex-1 flex items-center min-h-12 justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Buy It Now</span>
            </button>
          </div>

          {/* Delivery & Warranty info */}
          <div className="border-t border-border/40 pt-6 space-y-3.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary shrink-0" />
              <span>
                {product.shippingInformation || "Standard delivery inside 3-5 business days."}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-primary shrink-0" />
              <span>
                {product.returnPolicy || "30-day refund guarantee window, hassle-free."}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <span>
                {product.warrantyInformation || "1 year manufacturer product warranty coverage."}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Layout */}
      <div className="border-b border-border/40 mb-8 flex gap-6">
        <button
          onClick={() => setActiveTab("desc")}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === "desc" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Description
          {activeTab === "desc" && (
            <motion.div layoutId="detailTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("specs")}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === "specs" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Specifications
          {activeTab === "specs" && (
            <motion.div layoutId="detailTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === "reviews" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Reviews ({product.reviews?.length || 0})
          {activeTab === "reviews" && (
            <motion.div layoutId="detailTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      <div className="mb-20 min-h-30">
        {activeTab === "desc" && (
          <p className="text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        )}

        {activeTab === "specs" && (
          <div className="max-w-md rounded-2xl border border-border/80 bg-card p-5 text-sm space-y-3.5">
            <div className="flex justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground font-medium">SKU</span>
              <span className="font-bold">{product.sku || "N/A"}</span>
            </div>
            {product.dimensions && (
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground font-medium">Dimensions</span>
                <span className="font-bold">
                  {product.dimensions.width}W x {product.dimensions.height}H x {product.dimensions.depth}D cm
                </span>
              </div>
            )}
            <div className="flex justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground font-medium">Weight</span>
              <span className="font-bold">{product.weight || 0} kg</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground font-medium">Minimum Order Qty</span>
              <span className="font-bold">{product.minimumOrderQuantity || 1} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-medium">Box Barcode</span>
              <span className="font-mono text-xs">{product.meta?.barcode || "N/A"}</span>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {!product.reviews || product.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground font-medium">No reviews posted yet.</p>
            ) : (
              product.reviews.map((rev, i) => (
                <div key={i} className="border-b border-border/40 pb-5 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{rev.reviewerName}</span>
                    <span className="text-muted-foreground text-xs">|</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(rev.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: 5 }).map((_, stIdx) => (
                      <Star
                        key={stIdx}
                        className={`h-3.5 w-3.5 ${stIdx < rev.rating ? "fill-amber-400" : "text-muted"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      <RelatedProducts category={product.category} currentProductId={product.id} />

    </div>
  );
}
