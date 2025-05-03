import { prisma } from "@/lib/ prisma";


export async function GET(req: Request) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products:true,
        shipping:true,
      }, // Adjusted to match the correct relation field name
    });
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error: any) {
    console.error('GET /api/order error:', error.message, error.stack);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch orders. Please check the server logs for more details.' }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, products, shipping } = body;

    if (!products || !products.length) {
      return new Response(JSON.stringify({ error: "Products are required" }), { status: 400 });
    }

    if (!shipping || !shipping.fullName || !shipping.address || !shipping.telephone || !shipping.city || !shipping.country || !shipping.email) {
      return new Response(JSON.stringify({ error: "Complete shipping details are required" }), { status: 400 });
    }

    const total = products.reduce((sum, product) => {
      const productTotal = (product.price - (product.discount || 0)) * product.quantity;
      return sum + Math.max(productTotal, 0); // Ensure no negative values
    }, 0);

    const newOrder = await prisma.order.create({
      data: {
        user: userId ? { connect: { id: userId } } : undefined, // Connect user if provided
        total,
        shipping: {
          create: {
            fullName: shipping.fullName,
            address: shipping.address,
            telephone: shipping.telephone,
            city: shipping.city,
            country: shipping.country,
            email: shipping.email,
          },
        },
        products: {
          create: products.map((product) => ({
            product: { connect: { id: product.id } },
            quantity: product.quantity,
          })),
        },
      },
    });

    return new Response(JSON.stringify(newOrder), { status: 201 });
  } catch (error: any) {
    console.error("POST /api/order error:", error.message, error.stack);
    return new Response(
      JSON.stringify({ error: "Failed to create order. Please check the server logs for more details." }),
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Order ID is required' }), { status: 400 });
    }

    // Fetch the order with related entities
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        products: true,
        shipping: true,
      },
    });

    if (!existingOrder) {
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
    }

    // Delete related products in the order
    if (existingOrder.products.length > 0) {
      await prisma.orderProduct.deleteMany({
        where: { orderId: id },
      });
    }

    // Delete the order first to avoid foreign key constraint issues
    await prisma.order.delete({ where: { id } });

    // Delete related shipping details
    if (existingOrder.shipping) {
      await prisma.shippingDetail.delete({
        where: { id: existingOrder.shippingId },
      });
    }

    return new Response(JSON.stringify({ message: 'Order deleted successfully' }), { status: 200 });
  } catch (error: any) {
    console.error('DELETE /api/order error:', error.message, error.stack);
    return new Response(
      JSON.stringify({ error: 'Failed to delete order. Please check the server logs for more details.' }),
      { status: 500 }
    );
  }
}
