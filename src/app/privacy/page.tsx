"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
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
            <Shield className="h-4 w-4" />
            <span>Privacy & Security</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
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
            At <strong>Click & Connect</strong>, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy describes how we collect, use, and safeguard your information when you visit our website, make a purchase, or interact with our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
          <p>
            We may collect personal identification information from you in a variety of ways, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Credentials:</strong> Your name, username, email address, password, shipping/billing address, and phone number when you create an account or complete an order.</li>
            <li><strong>Payment Details:</strong> Secure tokenized payment information (we do not store raw credit card numbers).</li>
            <li><strong>Device and Usage Info:</strong> IP address, browser type, operating system, and browsing activity collected automatically through cookies.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. How We Use Your Information</h2>
          <p>We use your information to operate and improve our marketplace, including to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and fulfill your order transactions, including delivery and dispatch tracking.</li>
            <li>Provide customer service, manage user accounts, and resolve technical issues.</li>
            <li>Send order confirmation updates and marketing updates (with your explicit consent).</li>
            <li>Detect, prevent, and address security threats or fraud.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. Data Retention and Security</h2>
          <p>
            We store your personal credentials safely and employ a variety of security measures (such as SSL encryption and secure session tokens) to maintain the safety of your information. We retain your information for as long as necessary to provide you with services and comply with legal requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">4. Cookies and Tracking</h2>
          <p>
            We use essential cookies to keep you signed in, remember your cart items, and personalize your experience. You can choose to disable cookies through your browser settings, though some features of the store may not function properly as a result.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">5. Your Choices and Rights</h2>
          <p>
            You have the right to access, modify, or request deletion of your personal credentials. You can update your account profile directly through the Account Dashboard, or reach out to our support team for specialized requests.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our practices, please contact us at:
          </p>
          <div className="bg-muted/40 p-4 rounded-2xl border border-border text-xs sm:text-sm font-medium text-foreground inline-block">
            <p><strong>Click & Connect Support</strong></p>
            <p>Email: support@clickconnect.com</p>
            <p>Address: 100 Innovation Way, Pune, Maharashtra, India</p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
