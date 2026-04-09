"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/app/components/LanguageProvider";
import { useCartStore } from "@/lib/store";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { locale, setLocale, dictionary } = useLanguage();
  const itemCount = useCartStore((state) => state.itemCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-sm font-bold text-white">
            NS
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

        <div className="flex items-center gap-3">
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
                className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                {dictionary.nav.register}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
