import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const products = await prisma.product.findMany({
      where: {
        AND: [
          category ? { category } : {},
          search
            ? {
                OR: [
                  { nameEn: { contains: search, mode: "insensitive" } },
                  { nameAr: { contains: search, mode: "insensitive" } },
                  { descEn: { contains: search, mode: "insensitive" } },
                  { descAr: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        nameEn: true,
        nameAr: true,
        price: true,
        stock: true,
        category: true,
        brand: true,
        color: true,
        image: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products failed", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
