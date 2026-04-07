import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type OrderItemInput = {
  id: string;
  quantity: number;
  price: number;
};

type CreateOrderBody = {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: OrderItemInput[];
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreateOrderBody;
    const { fullName, phone, city, address, notes, items } = body;

    if (!fullName || !phone || !city || !address || !items?.length) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }

    const productIds = items.map((item) => item.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = new Map(products.map((product) => [product.id, product]));

    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.id}` },
          { status: 404 }
        );
      }
      if (item.quantity <= 0 || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product: ${product.nameEn}` },
          { status: 400 }
        );
      }
    }

    const total = items.reduce((sum, item) => {
      const product = productMap.get(item.id);
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0);

    const composedAddress =
      `Name: ${fullName}\n` +
      `City: ${city}\n` +
      `Address: ${address}\n` +
      `Notes: ${notes?.trim() || "-"}`;

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          phone,
          address: composedAddress,
          total,
          status: "pending",
        },
      });

      for (const item of items) {
        const product = productMap.get(item.id)!;

        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
          },
        });

        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return createdOrder;
    });

    return NextResponse.json({
      orderId: order.id,
      total: order.total,
      status: order.status,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("POST /api/orders failed", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
