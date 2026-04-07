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
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    }

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
    const body = (await request.json()) as {
      nameEn: string;
      nameAr: string;
      descEn: string;
      descAr: string;
      price: number;
      stock: number;
      category: string;
      image?: string | null;
    };

    const requiredFields = [
      body.nameEn,
      body.nameAr,
      body.descEn,
      body.descAr,
      body.category,
    ];

    if (requiredFields.some((field) => !field?.trim()) || typeof body.price !== "number" || typeof body.stock !== "number") {
      return NextResponse.json({ error: "Invalid product payload" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        nameEn: body.nameEn.trim(),
        nameAr: body.nameAr.trim(),
        descEn: body.descEn.trim(),
        descAr: body.descAr.trim(),
        price: body.price,
        stock: body.stock,
        category: body.category.trim(),
        image: body.image?.trim() || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/products failed", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await authorizeAdmin();
  if (unauthorized) return unauthorized;

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const body = (await request.json()) as {
      nameEn: string;
      nameAr: string;
      descEn: string;
      descAr: string;
      price: number;
      stock: number;
      category: string;
      image?: string | null;
    };

    const product = await prisma.product.update({
      where: { id },
      data: {
        nameEn: body.nameEn.trim(),
        nameAr: body.nameAr.trim(),
        descEn: body.descEn.trim(),
        descAr: body.descAr.trim(),
        price: body.price,
        stock: body.stock,
        category: body.category.trim(),
        image: body.image?.trim() || null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PUT /api/admin/products failed", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await authorizeAdmin();
  if (unauthorized) return unauthorized;

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/products failed", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
