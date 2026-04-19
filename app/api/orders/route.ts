import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: {
            product: {
              select: { id: true, nameEn: true, nameAr: true, image: true },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders failed", error);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const body = (await request.json()) as CreateOrderBody;
    const { fullName, phone, city, address, notes, items } = body;

    if (!fullName || !phone || !city || !address || !items?.length) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }

    const productIds = items.map((item) => item.id);

    const order = await prisma.$transaction(
      async (tx) => {
        // Re-fetch products inside transaction with current stock
        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
        });
        const productMap = new Map(products.map((product) => [product.id, product]));

        for (const item of items) {
          const product = productMap.get(item.id);
          if (!product) {
            console.error(`Product lookup failed for ID: ${item.id}. Available products:`, products.map(p => p.id));
            throw Object.assign(new Error(`Product not found: ${item.id}`), { code: 404 });
          }
          if (item.quantity <= 0 || product.stock < item.quantity) {
            throw Object.assign(
              new Error(`Insufficient stock for product: ${product.nameEn}`),
              { code: 400 }
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

        const createdOrder = await tx.order.create({
          data: {
            userId: userId ?? "guest",
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
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );

    return NextResponse.json({
      orderId: order.id,
      total: order.total,
      status: order.status,
      message: "Order placed successfully",
    });
  } catch (error) {
    if (error instanceof Error && "code" in error) {
      const code = (error as { code: number }).code;
      return NextResponse.json({ error: error.message }, { status: code });
    }
    console.error("POST /api/orders failed", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
