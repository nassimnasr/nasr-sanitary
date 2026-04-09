"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLanguage } from "@/app/components/LanguageProvider";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { locale, dictionary } = useLanguage();

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">My Account</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Profile Information</h2>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Name</p>
              <p className="text-slate-900">{session.user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Email</p>
              <p className="text-slate-900">{session.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Role</p>
              <p className="text-slate-900 capitalize">{session.user.role}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Account Actions</h2>
          <div className="mt-4 space-y-3">
            <a
              href="/orders"
              className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View My Orders
            </a>
            <button
              onClick={handleSignOut}
              className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}