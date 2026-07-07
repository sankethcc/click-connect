"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import ProductCard from "./ProductCard";
import { Sparkles, Loader2 } from "lucide-react";

interface RelatedProductsProps {
  category: string;
  currentProductId: number;
}

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["related-products", { category }],
    queryFn: () => ProductService.getProducts({ category, limit: 5 }),
    enabled: !!category,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
        <span className="text-xs text-muted-foreground font-semibold">Finding matching products...</span>
      </div>
    );
  }

  if (isError || !data || data.products.length <= 1) return null;

  // Filter out the current product being viewed
  const recommendedList = data.products
    .filter((product) => product.id !== currentProductId)
    .slice(0, 4);

  if (recommendedList.length === 0) return null;

  return (
    <div className="border-t border-border/40 pt-12 mt-16 space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">You May Also Like</h3>
          <p className="text-xs text-muted-foreground">Handpicked items similar to this product.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {recommendedList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
