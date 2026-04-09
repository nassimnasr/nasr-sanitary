"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/components/LanguageProvider";
import { useCartStore } from "@/lib/store";

type CheckoutForm = {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { locale, dictionary } = useLanguage();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.subtotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lebaneseCities = [
    "Tripoli",
    "Beirut",
    "Sidon",
    "Tyre",
    "Jounieh",
    "Zahle",
    "Baalbek",
  ];

  const isValid = useMemo(() => {
    return (
      form.fullName.trim() &&
      form.phone.trim() &&
      form.city.trim() &&
      form.address.trim() &&
      items.length > 0
    );
  }, [form, items.length]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          city: form.city,
          address: form.address,
          notes: form.notes,
          items,
        }),
      });

      const text = await response.text();
      const result = text.trim()
        ? JSON.parse(text)
        : { error: locale === "ar" ? "الاستجابة من الخادم فارغة" : "Empty server response" };

      if (!response.ok || !("orderId" in result)) {
        throw new Error(
          "error" in result
            ? result.error
            : locale === "ar"
              ? "فشل إنشاء الطلب"
              : "Failed to create order"
        );
      }

      clearCart();
      router.push(
        `/order-confirmation?orderId=${result.orderId}&total=${result.total}&status=${result.status}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : locale === "ar"
            ? "حدث خطأ غير متوقع"
            : "Unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">{dictionary.checkout.title}</h1>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h2 className="text-lg font-bold text-slate-900">{dictionary.checkout.customerInfo}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              {dictionary.checkout.fullName}
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              {dictionary.checkout.phone}
              <input
                required
                placeholder="+961 79 197 888"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              {dictionary.checkout.city}
              <select
                required
                value={form.city}
                onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
              >
                <option value="">Select city</option>
                {lebaneseCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              {dictionary.checkout.address}
              <input
                required
                placeholder="Al Mina, Tripoli"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            {dictionary.checkout.notes}
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
            />
          </label>

          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
            {dictionary.checkout.paymentMethod}: <strong>{dictionary.checkout.cashOnDelivery}</strong>
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? dictionary.common.loading : dictionary.checkout.placeOrder}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-bold text-slate-900">{dictionary.checkout.orderSummary}</h3>
          {mounted ? (
            <>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <p className="text-slate-700">
                      {locale === "ar" ? item.nameAr : item.nameEn} x {item.quantity}
                    </p>
                    <p className="font-semibold text-slate-900">
                      $ {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-slate-200 pt-4 text-sm">
                <p className="flex items-center justify-between font-bold text-slate-900">
                  <span>{dictionary.common.total}</span>
                  <span>$ {total.toLocaleString()}</span>
                </p>
              </div>
            </>
          ) : (
            <div className="mt-4 h-24 animate-pulse bg-slate-100 rounded-lg" />
          )}
        </aside>
      </div>
    </div>
  );
}
