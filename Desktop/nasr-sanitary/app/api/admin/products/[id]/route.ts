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

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Params) {
  const unauthorized = await authorizeAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/admin/products/[id] failed", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: Params) {
  const unauthorized = await authorizeAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const { nameEn, nameAr, descEn, descAr, price, stock, category, brand, color, image } = body;

    const requiredFields = [nameEn, nameAr, descEn, descAr, category];
    if (
      requiredFields.some((field) => !field?.trim()) ||
      typeof price !== "number" ||
      typeof stock !== "number"
    ) {
      return NextResponse.json({ error: "Invalid product payload" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
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
        image: image?.trim() || null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PUT /api/admin/products/[id] failed", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: Params) {
  const unauthorized = await authorizeAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] failed", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
