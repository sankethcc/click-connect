"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 grow flex flex-col gap-8">
      {/* Back to Home Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group self-start"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-1.5">
            <FileText className="h-4 w-4" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-xs text-muted-foreground mt-2">
            Last Updated: July 7, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm glass space-y-8 text-sm sm:text-base leading-relaxed text-muted-foreground"
      >
        <section className="space-y-3">
          <p>
            Welcome to <strong>Click & Connect</strong>. By accessing or using our website, store, and associated services, you agree to comply with and be bound by the following Terms of Service. Please read them carefully before using our platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By creating an account, browsing our catalog, or making a purchase, you agree to these Terms and our Privacy Policy. If you do not agree to all of these terms, please do not access or use our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. User Accounts and Verification</h2>
          <p>
            When creating an account, you represent that all information you provide is accurate and up-to-date. You are solely responsible for maintaining the confidentiality of your credentials and account password. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. Purchases, Pricing, and Payments</h2>
          <p>
            All products are subject to availability. We reserve the right to limit the order quantity of any product or refuse service to any customer. Prices for our products are subject to change without notice. Payments must be processed through our authorized payment providers prior to shipping.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">4. Shipping, Deliveries, and Returns</h2>
          <p>
            Shipping dates and delivery schedules are estimates only. Risk of loss passes to you upon delivery to the carrier. Returns, replacements, and refunds are handled in accordance with our return policies associated with each product.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">5. Intellectual Property</h2>
          <p>
            The website and its entire contents, features, branding, logos, layout, and functionality are owned by Click & Connect and are protected by international copyright, trademark, and intellectual property laws.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Click & Connect shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use of, or inability to use, our services or catalog products.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">7. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms of Service at any time. We will indicate the date of the latest update at the top of this page. Your continued use of the platform after updates constitutes acceptance of the new terms.
          </p>
        </section>
      </motion.div>
    </div>
  );
}
