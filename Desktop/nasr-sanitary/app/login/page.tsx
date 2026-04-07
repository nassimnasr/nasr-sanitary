"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/app/components/LanguageProvider";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { dictionary, locale } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      router.replace("/");
    }
  }, [session, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setError(dictionary.auth.invalidCredentials);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{dictionary.auth.loginTitle}</h1>
        <p className="mt-1 text-sm text-slate-600">{dictionary.auth.welcomeBack}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            {dictionary.auth.email}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            {dictionary.auth.password}
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
            />
          </label>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? dictionary.common.loading : dictionary.auth.loginButton}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          {dictionary.auth.noAccount}{" "}
          <Link href="/register" className="font-semibold text-sky-700 hover:text-sky-800">
            {locale === "ar" ? "أنشئ حسابًا" : "Create one"}
          </Link>
        </p>
      </div>
    </div>
  );
}
