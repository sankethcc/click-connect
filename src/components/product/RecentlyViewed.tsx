"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Clock, Trash2 } from "lucide-react";
import { Product } from "@/types/product";

export default function RecentlyViewed() {
  const [list, setList] = useState<Product[]>([]);

  useEffect(() => {
    const currentRecent = localStorage.getItem("click_connect_recent");
    if (currentRecent) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setList(JSON.parse(currentRecent));
      } catch {
        // Ignored
      }
    }
  }, []);

  const handleClear = () => {
    localStorage.removeItem("click_connect_recent");
    setList([]);
  };

  if (list.length === 0) return null;

  return (
    <div className="border-t border-border/40 pt-12 mt-16 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Recently Viewed</h3>
            <p className="text-xs text-muted-foreground">Items you looked at recently.</p>
          </div>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded hover:bg-muted/40 cursor-pointer"
          aria-label="Clear recently viewed products history"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
