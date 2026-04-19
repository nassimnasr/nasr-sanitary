"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/app/components/LanguageProvider";
import { useCartStore } from "@/lib/store";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import logoImage from "../../logo.jpg";

type SearchProduct = {
  id: string;
  nameEn: string;
  nameAr: string;
  category: string;
};

export default function Navbar() {
  const { locale, setLocale, dictionary } = useLanguage();
  const router = useRouter();
  const itemCount = useCartStore((state) => state.itemCount());
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [suggestions, setSuggestions] = useState<SearchProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const query = headerSearch.trim();

    if (!query) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        const data = (await response.json()) as SearchProduct[];
        setSuggestions(data.slice(0, 6));
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [headerSearch]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = headerSearch.trim();
    router.push(value ? `/products?search=${encodeURIComponent(value)}` : "/products");
    setShowSuggestions(false);
    setIsMobileMenuOpen(false);
  }

  function handleSuggestionClick(productId: string) {
    router.push(`/products/${productId}`);
    setShowSuggestions(false);
    setIsMobileMenuOpen(false);
  }

  const shouldShowSuggestions = showSuggestions && headerSearch.trim().length > 0;

  function renderSearchBox(inputWidthClass: string) {
    return (
      <div className="relative">
        <form onSubmit={handleSearchSubmit}>
          <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2">
            <MagnifyingGlassIcon className="mr-2 h-4 w-4 text-slate-500" />
            <input
              type="search"
              value={headerSearch}
              onChange={(event) => setHeaderSearch(event.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
              placeholder={locale === "ar" ? "ابحث عن منتج..." : "Search products..."}
              className={`${inputWidthClass} bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400`}
              aria-label={dictionary.common.search}
            />
          </div>
        </form>

        {shouldShowSuggestions ? (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
            {isSearching ? (
              <p className="px-2 py-2 text-xs text-slate-500">
                {locale === "ar" ? "جاري البحث..." : "Searching..."}
              </p>
            ) : suggestions.length > 0 ? (
              <ul className="space-y-1">
                {suggestions.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onMouseDown={() => handleSuggestionClick(product.id)}
                      className="w-full rounded-lg px-2 py-2 text-left transition hover:bg-slate-100"
                    >
                      <p className="text-sm font-medium text-slate-800">
                        {locale === "ar" ? product.nameAr : product.nameEn}
                      </p>
                      <p className="text-xs text-slate-500">{product.category}</p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-2 py-2 text-xs text-slate-500">
                {locale === "ar" ? "لا توجد نتائج مطابقة" : "No matching products"}
              </p>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Image
              src={logoImage}
              alt="Nasr Sanitary logo"
              width={36}
              height={36}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">
              {mounted ? dictionary.common.appName : "Nasr Sanitary"}
            </p>
            <p className="text-xs text-slate-500">Sanitary Solutions</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-slate-700 hover:text-sky-700">
            {dictionary.nav.home}
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-slate-700 hover:text-sky-700"
          >
            {dictionary.nav.products}
          </Link>
          <Link href="/cart" className="text-sm font-medium text-slate-700 hover:text-sky-700">
            {dictionary.nav.cart}
          </Link>
          <Link
            href="/orders"
            className="text-sm font-medium text-slate-700 hover:text-sky-700"
          >
            {dictionary.nav.orders}
          </Link>
          {session?.user?.role === "admin" ? (
            <Link
              href="/admin"
              className="text-sm font-medium text-slate-700 hover:text-sky-700"
            >
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">{renderSearchBox("w-36 lg:w-44")}</div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:border-slate-300 hover:text-slate-900 md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>

          <div className="rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                locale === "en"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("ar")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                locale === "ar"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              AR
            </button>
          </div>

          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:border-slate-300 hover:text-slate-900"
            aria-label={mounted ? dictionary.nav.cart : "Cart"}
          >
            <ShoppingCartIcon className="h-5 w-5" />
            {mounted && itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="max-w-28 truncate text-sm font-medium text-slate-700">
                {session.user?.name}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                {dictionary.nav.logout}
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                {dictionary.nav.login}
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[#2F3E4D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#2F3E4D]/90"
              >
                {dictionary.nav.register}
              </Link>
            </div>
          )}
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-3 md:hidden">
          <div className="mb-3">{renderSearchBox("w-full")}</div>

          <nav className="grid gap-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-sky-700"
            >
              {dictionary.nav.home}
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-sky-700"
            >
              {dictionary.nav.products}
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-sky-700"
            >
              {dictionary.nav.cart}
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-sky-700"
            >
              {dictionary.nav.orders}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
