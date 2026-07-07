"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useCartDrawerStore } from "@/store/cartDrawerStore";
import { useTheme } from "next-themes";
import { useUserStore } from "@/store/userStore";
import { getInitials } from "@/lib/utils";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const desktopSearchRef = useRef<HTMLFormElement>(null);
  const mobileSearchRef = useRef<HTMLFormElement>(null);

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const logout = useUserStore((state) => state.logout);

  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const openCartDrawer = useCartDrawerStore((state) => state.openDrawer);

  // Sync search input with URL search param
  useEffect(() => {
    const q = searchParams.get("search") || "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery(q);
  }, [searchParams]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      return;
    }

    let active = true;
    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(debouncedQuery)}`
        );
        const data = await res.json();
        if (active) {
          setSearchResults(data.products.slice(0, 8)); // 5 to 8 results max
        }
      } catch (err) {
        console.error("Search API error:", err);
      } finally {
        if (active) {
          setIsSearching(false);
        }
      }
    };

    fetchResults();

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  // Close dropdown and search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close suggestions on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowSuggestions(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    router.push("/");
  };

  const renderSuggestions = (closeMenu = false) => {
    if (!showSuggestions || searchQuery.trim() === "") return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-md p-2 shadow-2xl overflow-hidden max-h-95 overflow-y-auto">
        {isSearching ? (
          <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Searching...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="flex flex-col gap-1">
            {searchResults.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                onClick={() => {
                  setShowSuggestions(false);
                  setSearchQuery("");
                  if (closeMenu) {
                    setMobileMenuOpen(false);
                  }
                }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/60 transition-colors duration-150 text-foreground"
              >
                {product.thumbnail && (
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-border/40 shrink-0 bg-muted/40">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col items-start text-left">
                  <h4 className="text-sm font-semibold truncate w-full leading-tight text-foreground">
                    {product.title}
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-0.5">
                    {product.category}
                  </span>
                </div>
                <span className="text-sm font-extrabold shrink-0 text-foreground">
                  ${product.price}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-muted-foreground">
            No products found for &ldquo;{searchQuery}&rdquo;
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md dark:bg-background/80 transition-colors duration-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="Click & Connect Logo"
              width={160}
              height={60}
              priority
              className="h-10 w-auto object-contain dark:brightness-110"
            />
          </Link>

          {/* Search bar - Desktop */}
          <form
            ref={desktopSearchRef}
            onSubmit={handleSearchSubmit}
            className="hidden md:flex relative flex-1 max-w-md mx-8"
          >
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full h-10 pl-4 pr-10 rounded-full border border-border bg-muted/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </button>
            {renderSuggestions(false)}
          </form>

          {/* Nav Icons */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle Theme"
            >
              {mounted && resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Wishlist */}
            <Link
              href="/dashboard?tab=wishlist"
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={openCartDrawer}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            <div className="relative" ref={dropdownRef}>
              {isAuthenticated && user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-tr from-primary to-indigo-500 text-sm font-semibold text-primary-foreground overflow-hidden">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(user.firstName + " " + user.lastName)
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-4 h-9 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-border/80 bg-popover p-2 text-popover-foreground shadow-xl ring-1 ring-black/5 focus:outline-none z-50"
                  >
                    <div className="px-3 py-2 border-b border-border/50 text-xs">
                      <p className="font-semibold text-foreground truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard?tab=profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile Details</span>
                      </Link>
                      <Link
                        href="/dashboard?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </div>
                    <div className="border-t border-border/50 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground md:hidden transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 max-w-xs w-full bg-background border-l border-border shadow-2xl p-6 z-50 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-lg">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <form
                ref={mobileSearchRef}
                onSubmit={handleSearchSubmit}
                className="relative mb-6"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full h-10 pl-4 pr-10 rounded-xl border border-border bg-muted/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/45"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </button>
                {renderSuggestions(true)}
              </form>

              {/* Navigation list */}
              <nav className="flex flex-col gap-4 font-medium text-lg flex-1">
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-1.5 hover:text-primary transition-colors border-b border-border/40"
                >
                  Shop Products
                </Link>
                <Link
                  href="/dashboard?tab=orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-1.5 hover:text-primary transition-colors border-b border-border/40"
                >
                  My Orders
                </Link>
                <Link
                  href="/dashboard?tab=wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-1.5 hover:text-primary transition-colors border-b border-border/40"
                >
                  Wishlist
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCartDrawer();
                  }}
                  className="w-full text-left px-2 py-1.5 hover:text-primary transition-colors border-b border-border/40 cursor-pointer"
                >
                  My Cart ({totalItems})
                </button>
              </nav>

              {/* Drawer Footer (User Profile & Logout) */}
              <div className="border-t border-border pt-6 flex flex-col gap-4">
                {isAuthenticated && user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr from-primary to-indigo-500 text-sm font-semibold text-primary-foreground overflow-hidden">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={`${user.firstName} ${user.lastName}`}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(user.firstName + " " + user.lastName)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/15 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/95 transition-all shadow-sm"
                  >
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
