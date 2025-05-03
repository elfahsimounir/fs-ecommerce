import { prisma } from '@/lib/ prisma';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: Request) {
  try {
    const banners = await prisma.banner.findMany();
    return new Response(JSON.stringify(banners), { status: 200 });
  } catch (error: any) {
    console.error('GET /api/banner error:', error);
    return new Response(JSON.stringify({ error: error.message || 'An unknown error occurred' }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;
    const productId = formData.get("productId") as string;

    if (!title || !imageFile || !productId) {
      return new Response(JSON.stringify({ error: "Title, image, and product are required" }), { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return new Response(JSON.stringify({ error: "Invalid product selected" }), { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const imagePath = path.join(uploadsDir, imageFile.name);
    await fs.writeFile(imagePath, new Uint8Array(await imageFile.arrayBuffer()));

    const newBanner = await prisma.banner.create({
      data: {
        title,
        description: description || "",
        image: `/uploads/${imageFile.name}`,
        slug: product.slug,
        productId,
      },
    });

    return new Response(JSON.stringify(newBanner), { status: 201 });
  } catch (error: any) {
    console.error("POST /api/banner error:", error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred" }), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;
    const productId = formData.get("productId") as string;

    if (!id || !productId) {
      return new Response(JSON.stringify({ error: "Banner ID and product are required for updating" }), { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return new Response(JSON.stringify({ error: "Invalid product selected" }), { status: 400 });
    }

    const currentBanner = await prisma.banner.findUnique({ where: { id } });
    if (!currentBanner) {
      return new Response(JSON.stringify({ error: "Banner not found" }), { status: 404 });
    }

    const data: any = { title, description, slug: product.slug, productId };

    if (imageFile && imageFile.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const imagePath = path.join(uploadsDir, imageFile.name);
      await fs.writeFile(imagePath, new Uint8Array(await imageFile.arrayBuffer()));

      data.image = `/uploads/${imageFile.name}`;
    } else {
      data.image = currentBanner.image;
    }

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data,
    });

    return new Response(JSON.stringify(updatedBanner), { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/banner error:", error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred" }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.getAll('id');

    if (!ids.length) {
      return new Response(JSON.stringify({ error: 'No IDs provided for deletion' }), { status: 400 });
    }

    await prisma.banner.deleteMany({
      where: { id: { in: ids } },
    });

    return new Response(JSON.stringify({ message: 'Banners deleted successfully' }), { status: 200 });
  } catch (error: any) {
    console.error('DELETE /api/banner error:', error);
    return new Response(JSON.stringify({ error: error.message || 'An unknown error occurred' }), { status: 500 });
  }
}
