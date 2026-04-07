"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/app/components/LanguageProvider";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const { locale, dictionary } = useLanguage();

  const orderId = searchParams.get("orderId") ?? "-";
  const total = searchParams.get("total") ?? "0";
  const status = searchParams.get("status") ?? "pending";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm sm:p-10">
        <h1 className="text-3xl font-extrabold text-emerald-800">
          {dictionary.checkout.successTitle}
        </h1>
        <p className="mt-3 text-sm leading-7 text-emerald-900 sm:text-base">
          {dictionary.checkout.successMessage}
        </p>

        <div className="mt-8 grid gap-3 rounded-2xl border border-emerald-200 bg-white p-5 text-sm text-slate-700">
          <p>
            <span className="font-semibold text-slate-900">{dictionary.orders.orderId}:</span>{" "}
            {orderId}
          </p>
          <p>
            <span className="font-semibold text-slate-900">{dictionary.orders.orderTotal}:</span>{" "}
            EGP {Number(total).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold text-slate-900">{dictionary.orders.orderStatus}:</span>{" "}
            {status}
          </p>
          <p>
            <span className="font-semibold text-slate-900">{dictionary.checkout.paymentMethod}:</span>{" "}
            {dictionary.checkout.cashOnDelivery}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/orders"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            {dictionary.nav.orders}
          </Link>
          <Link
            href="/products"
            className="rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
          >
            {locale === "ar" ? "متابعة التسوق" : "Continue Shopping"}
          </Link>
        </div>
      </div>
    </div>
  );
}
