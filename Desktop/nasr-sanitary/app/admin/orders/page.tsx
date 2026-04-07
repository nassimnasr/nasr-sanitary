"use client";

import { useEffect, useState } from "react";

type AdminOrder = {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  phone: string;
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
      const response = await fetch(`/api/admin/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
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

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Orders</h1>
        <p className="mt-2 text-sm text-slate-600">Review recent orders and update status as needed.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Customer</th>
              <th className="px-5 py-4 font-semibold">Phone</th>
              <th className="px-5 py-4 font-semibold">Total</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Date</th>
              <th className="px-5 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="border-t border-slate-200">
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                  Loading orders...
                </td>
              </tr>
            ) : error ? (
              <tr className="border-t border-slate-200">
                <td colSpan={6} className="px-5 py-8 text-center text-red-600">{error}</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr className="border-t border-slate-200">
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-800">{order.user.name}</td>
                  <td className="px-5 py-4 text-slate-600">{order.phone}</td>
                  <td className="px-5 py-4 text-slate-600">EGP {order.total.toLocaleString()}</td>
                  <td className="px-5 py-4 text-slate-600">{order.status}</td>
                  <td className="px-5 py-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={(event) => handleStatusUpdate(order.id, event.target.value)}
                      className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
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
