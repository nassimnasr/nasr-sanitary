"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/app/components/LanguageProvider";
import { useCartStore } from "@/lib/store";

type ProductDetail = {
  id: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  price: number;
  stock: number;
  image: string | null;
  category: string;
};

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, dictionary } = useLanguage();
  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    async function loadProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/products/${id}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(locale === "ar" ? "المنتج غير موجود" : "Product not found");
          }
          throw new Error("Failed to fetch product");
        }
        const data = (await response.json()) as ProductDetail;
        setProduct(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : locale === "ar"
              ? "فشل تحميل المنتج"
              : "Failed to load product"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
    return () => controller.abort();
  }, [id, locale]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
          {dictionary.common.loading}
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
          {error ?? dictionary.errors.notFound}
        </div>
      </div>
    );
  }

  const isArabic = locale === "ar";
  const localizedName = isArabic ? product.nameAr : product.nameEn;
  const localizedDescription = isArabic ? product.descAr : product.descEn;
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        productNumber: `NS-${product.id.slice(-6).toUpperCase()}`,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        image: product.image,
        price: product.price,
        color: "Standard",
        brandName: product.category,
        stock: product.stock,
      },
      quantity
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2 md:p-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          {product.image ? (
            <img src={product.image} alt={localizedName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex min-h-[420px] items-center justify-center text-sm text-slate-500">
              {isArabic ? "لا توجد صورة لهذا المنتج" : "No image available for this product"}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{localizedName}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">{localizedDescription}</p>

          <p className="mt-6 text-3xl font-extrabold text-slate-900">
            $ {product.price.toLocaleString()}
          </p>
          <p className={`mt-3 text-sm font-semibold ${inStock ? "text-emerald-700" : "text-red-600"}`}>
            {inStock ? dictionary.products.inStock : dictionary.products.outOfStock}
            {inStock ? ` (${product.stock})` : ""}
          </p>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {dictionary.common.quantity}
            </label>
            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-300 p-1">
              <button
                type="button"
                className="h-9 w-9 rounded-lg bg-slate-100 text-lg font-bold text-slate-700 hover:bg-slate-200"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="inline-flex min-w-10 justify-center text-sm font-semibold text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                className="h-9 w-9 rounded-lg bg-slate-100 text-lg font-bold text-slate-700 hover:bg-slate-200"
                onClick={() =>
                  setQuantity((prev) => Math.min(product.stock > 0 ? product.stock : 1, prev + 1))
                }
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock}
            className="mt-8 w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {inStock ? dictionary.products.addToCart : dictionary.products.outOfStock}
          </button>
        </div>
      </div>
    </div>
  );
}
