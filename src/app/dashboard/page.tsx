"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useTheme } from "next-themes";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { Product } from "@/types/product";
import {
  User as UserIcon,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Calendar,
  Lock,
  Moon,
  Sun,
  Loader2,
  Trash2,
  Truck,
  CheckCircle2,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Mock Order History details
const MOCK_ORDERS = [
  {
    id: "CC-894021",
    date: "2026-06-28",
    status: "Delivered",
    total: 129.5,
    items: [
      { id: 1, title: "Essence Mascara Lash Princess", quantity: 2, price: 9.99, thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png" },
      { id: 2, title: "Eyeshadow Palette with Mirror", quantity: 1, price: 19.99, thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png" },
      { id: 3, title: "Powder Canister", quantity: 3, price: 14.99, thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png" }
    ],
  },
  {
    id: "CC-730194",
    date: "2026-07-02",
    status: "In Transit",
    total: 45.0,
    items: [
      { id: 4, title: "Red Lipstick", quantity: 1, price: 12.99, thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.png" },
      { id: 5, title: "Red Nail Polish", quantity: 2, price: 8.99, thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/thumbnail.png" }
    ],
  }
];

// Initial mock wishlist items
const INITIAL_WISHLIST: Product[] = [
  {
    id: 1,
    title: "Essence Mascara Lash Princess",
    description: "The Essence Mascara Lash Princess is a popular mascara known for its volume and lengthening effects.",
    category: "beauty",
    price: 9.99,
    discountPercentage: 7.17,
    rating: 4.94,
    stock: 5,
    tags: ["beauty", "mascara"],
    brand: "Essence",
    sku: "RCH17097",
    weight: 2,
    dimensions: { width: 23.17, height: 14.43, depth: 28.01 },
    warrantyInformation: "1 month warranty",
    shippingInformation: "Ships in 1 month",
    availabilityStatus: "Low Stock",
    reviews: [],
    returnPolicy: "30 days return policy",
    minimumOrderQuantity: 2,
    meta: { createdAt: "2024-05-23T08:56:21.618Z", updatedAt: "2024-05-23T08:56:21.618Z", barcode: "9167812002481", qrCode: "" },
    images: ["https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png"],
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
  },
  {
    id: 2,
    title: "Eyeshadow Palette with Mirror",
    description: "The Eyeshadow Palette with Mirror offers a versatile range of colors for various eye makeup looks.",
    category: "beauty",
    price: 19.99,
    discountPercentage: 5.5,
    rating: 4.85,
    stock: 44,
    tags: ["beauty", "eyeshadow"],
    brand: "Glamour",
    sku: "RCH17098",
    weight: 3,
    dimensions: { width: 12.5, height: 8.2, depth: 1.5 },
    warrantyInformation: "1 year warranty",
    shippingInformation: "Ships in 2 days",
    availabilityStatus: "In Stock",
    reviews: [],
    returnPolicy: "30 days return policy",
    minimumOrderQuantity: 1,
    meta: { createdAt: "2024-05-23T08:56:21.618Z", updatedAt: "2024-05-23T08:56:21.618Z", barcode: "9167812002482", qrCode: "" },
    images: ["https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png"],
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png"
  }
];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state
  const activeTab = searchParams.get("tab") || "profile";

  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const { setTheme, resolvedTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);

  useEffect(() => {
    setThemeMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const addCartItem = useCartStore((state) => state.addItem);

  // Local wishlist state
  const [wishlist, setWishlist] = useState<Product[]>(INITIAL_WISHLIST);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Password fields
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleTabChange = (tabName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabName);
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out", {
      description: "See you next time!"
    });
    router.push("/");
  };

  const handleAddToCart = (product: Product) => {
    addCartItem(product, 1);
    toast.success("Added to Cart", {
      description: `${product.title} has been added to your basket.`
    });
  };

  const handleRemoveFromWishlist = (id: number, title: string) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
    toast.info("Removed from Wishlist", {
      description: `${title} has been removed.`
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Password updated successfully (Demo mode)");
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  if (!user) {
    return (
      <div className="grow flex flex-col items-center justify-center min-h-100 gap-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Validating dashboard authorization...</p>
      </div>
    );
  }

  const userInitials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 grow flex flex-col gap-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Account Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Manage your profile, monitor shipping tracks, and configure site preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-6 glass">
            {/* User Profile Summary */}
            <div className="flex flex-col items-center text-center gap-3 border-b border-border/40 pb-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-tr from-primary to-indigo-500 text-2xl font-bold text-primary-foreground shadow-md overflow-hidden">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userInitials
                )}
              </div>
              <div>
                <h2 className="font-bold text-lg">{user.firstName} {user.lastName}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">@{user.username}</p>
              </div>
            </div>

            {/* Nav tabs */}
            <nav className="flex flex-col gap-1.5">
              <button
                onClick={() => handleTabChange("profile")}
                className={`flex items-center gap-3 w-full px-4 h-11 rounded-xl text-sm font-semibold transition-colors ${activeTab === "profile"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
              >
                <UserIcon className="h-4.5 w-4.5" />
                <span>Profile Details</span>
              </button>
              <button
                onClick={() => handleTabChange("orders")}
                className={`flex items-center justify-between w-full px-4 h-11 rounded-xl text-sm font-semibold transition-colors ${activeTab === "orders"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-4.5 w-4.5" />
                  <span>My Orders</span>
                </div>
                <span className="bg-muted px-2 py-0.5 rounded text-[10px] text-foreground font-bold">
                  {MOCK_ORDERS.length}
                </span>
              </button>
              <button
                onClick={() => handleTabChange("wishlist")}
                className={`flex items-center justify-between w-full px-4 h-11 rounded-xl text-sm font-semibold transition-colors ${activeTab === "wishlist"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="h-4.5 w-4.5" />
                  <span>Wishlist</span>
                </div>
                <span className="bg-muted px-2 py-0.5 rounded text-[10px] text-foreground font-bold">
                  {wishlist.length}
                </span>
              </button>
              <button
                onClick={() => handleTabChange("settings")}
                className={`flex items-center gap-3 w-full px-4 h-11 rounded-xl text-sm font-semibold transition-colors ${activeTab === "settings"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
              >
                <Settings className="h-4.5 w-4.5" />
                <span>Preferences</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 h-11 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors border-t border-border/40 mt-3 pt-3"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Personal Info */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm glass space-y-6">
                  <div className="border-b border-border/40 pb-4">
                    <h3 className="text-lg font-bold">Personal Profile</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Your personal credentials details.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">First Name</span>
                      <p className="text-sm font-semibold">{user.firstName}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Last Name</span>
                      <p className="text-sm font-semibold">{user.lastName}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Username</span>
                      <p className="text-sm font-semibold">{user.username}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</span>
                      <p className="text-sm font-semibold">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Gender</span>
                      <p className="text-sm font-semibold capitalize">{user.gender}</p>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Shipping Address */}
                  <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm glass space-y-4">
                    <div className="flex items-center justify-between border-b border-border/40 pb-3">
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>Shipping Address</span>
                      </h4>
                      <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
                        Default
                      </span>
                    </div>
                    <div className="text-xs space-y-1.5 leading-relaxed">
                      <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                      <p className="text-muted-foreground">100 Innovation Way, Suite 400</p>
                      <p className="text-muted-foreground">Seattle, WA 98101</p>
                      <p className="text-muted-foreground">United States</p>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm glass space-y-4">
                    <div className="flex items-center justify-between border-b border-border/40 pb-3">
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Billing Address</span>
                      </h4>
                      <span className="text-[10px] font-bold uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        Same as Shipping
                      </span>
                    </div>
                    <div className="text-xs space-y-1.5 leading-relaxed">
                      <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                      <p className="text-muted-foreground">100 Innovation Way, Suite 400</p>
                      <p className="text-muted-foreground">Seattle, WA 98101</p>
                      <p className="text-muted-foreground">United States</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {MOCK_ORDERS.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  const isDelivered = order.status === "Delivered";

                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-border/80 bg-card shadow-sm glass overflow-hidden transition-all duration-200"
                    >
                      {/* Order Header Summary */}
                      <div
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-muted/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl ${isDelivered ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"}`}>
                            {isDelivered ? <CheckCircle2 className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-foreground">{order.id}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDelivered ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                                }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {order.date}
                              </span>
                              <span>•</span>
                              <span>{order.items.reduce((sum, i) => sum + i.quantity, 0)} items</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-border/30 pt-3 sm:border-0 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Order Total</span>
                            <p className="font-extrabold text-base mt-0.5">${order.total.toFixed(2)}</p>
                          </div>
                          <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                        </div>
                      </div>

                      {/* Expanded breakdown list */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden bg-muted/20 border-t border-border/40"
                          >
                            <div className="p-5 space-y-4">
                              <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Purchased Items</h5>
                              <div className="divide-y divide-border/40">
                                {order.items.map((item) => (
                                  <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                      <div className="relative h-12 w-12 rounded-xl bg-muted border border-border/60 overflow-hidden shrink-0">
                                        <Image
                                          src={item.thumbnail}
                                          alt={item.title}
                                          fill
                                          sizes="48px"
                                          className="object-cover"
                                        />
                                      </div>
                                      <div>
                                        <h6 className="font-bold text-sm leading-snug">{item.title}</h6>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                          ${item.price.toFixed(2)} × {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === "wishlist" && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {wishlist.length === 0 ? (
                  <div className="text-center py-16 bg-card border border-border/80 rounded-2xl flex flex-col items-center gap-4 shadow-sm glass">
                    <Heart className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <h3 className="font-bold text-lg">Your Wishlist is Empty</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mt-1">
                        Find products in the catalog and click the wishlist button to save them.
                      </p>
                    </div>
                    <Link
                      href="/products"
                      className="px-5 h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 flex items-center justify-center shadow-md"
                    >
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm glass flex gap-4 items-center justify-between"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="relative h-16 w-16 rounded-xl bg-muted border border-border/60 overflow-hidden shrink-0">
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                            <h4 className="font-bold text-sm leading-snug mt-1.5 truncate max-w-37.5 sm:max-w-50">
                              {item.title}
                            </h4>
                            <p className="font-extrabold text-sm mt-0.5 text-foreground">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="px-3 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/95 transition-all shadow-sm flex items-center gap-1.5"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>Add</span>
                          </button>
                          <button
                            onClick={() => handleRemoveFromWishlist(item.id, item.title)}
                            className="px-3 h-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive hover:border-destructive/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* PREFERENCES SETTINGS TAB */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Theme Preference Settings */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm glass space-y-4">
                  <div className="border-b border-border/40 pb-3 flex items-center gap-2">
                    <Settings className="h-4.5 w-4.5 text-primary" />
                    <h3 className="font-bold text-base">Theme Mode Configuration</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Dark / Light Layout Theme</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Toggle between dark and light colors.</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors"
                    >
                      {themeMounted && resolvedTheme === "dark" ? (
                        <Sun className="h-5 w-5 text-amber-400" />
                      ) : (
                        <Moon className="h-5 w-5 text-indigo-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Form */}
                <form
                  onSubmit={handlePasswordChange}
                  className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm glass space-y-4"
                >
                  <div className="border-b border-border/40 pb-3 flex items-center gap-2">
                    <Lock className="h-4.5 w-4.5 text-primary" />
                    <h3 className="font-bold text-base">Change Secure Password</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Current Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.current}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                          className="w-full h-10 px-3 rounded-lg border border-border bg-muted/20 focus:bg-background focus:outline-none text-xs"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          New Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.new}
                          onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                          className="w-full h-10 px-3 rounded-lg border border-border bg-muted/20 focus:bg-background focus:outline-none text-xs"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Confirm Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                          className="w-full h-10 px-3 rounded-lg border border-border bg-muted/20 focus:bg-background focus:outline-none text-xs"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span>{showPassword ? "Hide" : "Show"} Passwords</span>
                      </button>
                      <button
                        type="submit"
                        className="px-5 h-9 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/95 shadow-sm transition-all"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="grow flex flex-col items-center justify-center min-h-100 gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading dashboard...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
