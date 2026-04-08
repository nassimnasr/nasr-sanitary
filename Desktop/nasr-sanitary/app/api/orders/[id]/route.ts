import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Params) {
  try {
    const { id } = await context.params;

    const order = await prisma.order.findUnique({
      where: { id },
      select: { total: true, status: true, userId: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ total: order.total, status: order.status });
  } catch (error) {
    console.error("GET /api/orders/[id] failed", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
