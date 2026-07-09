"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import {
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(4, "Zip Code must be at least 4 characters"),
  country: z.string().min(2, "Country is required"),
  paymentMethod: z.enum(["card", "paypal", "cod"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function generateOrderId(): string {
  return "CC-" + Math.floor(100000 + Math.random() * 900000);
}

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const { items, getTotals, clearCart } = useCartStore();
  const user = useUserStore((state) => state.user);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      zipCode: "",
      country: "",
      paymentMethod: "card",
    },
  });

  const watchAllFields = watch();

  // Autofill user details when mounted
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (user) {
      setValue("fullName", `${user.firstName} ${user.lastName}`);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const totals = getTotals();

  // If cart is empty, redirect
  useEffect(() => {
    if (mounted && items.length === 0 && !isSuccess) {
      toast.warning("Empty Cart", {
        description: "Please add products to your cart before checking out.",
      });
      router.push("/cart");
    }
  }, [items, mounted, router, isSuccess]);

  const handleNextStep1 = async () => {
    const isStep1Valid = await trigger(["fullName", "email", "address", "city", "zipCode", "country"]);
    if (isStep1Valid) {
      setStep(2);
    }
  };

  const handleNextStep2 = async () => {
    const isStep2Valid = await trigger(["paymentMethod"]);
    if (isStep2Valid) {
      setStep(3);
    }
  };

  const onSubmit = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const generatedOrderId = generateOrderId();
      setOrderId(generatedOrderId);
      setIsSuccess(true);
      clearCart();
      toast.success("Order Placed!", {
        description: `Successfully placed order ${generatedOrderId}. Thank you!`,
      });
    } catch {
      toast.error("Checkout failed", {
        description: "An error occurred while processing your order.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="grow flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  // Order Success Screen
  if (isSuccess) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 sm:px-6 lg:px-8 grow flex flex-col items-center justify-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-primary/20 bg-card p-8 shadow-2xl glass flex flex-col items-center gap-5 w-full"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Order Confirmed!</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Your payment has been processed successfully. We&apos;ve sent a receipt details summary to your email.
            </p>
          </div>

          {/* Receipt details */}
          <div className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 text-sm text-left space-y-2 font-medium">
            <div className="flex justify-between border-b border-border/40 pb-2 mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              <span>Receipt Details</span>
              <span className="font-bold">Summary</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-bold text-foreground">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Window</span>
              <span className="font-bold text-foreground">3-5 Business Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Carrier Agent</span>
              <span className="font-bold text-foreground">DHL Premium</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full border-t border-border/45 pt-6 mt-2">
            <Link
              href="/dashboard?tab=orders"
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
            >
              <span>Track My Order</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="w-full h-11 rounded-xl border border-border bg-card hover:bg-muted/40 font-semibold text-sm flex items-center justify-center transition-colors"
            >
              <span>Return to Homepage</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 grow w-full">

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground uppercase tracking-wider mb-8">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/cart" className="hover:text-foreground">Cart</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-semibold">Checkout</span>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Secure Checkout</h1>

      {/* Stepper Wizard Indicator */}
      <div className="mb-12 max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-5 right-5 top-1/3 -translate-y-1/2 h-0.5 bg-border z-0" />
          <div
            className="absolute left-5 top-1/3 -translate-y-1/2 h-0.5 bg-primary transition-all duration-300 z-0"
            style={{ width: step === 1 ? "0%" : step === 2 ? "45%" : "95%" }}
          />

          {/* Step 1 Indicator */}
          <div className="flex flex-col items-center gap-2 relative z-10">
            <button
              type="button"
              onClick={() => step > 1 && setStep(1)}
              className={`h-10 w-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${step >= 1 ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-muted-foreground"
                }`}
            >
              1
            </button>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground">Shipping</span>
          </div>

          {/* Step 2 Indicator */}
          <div className="flex flex-col items-center gap-2 relative z-10">
            <button
              type="button"
              onClick={async () => {
                const isValid = await trigger(["fullName", "email", "address", "city", "zipCode", "country"]);
                if (isValid && step > 2) setStep(2);
              }}
              className={`h-10 w-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${step >= 2 ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-muted-foreground"
                }`}
            >
              2
            </button>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground">Payment</span>
          </div>

          {/* Step 3 Indicator */}
          <div className="flex flex-col items-center gap-2 relative z-10">
            <button
              type="button"
              className={`h-10 w-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all pointer-events-none ${step >= 3 ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-muted-foreground"
                }`}
            >
              3
            </button>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground">Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

        {/* Checkout Forms - Left column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Shipping Address details */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm glass space-y-4">
                  <h2 className="font-bold text-lg border-b border-border/40 pb-3.5 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span>Shipping & Billing Address</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full name */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        {...register("fullName")}
                        className={`w-full h-11 px-4 rounded-xl border bg-muted/20 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all ${errors.fullName ? "border-destructive focus:ring-destructive/30" : "border-border focus:border-primary"
                          }`}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className={`w-full h-11 px-4 rounded-xl border bg-muted/20 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all ${errors.email ? "border-destructive focus:ring-destructive/30" : "border-border focus:border-primary"
                          }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Street address */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Street Address
                      </label>
                      <input
                        type="text"
                        placeholder="Apartment, suite, unit, building, floor, street..."
                        {...register("address")}
                        className={`w-full h-11 px-4 rounded-xl border bg-muted/20 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all ${errors.address ? "border-destructive focus:ring-destructive/30" : "border-border focus:border-primary"
                          }`}
                      />
                      {errors.address && (
                        <p className="text-xs text-destructive mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        City
                      </label>
                      <input
                        type="text"
                        {...register("city")}
                        className={`w-full h-11 px-4 rounded-xl border bg-muted/20 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all ${errors.city ? "border-destructive focus:ring-destructive/30" : "border-border focus:border-primary"
                          }`}
                      />
                      {errors.city && (
                        <p className="text-xs text-destructive mt-1">{errors.city.message}</p>
                      )}
                    </div>

                    {/* Zip */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        {...register("zipCode")}
                        className={`w-full h-11 px-4 rounded-xl border bg-muted/20 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all ${errors.zipCode ? "border-destructive focus:ring-destructive/30" : "border-border focus:border-primary"
                          }`}
                      />
                      {errors.zipCode && (
                        <p className="text-xs text-destructive mt-1">{errors.zipCode.message}</p>
                      )}
                    </div>

                    {/* Country */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Country
                      </label>
                      <input
                        type="text"
                        {...register("country")}
                        className={`w-full h-11 px-4 rounded-xl border bg-muted/20 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all ${errors.country ? "border-destructive focus:ring-destructive/30" : "border-border focus:border-primary"
                          }`}
                      />
                      {errors.country && (
                        <p className="text-xs text-destructive mt-1">{errors.country.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-md shadow-primary/10 cursor-pointer animate-pulse"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Payment Method details */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm glass space-y-4">
                  <h2 className="font-bold text-lg border-b border-border/40 pb-3.5 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span>Payment Method</span>
                  </h2>

                  <div className="space-y-3">
                    {/* Credit card */}
                    <label className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10 cursor-pointer transition-colors hover:bg-muted/20">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value="card"
                          {...register("paymentMethod")}
                          className="text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="text-sm font-semibold">Credit / Debit Card</p>
                          <p className="text-xs text-muted-foreground">Visa, MasterCard, Amex</p>
                        </div>
                      </div>
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </label>

                    {/* PayPal */}
                    <label className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10 cursor-pointer transition-colors hover:bg-muted/20">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value="paypal"
                          {...register("paymentMethod")}
                          className="text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="text-sm font-semibold">PayPal Wallet</p>
                          <p className="text-xs text-muted-foreground">Express fast checkouts</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-500 italic">PayPal</span>
                    </label>

                    {/* Cash on delivery */}
                    <label className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/10 cursor-pointer transition-colors hover:bg-muted/20">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value="cod"
                          {...register("paymentMethod")}
                          className="text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="text-sm font-semibold">Cash On Delivery (COD)</p>
                          <p className="text-xs text-muted-foreground">Pay with cash upon receipt</p>
                        </div>
                      </div>
                      <Truck className="h-5 w-5 text-muted-foreground" />
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-sm text-foreground transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep2}
                    className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-md shadow-primary/10 cursor-pointer animate-pulse"
                  >
                    <span>Review Order Details</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Checkout Summary review panel */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm glass space-y-5">
                  <h2 className="font-bold text-lg border-b border-border/40 pb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Review Information Details</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground uppercase font-bold text-[10px] tracking-wider">Shipping Destination</p>
                      <p className="font-bold text-foreground mt-1">{watchAllFields.fullName}</p>
                      <p className="text-muted-foreground">{watchAllFields.address}</p>
                      <p className="text-muted-foreground">{watchAllFields.city}, {watchAllFields.zipCode}, {watchAllFields.country}</p>
                      <p className="text-muted-foreground/80 mt-1">{watchAllFields.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground uppercase font-bold text-[10px] tracking-wider">Selected Payment Option</p>
                      <p className="font-bold text-foreground capitalize mt-1">
                        {watchAllFields.paymentMethod === "card"
                          ? "Credit / Debit Card"
                          : watchAllFields.paymentMethod === "paypal"
                            ? "PayPal Wallet"
                            : "Cash on Delivery (COD)"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 h-12 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-sm text-foreground transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Pay & Place Order (${totals.grandTotal.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

          </form>
        </div>

        {/* Order Summary Panel - Right column (1/3 width) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm glass space-y-5">
            <h2 className="font-bold text-base border-b border-border/40 pb-3">Items Review</h2>

            {/* List items scrollbox */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 text-xs items-center">
                  <div className="relative h-12 w-12 rounded-lg border border-border/40 overflow-hidden bg-muted/15 shrink-0">
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground truncate">{item.product.title}</p>
                    <p className="text-muted-foreground">
                      Qty: {item.quantity} &bull; ${item.product.price} each
                    </p>
                  </div>
                  <span className="font-bold text-foreground">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals Summary */}
            <div className="border-t border-border/45 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground font-semibold">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">${totals.subtotal.toFixed(2)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Coupon Discount</span>
                  <span>-${totals.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground font-semibold">
                <span>Estimated Tax (8%)</span>
                <span className="font-bold text-foreground">${totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground font-semibold">
                <span>Shipping Rates</span>
                <span className="font-bold text-foreground">
                  {totals.shipping === 0 ? "FREE" : `$${totals.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-border/40 pt-3 text-foreground">
                <span>Total Due</span>
                <span className="text-base">${totals.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-primary/10 bg-primary/5 text-[10px] text-muted-foreground leading-normal">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <span>
                Your billing information is secure. Encrypted transaction data remains completely private.
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}


