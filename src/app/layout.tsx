import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import ShopLayout from "@/components/layout/ShopLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Click & Connect - Premium E-Commerce Store",
  description: "A responsive, production-quality Next.js e-commerce application powered by DummyJSON.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors duration-200">
        <Providers>
          <ShopLayout>{children}</ShopLayout>
        </Providers>
      </body>
    </html>
  );
}
