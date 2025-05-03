import { prisma } from "@/lib/ prisma";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const reviews = await prisma.review.findMany({
      where: productId ? { productId } : undefined,
      include: { product: true },
    });

    return new Response(JSON.stringify(reviews), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { content, rating, productId, email, fullName } = await req.json();

    if (!content || content.length < 5) {
      return new Response(
        JSON.stringify({ error: "Content must be at least 5 characters long" }),
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: "Rating must be between 1 and 5" }),
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400 }
      );
    }

    if (!fullName || fullName.length < 3) {
      return new Response(
        JSON.stringify({ error: "Full name must be at least 3 characters long" }),
        { status: 400 }
      );
    }

    if (!productId) {
      return new Response(
        JSON.stringify({ error: "Product ID is required" }),
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        content,
        rating,
        email,
        fullName,
        product: { connect: { id: productId } },
      },
    });

    return new Response(JSON.stringify(review), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
