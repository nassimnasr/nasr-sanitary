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

const allowedStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export async function GET() {
  const unauthorized = await authorizeAdmin();
  if (unauthorized) return unauthorized;

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/admin/orders failed", error);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const unauthorized = await authorizeAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as {
      orderId: string;
      status: string;
    };

    if (!body.orderId || !allowedStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status or order id" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: body.orderId },
      data: { status: body.status },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("PATCH /api/admin/orders failed", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
