import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function authorizeAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  const unauthorized = await authorizeAdmin();
  if (unauthorized) return unauthorized;

  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/admin/products failed", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await authorizeAdmin();
  if (unauthorized) return unauthorized;

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { nameEn, nameAr, descEn, descAr, price, stock, category, brand, color, image } = body;

    // Validate required fields
    if (!nameEn?.trim() || !nameAr?.trim() || !descEn?.trim() || !descAr?.trim() || !category?.trim()) {
      return NextResponse.json({ error: "Missing required fields: nameEn, nameAr, descEn, descAr, category" }, { status: 400 });
    }

    // Validate numeric fields
    if (typeof price !== "number" || isNaN(price) || price < 0) {
      return NextResponse.json({ error: "Invalid price value" }, { status: 400 });
    }

    if (typeof stock !== "number" || isNaN(stock) || stock < 0) {
      return NextResponse.json({ error: "Invalid stock value" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        nameEn: nameEn.trim(),
        nameAr: nameAr.trim(),
        descEn: descEn.trim(),
        descAr: descAr.trim(),
        price,
        stock,
        category: category.trim(),
        brand: brand?.trim() || "Generic",
        color: color?.trim() || "Standard",
        image: image || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
