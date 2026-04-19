"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/components/LanguageProvider";

type AdminOrder = {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  phone: string;
  address: string;
  user: {
    name: string;
  };
};

const orderStatuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { locale, dictionary } = useLanguage();

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/orders");
        if (!response.ok) {
          throw new Error("Unable to load orders");
        }
        const data = (await response.json()) as AdminOrder[];
        if (mounted) {
          setOrders(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadOrders();
    return () => {
      mounted = false;
    };
  }, []);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Unable to update status");
      }
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status: status as AdminOrder["status"] } : order
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update order status");
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: dictionary.orders.pending,
      confirmed: dictionary.orders.confirmed,
      shipped: dictionary.orders.shipped,
      delivered: dictionary.orders.delivered,
      cancelled: dictionary.orders.cancelled,
    };
    return statusMap[status] ?? status;
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">{dictionary.admin.orders}</h1>
        <p className="mt-2 text-sm text-slate-600">{dictionary.admin.manageOrders}</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">{dictionary.admin.orderId}</th>
              <th className="px-5 py-4 font-semibold">{dictionary.admin.customer}</th>
              <th className="px-5 py-4 font-semibold">{dictionary.admin.phone}</th>
              <th className="px-5 py-4 font-semibold">{dictionary.admin.city}</th>
              <th className="px-5 py-4 font-semibold">{dictionary.common.total}</th>
              <th className="px-5 py-4 font-semibold">{dictionary.common.status}</th>
              <th className="px-5 py-4 font-semibold">{dictionary.common.date}</th>
              <th className="px-5 py-4 font-semibold">{dictionary.admin.updateStatus}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="border-t border-slate-200">
                <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                  {dictionary.admin.loadingOrders}
                </td>
              </tr>
            ) : error ? (
              <tr className="border-t border-slate-200">
                <td colSpan={8} className="px-5 py-8 text-center text-red-600">{error}</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr className="border-t border-slate-200">
                <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                  {dictionary.admin.noOrdersFound}
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const city = order.address.replace(/\r\n/g, '\n').split('\n').find(line => line.startsWith('City:'))?.replace('City: ', '') || 'N/A';
                return (
                  <tr key={order.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-800">{order.id.slice(-8)}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{order.user.name}</td>
                    <td className="px-5 py-4 text-slate-600">{order.phone}</td>
                    <td className="px-5 py-4 text-slate-600">{city}</td>
                    <td className="px-5 py-4 text-slate-600">$ {order.total.toLocaleString()}</td>
                    <td className="px-5 py-4 text-slate-600">{getStatusLabel(order.status)}</td>
                    <td className="px-5 py-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(event) => handleStatusUpdate(order.id, event.target.value)}
                        className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {getStatusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
