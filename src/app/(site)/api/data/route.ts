import { prisma } from "@/lib/ prisma";


export async function GET() {
  try {
    const banners = await prisma.banner.findMany();
    const categories = await prisma.category.findMany({
      include: { products: true },
    });
    const brands = await prisma.brand.findMany({
      include: { products: true },
    });
    const hashtags = await prisma.hashtag.findMany({
      include: { products: true },
    });
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
        brand: true,
        hashtags: true,
        reviews: true,
      },
    });
    console.log('refreshing data', categories); // Ensure logging is meaningful
    return new Response(
      JSON.stringify({ banners, categories, brands, hashtags, products }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/data error:", error); // Improved error logging
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { status: 500 }
    );
  }
}
