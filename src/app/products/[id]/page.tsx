import React, { Suspense } from "react";
import ProductDetailsContent from "./ProductDetailsContent";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  return (
    <Suspense
      fallback={
        <div className="grow flex flex-col items-center justify-center min-h-100 gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Fetching details...</p>
        </div>
      }
    >
      <ProductDetailsContent key={productId} productId={productId} />
    </Suspense>
  );
}
