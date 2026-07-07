"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import ProductCard from "@/components/product/ProductCard";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Search,
  RotateCcw,
  Loader2,
  X,
  Grid,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // URL States
  const category = searchParams.get("category") || "all";
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = (searchParams.get("order") as "asc" | "desc") || "asc";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 12;

  // Local Filter States (for client-side filtering)
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Query Products
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { category, search, sortBy, order, page }],
    queryFn: () =>
      ProductService.getProducts({
        limit,
        skip: (page - 1) * limit,
        category,
        search,
        sortBy,
        order,
      }),
  });

  // Query Categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => ProductService.getCategories(),
  });

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / limit);

  const categories = categoriesData || [];

  // Client-Side Filters
  const filteredProducts = products.filter((product) => {
    const matchesPrice =
      product.price >= minPrice && product.price <= maxPrice;
    const matchesRating = product.rating >= selectedRating;
    const matchesBrand = brandSearch
      ? product.brand?.toLowerCase().includes(brandSearch.toLowerCase())
      : true;

    return matchesPrice && matchesRating && matchesBrand;
  });

  // Update URL helpers
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset to page 1 on filter changes
    if (!updates.page) {
      params.set("page", "1");
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setMinPrice(0);
    setMaxPrice(2000);
    setSelectedRating(0);
    setBrandSearch("");
    // Clear url query params except search
    const searchParam = searchParams.get("search");
    router.push(`/products${searchParam ? `?search=${searchParam}` : ""}`);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 2) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (page >= totalPages - 1) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 grow flex flex-col gap-6">

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {search
              ? `Search Results for "${search}"`
              : category !== "all"
                ? category.charAt(0).toUpperCase() + category.slice(1)
                : "Shop Catalog"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Showing {filteredProducts.length} of {totalProducts} items
          </p>
        </div>

        {/* Sorting and Mobile Filter triggers */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Sorting */}
          <div className="relative inline-block text-left">
            <select
              value={sortBy ? `${sortBy}-${order}` : ""}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                  updateUrlParams({ sortBy: null, order: null });
                } else {
                  const [sort, ord] = val.split("-");
                  updateUrlParams({ sortBy: sort, order: ord });
                }
              }}
              className="appearance-none h-10 pl-4 pr-10 rounded-xl border border-border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/45 cursor-pointer"
            >
              <option value="">Default Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Grid/List Toggle */}
          <div className="hidden sm:flex items-center border border-border rounded-xl p-1 bg-card shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex md:hidden items-center gap-1.5 h-10 px-4 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted/30"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex gap-8 flex-1">
        {/* Left column: Desktop Sidebar filters */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-5 glass space-y-6">

            {/* Title / Clear */}
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5" />
                <span>Filters</span>
              </h2>
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Category
              </h3>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => updateUrlParams({ category: "all" })}
                  className={`text-left text-sm py-1.5 px-2 rounded-lg transition-colors ${category === "all"
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <div
                    key={cat.slug}
                    onClick={() => updateUrlParams({ category: cat.slug })}
                    className={`h-14 text-left text-sm py-1.5 px-2 rounded-lg transition-colors ${category === cat.slug
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      }`}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-3.5 border-t border-border/40 pt-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Price Limit
                </h3>
                <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                  ${maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>$0</span>
                <span>$2,000+</span>
              </div>
            </div>

            {/* Brand Search */}
            <div className="space-y-2 border-t border-border/40 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Brand
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by brand..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full h-9 pl-8 pr-3.5 rounded-lg border border-border bg-muted/20 focus:bg-background focus:outline-none text-xs"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>

            {/* Ratings Filter */}
            <div className="space-y-2 border-t border-border/40 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Min Rating
              </h3>
              <div className="flex flex-col gap-1.5">
                {[4, 3, 2, 0].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setSelectedRating(stars)}
                    className={`flex items-center gap-1.5 text-xs py-1.5 px-2 rounded-lg transition-colors ${selectedRating === stars
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      }`}
                  >
                    <span className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < stars ? "fill-amber-400" : "text-muted"
                            }`}
                        />
                      ))}
                    </span>
                    <span>{stars > 0 ? `${stars}+` : "All Ratings"}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Right column: Product list and paginator */}
        <main className="flex-1 flex flex-col gap-6">
          {isLoading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full rounded-2xl border border-border/50 bg-card p-4 space-y-4 animate-pulse"
                >
                  <div className="aspect-square w-full rounded-xl bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-2/3 bg-muted rounded" />
                    <div className="h-3 w-1/3 bg-muted rounded" />
                    <div className="h-3.5 w-1/2 bg-muted rounded" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-5 w-1/4 bg-muted rounded" />
                    <div className="h-8 w-1/4 bg-muted rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 bg-card border border-border rounded-2xl">
              <p className="text-destructive font-medium">
                Failed to fetch catalog. Please check your network connection.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl"
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-24 bg-card border border-border/80 rounded-2xl flex flex-col items-center gap-4">
              <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
              <div>
                <h3 className="font-bold text-lg">No Products Found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1 mx-auto">
                  Try adjusting your price filters, selecting a different category, or removing sorting fields.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-5 h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Active list grid */}
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-5"}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} layout={viewMode} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 border-t border-border/40 pt-8 mt-4">

                  {/* Prev */}
                  <button
                    onClick={() => updateUrlParams({ page: String(page - 1) })}
                    disabled={page === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Page numbers */}
                  {getPageNumbers().map((pageNum, idx) => {
                    if (pageNum === "...") {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="h-10 w-10 flex items-center justify-center text-muted-foreground text-sm font-medium"
                        >
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => updateUrlParams({ page: String(pageNum) })}
                        className={`h-10 w-10 rounded-xl font-medium text-sm transition-colors ${page === pageNum
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next */}
                  <button
                    onClick={() => updateUrlParams({ page: String(page + 1) })}
                    disabled={page === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Drawer Slide-out Filters */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 max-w-xs w-full bg-background p-6 z-50 flex flex-col md:hidden border-l border-border space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <h2 className="font-bold text-lg">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-full hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grow overflow-y-auto space-y-6 pr-1">

                {/* Categories - Mobile */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Category
                  </h3>
                  <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                    <button
                      onClick={() => {
                        updateUrlParams({ category: "all" });
                        setShowMobileFilters(false);
                      }}
                      className={`text-left text-sm py-1.5 px-2 rounded-lg transition-colors ${category === "all"
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-muted-foreground"
                        }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => {
                          updateUrlParams({ category: cat.slug });
                          setShowMobileFilters(false);
                        }}
                        className={`text-left text-sm py-1.5 px-2 rounded-lg transition-colors ${category === cat.slug
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-muted-foreground"
                          }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Limit - Mobile */}
                <div className="space-y-3 pt-4 border-t border-border/40">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Price Limit
                    </h3>
                    <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                      ${maxPrice}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Brand Search - Mobile */}
                <div className="space-y-2 pt-4 border-t border-border/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Brand
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Filter by brand..."
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="w-full h-9 pl-8 pr-3.5 rounded-lg border border-border bg-muted/20 focus:bg-background focus:outline-none text-xs"
                    />
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>

                {/* Rating - Mobile */}
                <div className="space-y-2 pt-4 border-t border-border/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Min Rating
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {[4, 3, 2, 0].map((stars) => (
                      <button
                        key={stars}
                        onClick={() => setSelectedRating(stars)}
                        className={`flex items-center gap-1.5 text-xs py-1 px-2 rounded-lg transition-colors ${selectedRating === stars
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-muted-foreground"
                          }`}
                      >
                        <span className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < stars ? "fill-amber-400" : "text-muted"
                                }`}
                            />
                          ))}
                        </span>
                        <span>{stars > 0 ? `${stars}+` : "All Ratings"}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-border/50 flex gap-3">
                <button
                  onClick={handleClearFilters}
                  className="flex-1 h-10 border border-border rounded-xl text-sm font-semibold hover:bg-muted/40 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 h-10 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
                >
                  Apply
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Recently Viewed Tray */}
      <RecentlyViewed />
    </div>
  );
}

function ProductsContentWrapper() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";
  const search = searchParams.get("search") || "";
  return <ProductsContent key={`${category}-${search}`} />;
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="grow flex flex-col items-center justify-center min-h-100 gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading catalog...</p>
        </div>
      }
    >
      <ProductsContentWrapper />
    </Suspense>
  );
}
