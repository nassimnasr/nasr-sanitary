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
    category: "showers",
    image: "https://example.com/images/shower-hose.jpg",
  },
  {
    nameEn: "Brass Ball Valve",
    nameAr: "صمام كروي من النحاس",
    descEn: "High-quality brass ball valve for reliable water control.",
    descAr: "صمام كروي نحاسي عالي الجودة للتحكم الموثوق في الماء.",
    price: 18.75,
    stock: 48,
    category: "valves",
    image: "https://example.com/images/brass-ball-valve.jpg",
  },
  {
    nameEn: "Chrome Mixer Tap",
    nameAr: "حنفية خلط كروم",
    descEn: "Elegant chrome mixer tap for bathroom sinks and basins.",
    descAr: "حنفية خلط أنيقة من الكروم لأحواض الحمام.",
    price: 39.5,
    stock: 34,
    category: "taps",
    image: "https://example.com/images/chrome-mixer-tap.jpg",
  },
  {
    nameEn: "PVC Water Supply Pipe",
    nameAr: "أنبوب إمداد مائي من البولي فينيل كلورايد",
    descEn: "Strong PVC pipe suitable for fresh water pipelines.",
    descAr: "أنبوب PVC قوي مناسب لشبكات المياه النظيفة.",
    price: 12.0,
    stock: 120,
    category: "pipes",
    image: "https://example.com/images/pvc-pipe.jpg",
  },
  {
    nameEn: "Stainless Steel Elbow Fitting",
    nameAr: "موصل زاوية من الفولاذ المقاوم للصدأ",
    descEn: "304 stainless elbow fitting for resistant plumbing joints.",
    descAr: "موصل زاوية من الفولاذ المقاوم للصدأ 304 لمفاصل السباكة المقاومة.",
    price: 9.99,
    stock: 89,
    category: "fittings",
    image: "https://example.com/images/steel-elbow-fitting.jpg",
  },
  {
    nameEn: "Adjustable Shower Head",
    nameAr: "رأس دش قابل للتعديل",
    descEn: "Easy-install shower head with multiple spray modes.",
    descAr: "رأس دش سهل التركيب مع أوضاع رذاذ متعددة.",
    price: 29.95,
    stock: 42,
    category: "showers",
    image: "https://example.com/images/adjustable-shower-head.jpg",
  },
  {
    nameEn: "Brass Compression Fitting",
    nameAr: "موصل ضغط من النحاس",
    descEn: "Secure compression fitting for copper and PEX connections.",
    descAr: "موصل ضغط آمن لتوصيلات النحاس والبكس.",
    price: 14.25,
    stock: 58,
    category: "fittings",
    image: "https://example.com/images/brass-compression-fitting.jpg",
  },
  {
    nameEn: "Stainless Basin Tap",
    nameAr: "حنفية حوض من الفولاذ المقاوم للصدأ",
    descEn: "Minimalist basin tap with a smooth single lever design.",
    descAr: "حنفية حوض بتصميم ذراع واحد سلس وأنيق.",
    price: 32.2,
    stock: 27,
    category: "taps",
    image: "https://example.com/images/stainless-basin-tap.jpg",
  },
  {
    nameEn: "Pressure Relief Valve",
    nameAr: "صمام تخفيف الضغط",
    descEn: "Safety valve to protect plumbing systems from excess pressure.",
    descAr: "صمام أمان لحماية أنظمة السباكة من الضغط الزائد.",
    price: 21.5,
    stock: 37,
    category: "valves",
    image: "https://example.com/images/pressure-relief-valve.jpg",
  },
  {
    nameEn: "Galvanized Metal Pipe",
    nameAr: "أنبوب معدني مجلفن",
    descEn: "Corrosion-resistant metal pipe for long-lasting installations.",
    descAr: "أنبوب معدني مقاوم للتآكل لتركيبات طويلة الأمد.",
    price: 16.8,
    stock: 72,
    category: "pipes",
    image: "https://example.com/images/galvanized-pipe.jpg",
  },
];

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@nasrsanitary.com" },
    update: {
      name: "Admin User",
      role: "admin",
      password: adminPassword,
    },
    create: {
      name: "Admin User",
      email: "admin@nasrsanitary.com",
      password: adminPassword,
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
