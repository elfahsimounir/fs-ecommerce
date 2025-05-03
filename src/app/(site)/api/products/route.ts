import { prisma } from "@/lib/ prisma";
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
        brand: true,
        hashtags: true,
        reviews: true,
      },
    });

    console.log("Fetched products:", products); // Log fetched products

    return new Response(JSON.stringify(products), { status: 200,  headers: { 'Cache-Control': 'no-store' }, });
  } catch (error: any) {
    console.error("Error fetching products:", error); // Log error details
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
