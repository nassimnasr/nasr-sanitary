import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Admin Dashboard | Nasr Sanitary",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-full">
        <aside className="w-full max-w-xs border-r border-slate-200 bg-white p-6">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
            <p className="mt-2 text-sm text-slate-600">Manage products, orders and revenue.</p>
          </div>

          <div className="space-y-2">
            <Link
              href="/admin"
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Orders
            </Link>
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Signed in as</p>
            <p className="mt-2 font-semibold text-slate-900">{session.user.name}</p>
            <p className="text-xs text-slate-500">{session.user.email}</p>
          </div>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
