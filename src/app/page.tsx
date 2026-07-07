"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import ProductCard from "@/components/product/ProductCard";
import HeroCarousel from "@/components/layout/HeroCarousel";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import { toast } from "sonner";
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Star,
  Mail,
  Send,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Popular categories for display
const POPULAR_CATEGORIES = [
  {
    name: "Beauty & Cosmetics",
    slug: "beauty",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400",
    color: "from-pink-500/20 to-rose-500/20",
    text: "text-rose-500",
  },
  {
    name: "Perfumes & Fragrances",
    slug: "fragrances",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400",
    color: "from-purple-500/20 to-indigo-500/20",
    text: "text-purple-500",
  },
  {
    name: "Home Furniture",
    slug: "furniture",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400",
    color: "from-amber-500/20 to-orange-500/20",
    text: "text-amber-600",
  },
  {
    name: "Daily Groceries",
    slug: "groceries",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
    color: "from-green-500/20 to-emerald-500/20",
    text: "text-emerald-600",
  },
];

// Testimonials details
const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Verified Buyer",
    rating: 5,
    comment: "The products arrived way faster than expected! High quality and the packaging was absolutely beautiful.",
    avatar: "S",
  },
  {
    id: 2,
    name: "Marcus Aurelius",
    role: "Verified Buyer",
    rating: 5,
    comment: "Great customer service and premium shopping layout. Seamless checkout process, definitely purchasing again.",
    avatar: "M",
  },
  {
    id: 3,
    name: "Elena Rostova",
    role: "Verified Buyer",
    rating: 4,
    comment: "Love the dark mode aesthetic of the site. Cart is persistent and makes mobile shopping so straightforward.",
    avatar: "E",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"trending" | "best" | "discount">("trending");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Fetch products for listing
  const { data, isLoading, isError } = useQuery({
    queryKey: ["home-products"],
    queryFn: () => ProductService.getProducts({ limit: 20 }),
  });

  const products = data?.products || [];

  // Filter based on tab selected
  const getFilteredProducts = () => {
    switch (activeTab) {
      case "best":
        return products.filter((p) => p.rating >= 4.7).slice(0, 8);
      case "discount":
        return products.filter((p) => p.discountPercentage >= 12).slice(0, 8);
      case "trending":
      default:
        return products.slice(0, 8);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      toast.success("Subscribed successfully!", {
        description: "Welcome to Click & Connect updates newsletter.",
      });
      setNewsletterEmail("");
    }
  };

  return (
    <div className="flex-1 w-full relative transition-colors duration-200">

      {/* Hero Banner Section */}
      <HeroCarousel />

      {/* Feature Icons Section */}
      <section className="py-12 border-b border-border/40 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base">Instant Dispatch</h3>
                <p className="text-sm text-muted-foreground">Orders ship within 24 hours.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">Dedicated helpline for queries.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base">Secure Checkout</h3>
                <p className="text-sm text-muted-foreground">SSL certified encrypted pathways.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Showcase */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Shop by Category</h2>
              <p className="text-sm text-muted-foreground mt-1">Explore our range of curated selections.</p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline group"
            >
              <span>See all categories</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative flex flex-col justify-end h-64 rounded-2xl overflow-hidden border border-border/80 shadow-sm"
                >
                  {/* Background Image overlay */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300" />

                  {/* Category Title */}
                  <div className="relative p-6 z-10">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 bg-linear-to-r ${cat.color} ${cat.text} bg-white dark:bg-zinc-950`}>
                      Explore
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight truncate">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Tabbed Products Grid */}
      <section className="py-20 border-t border-border/40 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col items-center justify-center text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">Our Curated Products</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Check out the latest handpicked catalog listings sorted by current trends.
            </p>

            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/50 mt-8">
              <button
                onClick={() => setActiveTab("trending")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === "trending" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Trending
              </button>
              <button
                onClick={() => setActiveTab("best")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === "best" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => setActiveTab("discount")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === "discount" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Top Discounts
              </button>
            </div>
          </div>

          {/* Dynamic Content grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground font-medium">Loading catalog...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="text-destructive font-medium">Failed to load products.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/95"
              >
                Retry Request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {getFilteredProducts().map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          )}

        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">What Our Customers Say</h2>
            <p className="text-sm text-muted-foreground mt-1">Read reviews from verified buyers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((test, idx) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="flex flex-col p-6 rounded-2xl bg-card border border-border/80 shadow-sm relative glass"
              >
                <div className="flex items-center gap-1.5 text-amber-400 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < test.rating ? "fill-amber-400" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed grow mb-6">
                  &ldquo;{test.comment}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-border/40 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {test.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{test.name}</h4>
                    <span className="text-xs text-muted-foreground">{test.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup Card */}
      <section className="py-20 border-t border-border/40 bg-radial from-primary/5 via-background to-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-primary/20 bg-card p-8 md:p-12 shadow-xl relative overflow-hidden glass"
          >
            <div className="absolute top-[-40%] right-[-20%] w-[50%] h-full rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md text-center md:text-left">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                  Stay Updated with Offers
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Join our weekly newsletter to receive coupon updates, restocking alerts, and exclusive seasonal promotions.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="flex gap-3 w-full max-w-sm shrink-0">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/45 text-sm"
                />
                <button
                  type="submit"
                  className="flex h-11 px-5 items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
                >
                  <span>Subscribe</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </motion.div>

          {/* Recently Viewed Tray */}
          <RecentlyViewed />
        </div>
      </section>

    </div>
  );
}
