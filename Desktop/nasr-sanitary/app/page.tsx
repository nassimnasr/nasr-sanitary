"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/app/components/LanguageProvider";
import { useCartStore } from "@/lib/store";

type Product = {
  id: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  price: number;
  stock: number;
  image: string | null;
  category: string;
  createdAt: string;
};

const categories = [
  {
    titleEn: "Shower / Douche",
    titleAr: "دش / دوش",
    descEn: "Modern shower heads and hoses for a refreshing experience.",
    descAr: "رؤوس دش وخراطيم عصرية لتجربة منعشة.",
  },
  {
    titleEn: "Bath Mixer",
    titleAr: "خلاط حمام",
    descEn: "Stylish bath mixers for a comfortable bathing experience.",
    descAr: "خلاطات حمام أنيقة لتجربة استحمام مريحة.",
  },
  {
    titleEn: "Kitchen Mixer",
    titleAr: "خلاط مطبخ",
    descEn: "High-quality kitchen mixers for modern homes.",
    descAr: "خلاطات مطبخ عالية الجودة للمنازل الحديثة.",
  },
  {
    titleEn: "Basin Mixer",
    titleAr: "خلاط حوض",
    descEn: "Elegant basin mixers for bathrooms and sinks.",
    descAr: "خلاطات حوض أنيقة للحمامات والمغاسل.",
  },
  {
    titleEn: "Valve",
    titleAr: "صمام",
    descEn: "Reliable valves for water control and safety.",
    descAr: "صمامات موثوقة للتحكم في المياه والأمان.",
  },
  {
    titleEn: "Tap",
    titleAr: "حنفية",
    descEn: "Quality taps for every application.",
    descAr: "حنفيات ذات جودة لكل التطبيقات.",
  },
  {
    titleEn: "Sink",
    titleAr: "مغسلة",
    descEn: "Modern sinks for kitchens and bathrooms.",
    descAr: "مغاسل عصرية للمطابخ والحمامات.",
  },
];

export default function Home() {
  const { locale, dictionary } = useLanguage();
  const addToCart = useCartStore((state) => state.addToCart);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadFeaturedProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        const data = (await response.json()) as Product[];
        if (mounted) {
          setFeaturedProducts(data.slice(0, 3));
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : locale === "ar"
                ? "فشل تحميل المنتجات"
                : "Failed to load products"
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadFeaturedProducts();
    return () => {
      mounted = false;
    };
  }, [locale]);

  return (
    <div className="w-full">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-700">
              <SparklesIcon className="h-4 w-4" />
              {locale === "ar"
                ? "جودة موثوقة لمنتجات الأدوات الصحية"
                : "Trusted quality sanitary solutions"}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {dictionary.home.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              {dictionary.home.heroSubtitle}{" "}
              {locale === "ar"
                ? "استكشف مجموعاتنا المتنوعة للحمامات والمطابخ بأسعار مناسبة."
                : "Explore our wide collections for bathrooms and kitchens at competitive prices."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                {dictionary.home.shopNow}
              </Link>
              <Link
                href="/products"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                {dictionary.common.viewAll}
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-xl ring-1 ring-slate-900/5 backdrop-blur">
            <p className="text-sm font-semibold text-slate-700">
              {locale === "ar" ? "لماذا نصر للأدوات الصحية؟" : "Why Nasr Sanitary?"}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                {locale === "ar"
                  ? "منتجات أصلية من علامات تجارية موثوقة."
                  : "Genuine products from trusted brands."}
              </li>
              <li>
                {locale === "ar"
                  ? "دعم كامل قبل وبعد الطلب."
                  : "Full support before and after purchase."}
              </li>
              <li>
                {locale === "ar"
                  ? "الدفع عند الاستلام في جميع الطلبات."
                  : "Cash on delivery for all orders."}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {dictionary.home.featuredProducts}
          </h2>
          <Link href="/products" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
            {dictionary.common.viewAll}
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
              {dictionary.common.loading}
            </div>
          ) : error ? (
            <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
              {error}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
              {locale === "ar" ? "لا توجد منتجات متاحة" : "No products available"}
            </div>
          ) : (
            featuredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={locale === "ar" ? product.nameAr : product.nameEn}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-slate-100 text-sm text-slate-500">
                    {locale === "ar" ? "لا توجد صورة" : "No image"}
                  </div>
                )}
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                    {product.category}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {locale === "ar" ? product.nameAr : product.nameEn}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {dictionary.products.category}: {product.category}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-slate-900">
                      $ {product.price.toLocaleString()}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          productNumber: `NS-${product.id.slice(-6).toUpperCase()}`,
                          nameEn: product.nameEn,
                          nameAr: product.nameAr,
                          image: product.image,
                          price: product.price,
                          color: "Standard",
                          brandName: product.brand,
                          stock: product.stock,
                        })
                      }
                      disabled={product.stock <= 0}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {product.stock > 0
                        ? dictionary.products.addToCart
                        : dictionary.products.outOfStock}
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {dictionary.nav.categories}
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.titleEn}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {locale === "ar" ? category.titleAr : category.titleEn}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {locale === "ar" ? category.descAr : category.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white sm:p-10">
          <h2 className="text-2xl font-bold sm:text-3xl">{dictionary.footer.about}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
            {locale === "ar"
              ? "نحن في نصر للأدوات الصحية نقدم حلولاً متكاملة للحمامات والمطابخ، مع التركيز على الجودة العالية والتصميم العصري وخدمة العملاء المتميزة. نلتزم بتوفير أفضل المنتجات بأسعار عادلة وتوصيل سريع، لتجربة تسوق موثوقة ومريحة."
              : "At Nasr Sanitary, we provide complete solutions for bathrooms and kitchens with a strong focus on premium quality, modern design, and exceptional customer service. We are committed to fair pricing, fast delivery, and a reliable shopping experience."}
          </p>
        </div>
      </section>
    </div>
  );
}
