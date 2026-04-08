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
    const body = await request.json();
    const { nameEn, nameAr, descEn, descAr, price, stock, category, image } = body;

    const requiredFields = [nameEn, nameAr, descEn, descAr, category];
    if (requiredFields.some(field => !field?.trim()) || typeof price !== "number" || typeof stock !== "number") {
      return NextResponse.json({ error: "Invalid product payload" }, { status: 400 });
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
        image: image?.trim() || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/products failed", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
