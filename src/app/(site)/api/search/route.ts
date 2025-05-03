import { prisma } from "@/lib/ prisma";
import { NextResponse } from "next/server";
// Ensure you have a Prisma client instance

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query || query.trim() === "") {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: query.toLowerCase(), // Convert query to lowercase for case-insensitive search
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        discount: true,
        image: true,
        images: true,
        slug: true,
        stock: true,
        reviews: true,
      },
      
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
