"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  {
    tag: "Get 20% Off With Code: WELCOME20",
    title: "Premium Shopping",
    subtitle: "Discover handpicked cosmetics, fragrances, and home decor items. Beautiful layouts, instant checkout, and customizable dark themes.",
    ctaText: "Shop Catalog",
    ctaLink: "/products",
    bgClass: "from-muted/40 to-background",
    accentColor: "from-primary via-indigo-500 to-violet-600",
  },
  {
    tag: "Free Shipping Over $150",
    title: "Beauty & Cosmetics",
    subtitle: "Refresh your daily skincare routine with premium cosmetic products. Explore high quality ingredients verified by top experts.",
    ctaText: "Explore Beauty",
    ctaLink: "/products?category=beauty",
    bgClass: "from-pink-500/10 via-background to-background",
    accentColor: "from-pink-500 via-rose-500 to-red-500",
  },
  {
    tag: "New Furnishing Arrivals",
    title: "Modern Furniture",
    subtitle: "Bring comfort and style to your home with hand-crafted decor and functional furniture pieces designed to elevate daily life.",
    ctaText: "View Furniture",
    ctaLink: "/products?category=furniture",
    bgClass: "from-amber-500/10 via-background to-background",
    accentColor: "from-amber-500 via-orange-500 to-yellow-500",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-play timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  return (
    <section className="relative overflow-hidden border-b border-border/40 min-h-[500px] flex items-center bg-radial from-muted/30 to-background py-16 sm:py-24">
      {/* Decorative Blurs */}
      <div className="absolute top-0 right-0 w-[45%] h-[45%] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[45%] h-[45%] rounded-full bg-indigo-500/8 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="max-w-3xl flex flex-col items-center sm:items-start text-center sm:text-left gap-6"
          >
            {/* Promo Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{slide.tag}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
              Click & Connect to <br />
              <span className={`bg-linear-to-r ${slide.accentColor} bg-clip-text text-transparent`}>
                {slide.title}
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
              <Link
                href={slide.ctaLink}
                className="flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 transition-all shadow-lg shadow-primary/10 text-sm"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows (desktop) */}
      <button
        onClick={handlePrev}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 hover:bg-background text-foreground shadow-sm hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 hover:bg-background text-foreground shadow-sm hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Indicators Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              current === idx ? "w-7 bg-primary" : "w-2.5 bg-muted-foreground/35 hover:bg-muted-foreground/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
