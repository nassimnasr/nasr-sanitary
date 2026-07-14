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
  brand: string;
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
    let isActive = true;

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
        if (isActive) {
          setProduct(data);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : locale === "ar"
                ? "فشل تحميل المنتج"
                : "Failed to load product"
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();
    return () => {
      isActive = false;
      controller.abort();
    };
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
        brandName: product.brand,
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
            {product.brand}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{localizedName}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {dictionary.products.category}: {product.category}
          </p>
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

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 rounded-xl bg-[#2F3E4D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2F3E4D]/90 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {inStock ? dictionary.products.addToCart : dictionary.products.outOfStock}
            </button>
            <a
              href={`https://wa.me/9613226111?text=${encodeURIComponent(`Hi, I want more info about: ${locale === "ar" ? product.nameAr : product.nameEn}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#25D366]/90"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {locale === "ar" ? "مزيد من المعلومات" : "More Info"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
