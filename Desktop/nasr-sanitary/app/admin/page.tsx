import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  const totalOrders = await prisma.order.count();
  const pendingOrders = await prisma.order.count({
    where: { status: "pending" },
  });
  const totalProducts = await prisma.product.count();
  const revenueSum = await prisma.order.aggregate({
    _sum: { total: true },
  });
  const totalRevenue = revenueSum._sum.total ?? 0;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      highlight: "Orders",
    },
    {
      label: "Total Revenue",
      value: `$ ${totalRevenue.toLocaleString()}`,
      highlight: "Revenue",
    },
    {
      label: "Total Products",
      value: totalProducts,
      highlight: "Products",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      highlight: "Pending",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Admin Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome back, administrator</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Manage your catalog, track orders, and review your revenue from one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products"
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View Orders
          </Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">{stat.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-3 text-sm text-slate-500">{stat.highlight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
