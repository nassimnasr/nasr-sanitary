import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    nameEn: "Stainless Steel Shower Hose",
    nameAr: "خرطوم دش من الفولاذ المقاوم للصدأ",
    descEn: "Durable flexible shower hose for modern bathroom fittings.",
    descAr: "خرطوم دش مرن وقوي يناسب تركيبات الحمام الحديثة.",
    price: 24.99,
    stock: 65,
    category: "shower",
    brand: "Grohe",
    color: "Chrome",
    image: "https://example.com/images/shower-hose.jpg",
  },
  {
    nameEn: "Brass Ball Valve",
    nameAr: "صمام كروي من النحاس",
    descEn: "High-quality brass ball valve for reliable water control.",
    descAr: "صمام كروي نحاسي عالي الجودة للتحكم الموثوق في الماء.",
    price: 18.75,
    stock: 48,
    category: "valve",
    brand: "Hansgrohe",
    color: "Chrome",
    image: "https://example.com/images/brass-ball-valve.jpg",
  },
  {
    nameEn: "Chrome Mixer Tap",
    nameAr: "حنفية خلط كروم",
    descEn: "Elegant chrome mixer tap for bathroom sinks and basins.",
    descAr: "حنفية خلط أنيقة من الكروم لأحواض الحمام.",
    price: 39.5,
    stock: 34,
    category: "bath_mixer",
    brand: "Grohe",
    color: "Chrome",
    image: "https://example.com/images/chrome-mixer-tap.jpg",
  },
  {
    nameEn: "Stainless Steel Kitchen Sink",
    nameAr: "مطبخ من الفولاذ المقاوم للصدأ",
    descEn: "Modern kitchen sink with deep basin design.",
    descAr: "مطبخ حديث بتصميم حوض عميق.",
    price: 89.99,
    stock: 25,
    category: "sink",
    brand: "Franke",
    color: "Stainless Steel",
    image: "https://example.com/images/kitchen-sink.jpg",
  },
  {
    nameEn: "Stainless Steel Elbow Fitting",
    nameAr: "موصل زاوية من الفولاذ المقاوم للصدأ",
    descEn: "304 stainless elbow fitting for resistant plumbing joints.",
    descAr: "موصل زاوية من الفولاذ المقاوم للصدأ 304 لمفاصل السباكة المقاومة.",
    price: 9.99,
    stock: 89,
    category: "tap",
    brand: "Generic",
    color: "Stainless Steel",
    image: "https://example.com/images/steel-elbow-fitting.jpg",
  },
  {
    nameEn: "Adjustable Shower Head",
    nameAr: "رأس دش قابل للتعديل",
    descEn: "Easy-install shower head with multiple spray modes.",
    descAr: "رأس دش سهل التركيب مع أوضاع رذاذ متعددة.",
    price: 29.95,
    stock: 42,
    category: "shower",
    brand: "Hansgrohe",
    color: "Chrome",
    image: "https://example.com/images/adjustable-shower-head.jpg",
  },
  {
    nameEn: "Single Handle Kitchen Mixer",
    nameAr: "حنفية مطبخ ذراع واحد",
    descEn: "Modern single lever kitchen mixer with smooth design.",
    descAr: "حنفية مطبخ عصرية ذراع واحد بتصميم سلس.",
    price: 54.95,
    stock: 38,
    category: "kitchen_mixer",
    brand: "Grohe",
    color: "Stainless Steel",
    image: "https://example.com/images/kitchen-mixer.jpg",
  },
  {
    nameEn: "Stainless Basin Mixer",
    nameAr: "حنفية حوض من الفولاذ المقاوم للصدأ",
    descEn: "Minimalist basin mixer with a smooth single lever design.",
    descAr: "حنفية حوض بتصميم ذراع واحد سلس وأنيق.",
    price: 45.2,
    stock: 27,
    category: "basin_mixer",
    brand: "Hansgrohe",
    color: "Chrome",
    image: "https://example.com/images/stainless-basin-mixer.jpg",
  },
  {
    nameEn: "Pressure Relief Valve",
    nameAr: "صمام تخفيف الضغط",
    descEn: "Safety valve to protect plumbing systems from excess pressure.",
    descAr: "صمام أمان لحماية أنظمة السباكة من الضغط الزائد.",
    price: 21.5,
    stock: 37,
    category: "valve",
    brand: "Watts",
    color: "Brass",
    image: "https://example.com/images/pressure-relief-valve.jpg",
  },
  {
    nameEn: "Wall Mounted Basin Tap",
    nameAr: "حنفية حوض مثبتة على الحائط",
    descEn: "Elegant wall-mounted basin tap for modern bathrooms.",
    descAr: "حنفية حوض أنيقة مثبتة على الحائط للحمامات الحديثة.",
    price: 35.99,
    stock: 52,
    category: "tap",
    brand: "Grohe",
    color: "Chrome",
    image: "https://example.com/images/wall-basin-tap.jpg",
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@nasrsanitary.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  if (!process.env.ADMIN_PASSWORD) {
    console.warn("WARNING: Using default admin password. Set ADMIN_PASSWORD env var for production.");
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Admin User",
      role: "admin",
      password: hashedPassword,
    },
    create: {
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    },
  });

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
