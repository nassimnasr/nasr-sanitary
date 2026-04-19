"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/components/LanguageProvider";

type Order = {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  phone: string;
  address: string;
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      nameEn: string;
      nameAr: string;
      image: string | null;
    };
  }[];
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { locale, dictionary } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/login");
      return;
    }

    async function loadOrders() {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Failed to load orders");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [session, status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-slate-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
          <p className="mt-2 text-slate-600">You haven't placed any orders yet.</p>
          <a
            href="/products"
            className="mt-6 inline-block rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Order #{order.id.slice(-8)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-900">
                    ${order.total.toLocaleString()}
                  </p>
                  <p className={`text-sm font-medium ${
                    order.status === 'pending' ? 'text-yellow-600' :
                    order.status === 'confirmed' ? 'text-blue-600' :
                    order.status === 'shipped' ? 'text-purple-600' :
                    order.status === 'delivered' ? 'text-green-600' :
                    'text-red-600'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={locale === 'ar' ? item.product.nameAr : item.product.nameEn}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-200 text-xs text-slate-500">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {locale === 'ar' ? item.product.nameAr : item.product.nameEn}
                      </p>
                      <p className="text-sm text-slate-600">
                        Quantity: {item.quantity} × ${item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        ${(item.quantity * item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4">
                <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <div>
                    <p className="font-medium text-slate-900">Contact Information</p>
                    <p>Phone: {order.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Shipping Address</p>
                    <p className="whitespace-pre-line">{order.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}