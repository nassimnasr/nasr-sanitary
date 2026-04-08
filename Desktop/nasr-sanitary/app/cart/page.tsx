"use client";

import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/app/components/LanguageProvider";
import { useCartStore } from "@/lib/store";

export default function CartPage() {
  const { locale, dictionary } = useLanguage();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const total = useCartStore((state) => state.subtotal());

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">{dictionary.cart.title}</h1>
          <p className="mt-2 text-slate-600">{dictionary.cart.empty}</p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
          >
            {dictionary.cart.continueShopping}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">{dictionary.cart.title}</h1>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[120px_1fr]"
            >
              <div className="h-28 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-24">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={locale === "ar" ? item.nameAr : item.nameEn}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-500">
                    {locale === "ar" ? "لا توجد صورة" : "No image"}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {locale === "ar" ? item.nameAr : item.nameEn}
                </h2>
                <p className="text-sm text-slate-500">
                  {dictionary.products.brand}: {item.brandName}
                </p>
                <p className="text-sm text-slate-500">
                  {dictionary.products.color}: {item.color}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-300 p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8 rounded-lg bg-slate-100 text-lg font-bold text-slate-700 hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span className="inline-flex min-w-8 justify-center text-sm font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 rounded-lg bg-slate-100 text-lg font-bold text-slate-700 hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-500">
                      {dictionary.common.subtotal}: $ {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                      {dictionary.cart.removeItem}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-bold text-slate-900">{dictionary.checkout.orderSummary}</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>
              {dictionary.common.total}:{" "}
              <span className="font-bold text-slate-900">$ {total.toLocaleString()}</span>
            </p>
            <p>{dictionary.cart.codNotice}</p>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
          >
            {dictionary.cart.proceedToCheckout}
          </Link>
        </aside>
      </div>
    </div>
  );
}
