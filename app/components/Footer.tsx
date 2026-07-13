"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/LanguageProvider";

export default function Footer() {
  const { dictionary } = useLanguage();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{dictionary.common.appName}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Professional sanitary products for homes, businesses, and projects.
            Premium quality, dependable service, and cash on delivery support.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            Quick Links
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/" className="hover:text-slate-900">
                {dictionary.nav.home}
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-slate-900">
                {dictionary.nav.products}
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-slate-900">
                {dictionary.nav.orders}
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-slate-900">
                {dictionary.nav.cart}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            {dictionary.footer.contact}
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <a href="tel:+96179197888" className="hover:text-slate-900">
                Phone: +961 79 197 888
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/9613226111"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900"
              >
                WhatsApp: +961 3 226 111
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/nasrsanitary/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900"
              >
                Instagram: @nasrsanitary
              </a>
            </li>
            <li>
              <a href="mailto:sales@nasrsanitary.com" className="hover:text-slate-900">
                Email: sales@nasrsanitary.com
              </a>
            </li>
            <li>Tripoli, Lebanon</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-4">
        <p className="text-center text-xs text-slate-500">
          {dictionary.common.appName} - {new Date().getFullYear()} -{" "}
          {dictionary.footer.rights}
        </p>
      </div>
    </footer>
  );
}
