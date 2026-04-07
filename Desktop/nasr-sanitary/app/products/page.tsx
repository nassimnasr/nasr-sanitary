"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard, { type ProductListItem } from "@/app/components/ProductCard";
import { useLanguage } from "@/app/components/LanguageProvider";

export default function ProductsPage() {
  const { locale, dictionary } = useLanguage();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (search.trim()) params.set("search", search.trim());

      try {
        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = (await response.json()) as ProductListItem[];
        setProducts(data);
      } catch {
        setError(locale === "ar" ? "فشل في تحميل المنتجات" : "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, [category, search, locale]);

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category));
    return ["all", ...Array.from(unique)];
  }, [products]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{dictionary.nav.products}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {locale === "ar"
            ? "استكشف أفضل الأدوات الصحية المتاحة لدينا."
            : "Explore our premium sanitary product collection."}
        </p>
      </div>

      <div className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            {dictionary.common.search}
          </label>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={locale === "ar" ? "ابحث باسم المنتج..." : "Search by product name..."}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-500 transition focus:ring-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            {dictionary.products.category}
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-500 transition focus:ring-2"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? dictionary.products.allCategories : item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
          {dictionary.common.loading}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
          {dictionary.products.noProducts}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
