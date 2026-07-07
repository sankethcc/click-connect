"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Send, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success("Subscribed successfully!", {
        description: "Thank you for subscribing to our newsletter. You'll receive updates soon!",
      });
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-muted/30 border-t border-border mt-auto transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Click & Connect Logo"
                width={160}
                height={60}
                className="h-10 w-auto object-contain dark:brightness-110"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A premium shopping experience built using Next.js 15, Zustand, React Query, and Tailwind CSS.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground" aria-label="Twitter">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground" aria-label="Facebook">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground" aria-label="Instagram">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1.14.054 1.763.242 2.176.402.546.213.935.467 1.344.876.41.409.664.798.876 1.344.16.413.348 1.037.402 2.176.044.927.054 1.282.054 3.71s-.01 2.784-.054 3.71c-.054 1.14-.242 1.763-.402 2.176-.213.546-.467.935-.876 1.344-.409.41-.798.664-1.344.876-.413.16-1.037.348-2.176.402-.927.044-1.282.054-3.71.054s-2.784-.01-3.71-.054c-1.14-.054-1.763-.242-2.176-.402-.546-.213-.935-.467-1.344-.876-.41-.409-.664-.798-.876-1.344-.16-.413-.348-1.037-.402-2.176C2.01 14.866 2 14.511 2 12.073s.01-2.784.054-3.71c.054-1.139.242-1.763.402-2.176.213-.546.467-.935.876-1.344.409-.41.798-.664 1.344-.876.413-.16 1.037-.348 2.176-.402C9.53 2.01 9.885 2 12.315 2zm0-1.734C9.845.266 9.53.277 8.556.322c-1.36.062-2.3.277-3.123.597a5.53 5.53 0 00-1.996 1.3 5.53 5.53 0 00-1.3 1.996c-.319.82-.535 1.762-.597 3.123-.045.975-.056 1.29-.056 3.761s.011 2.786.056 3.761c.062 1.36.278 2.3.597 3.123.22.566.53 1.01.996 1.475.465.465.91.775 1.475.996.82.319 1.762.535 3.123.597.975.045 1.29.056 3.761.056s2.786-.011 3.761-.056c1.36-.062 2.3-.278 3.123-.597a5.53 5.53 0 00 1.996-1.3 5.53 5.53 0 00 1.3-1.996c.319-.82.535-1.762.597-3.123.045-.975.056-1.29.056-3.761s-.011-2.786-.056-3.761c-.062-1.36-.278-2.3-.597-3.123a5.53 5.53 0 00-1.3-1.996 5.53 5.53 0 00-1.996-1.3c-.82-.319-1.762-.535-3.123-.597C15.093.277 14.777.266 12.315.266zM12 5.833a6.24 6.24 0 100 12.48 6.24 6.24 0 000-12.48zm0 10.746a4.506 4.506 0 110-9.012 4.506 4.506 0 010 9.012z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground" aria-label="GitHub">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm font-medium">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Shop Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">
                  My Cart
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Support Services
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm font-medium">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@clickconnect.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 (1800) 555-0199</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>100 Innovation Way, Pune, Maharashtra, India</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Newsletter
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Subscribe to get notified about special discounts, sales, and new releases.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/45 text-xs"
              />
              <button
                type="submit"
                className="h-9 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/95 flex items-center justify-center shadow-sm"
                aria-label="Subscribe"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>&copy; {new Date().getFullYear()} Click & Connect. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
