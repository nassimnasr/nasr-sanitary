"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminProduct {
  id: string;
  nameEn: string;
  nameAr: string;
  category: string;
  price: number;
  stock: number;
  createdAt: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/products");
        if (!response.ok) throw new Error("Unable to load products");
        const data = (await response.json()) as AdminProduct[];
        if (mounted) setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product permanently?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      setProducts((current) => current.filter((product) => product.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
          <p className="mt-2 text-sm text-slate-600">Browse and manage your product catalog.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Add New Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Name (EN)</th>
              <th className="px-5 py-4 font-semibold">Category</th>
              <th className="px-5 py-4 font-semibold">Price</th>
              <th className="px-5 py-4 font-semibold">Stock</th>
              <th className="px-5 py-4 font-semibold">Created</th>
              <th className="px-5 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="border-t border-slate-200">
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                  Loading products...
                </td>
              </tr>
            ) : error ? (
              <tr className="border-t border-slate-200">
                <td colSpan={6} className="px-5 py-8 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr className="border-t border-slate-200">
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-800">{product.nameEn}</td>
                  <td className="px-5 py-4 text-slate-600">{product.category}</td>
                  <td className="px-5 py-4 text-slate-600">EGP {product.price.toLocaleString()}</td>
                  <td className="px-5 py-4 text-slate-600">{product.stock}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
