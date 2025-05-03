import { prisma } from "@/lib/ prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const priceMin = parseFloat(searchParams.get("price_min") || "0");
    const priceMaxParam = searchParams.get("price_max");
    const priceMax = priceMaxParam ? parseFloat(priceMaxParam) : undefined; // Ensure priceMax is a valid number or undefined
    const hashtags = searchParams.get("hashtags")?.split(",") || [];
    const brand = searchParams.get("brand");
    const sort = searchParams.get("sort"); // new, old, famous

    const products = await prisma.product.findMany({
      where: {
        ...(category && { category: { name: category } }),
        price: {
          gte: priceMin,
          ...(priceMax !== undefined && { lte: priceMax }), // Only include lte if priceMax is defined
        },
        ...(hashtags.length > 0 && {
          hashtags: { some: { name: { in: hashtags } } },
        }),
        ...(brand && { brand: { name: brand } }),
      },
      include: {
        images: true,
        category: true,
        brand: true,
        hashtags: true,
        reviews: true,
      },
      orderBy: {
        ...(sort === "new" && { createdAt: "desc" }),
        ...(sort === "old" && { createdAt: "asc" }),
        ...(sort === "famous" && { reviews: { _count: "desc" } }),
      },
    });

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error: any) {
    console.error("GET /api/filter error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { status: 500 }
    );
  }
}
