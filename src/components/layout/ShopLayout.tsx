"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import QuickViewModal from "@/components/product/QuickViewModal";
import CompareDrawer from "@/components/product/CompareDrawer";
import CartDrawer from "@/components/product/CartDrawer";
import SpinWheel from "@/components/marketing/SpinWheel";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide layout header/footer on authentication pages
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-16 border-b border-border bg-background" />}>
        <Header />
      </Suspense>
      <main className="grow flex flex-col">{children}</main>
      <Footer />

      {/* Global Overlays */}
      <QuickViewModal />
      <CompareDrawer />
      <CartDrawer />
      <SpinWheel />
    </div>
  );
}
