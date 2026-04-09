"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/LanguageProvider";
import { useCartStore } from "@/lib/store";

export type ProductListItem = {
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
  createdAt: string;
};

type ProductCardProps = {
  product: ProductListItem;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { locale, dictionary } = useLanguage();
  const addToCart = useCartStore((state) => state.addToCart);

  const isArabic = locale === "ar";
  const localizedName = isArabic ? product.nameAr : product.nameEn;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      productNumber: `NS-${product.id.slice(-6).toUpperCase()}`,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      image: product.image,
      price: product.price,
      color: "Standard",
      brandName: product.brand,
      stock: product.stock,
    });
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="block">
        <div className="h-52 w-full bg-slate-100">
          {product.image ? (
            <img src={product.image} alt={localizedName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              {isArabic ? "لا توجد صورة" : "No image"}
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
          {product.brand}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-slate-900 hover:text-sky-700">
            {localizedName}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-slate-500">
          {dictionary.products.category}: {product.category}
        </p>
        <p className="mt-3 text-lg font-bold text-slate-900">
          $ {product.price.toLocaleString()}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {product.stock > 0 ? dictionary.products.addToCart : dictionary.products.outOfStock}
        </button>
      </div>
    </article>
  );
}
