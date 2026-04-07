"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductFormState = {
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  price: string;
  stock: string;
  category: string;
  image: string;
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>({
    nameEn: "",
    nameAr: "",
    descEn: "",
    descAr: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const payload = {
      nameEn: form.nameEn.trim(),
      nameAr: form.nameAr.trim(),
      descEn: form.descEn.trim(),
      descAr: form.descAr.trim(),
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      category: form.category.trim(),
      image: form.image.trim(),
    };

    if (
      !payload.nameEn ||
      !payload.nameAr ||
      !payload.descEn ||
      !payload.descAr ||
      Number.isNaN(payload.price) ||
      Number.isNaN(payload.stock) ||
      !payload.category
    ) {
      setError("Please complete every field with valid values.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to create product");
      }

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Add New Product</h1>
        <p className="mt-2 text-sm text-slate-600">Create a new product listing for your store.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Name (English)
            <input
              value={form.nameEn}
              onChange={(event) => setForm((prev) => ({ ...prev, nameEn: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none ring-sky-500 focus:ring-2"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Name (Arabic)
            <input
              value={form.nameAr}
              onChange={(event) => setForm((prev) => ({ ...prev, nameAr: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none ring-sky-500 focus:ring-2"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Price
            <input
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              type="number"
              step="0.01"
              min="0"
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none ring-sky-500 focus:ring-2"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Stock
            <input
              value={form.stock}
              onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
              type="number"
              min="0"
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none ring-sky-500 focus:ring-2"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Category
            <input
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none ring-sky-500 focus:ring-2"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Image URL
            <input
              value={form.image}
              onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none ring-sky-500 focus:ring-2"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Description (English)
            <textarea
              value={form.descEn}
              onChange={(event) => setForm((prev) => ({ ...prev, descEn: event.target.value }))}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none ring-sky-500 focus:ring-2"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Description (Arabic)
            <textarea
              value={form.descAr}
              onChange={(event) => setForm((prev) => ({ ...prev, descAr: event.target.value }))}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none ring-sky-500 focus:ring-2"
              required
            />
          </label>
        </div>

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Saving..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
