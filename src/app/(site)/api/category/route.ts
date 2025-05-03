
import { prisma } from "@/lib/ prisma";
import { promises as fs } from "fs";
import path from "path";
import slugify from "slugify";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({include: { products: true } });
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;

    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    const slug = slugify(name, { lower: true });

    let imagePath: string | null = null;
    if (imageFile && imageFile instanceof File) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      imagePath = path.join(uploadsDir, imageFile.name);
      await fs.writeFile(imagePath, new Uint8Array(await imageFile.arrayBuffer()));
      imagePath = `/uploads/${imageFile.name}`;
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || "",
        image: imagePath,
      },
    });

    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error: any) {
    console.error("POST /api/category error:", error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred" }), { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;

    if (!id || !name) {
      return new Response(JSON.stringify({ error: "ID and name are required" }), { status: 400 });
    }

    const slug = slugify(name, { lower: true });

    const currentCategory = await prisma.category.findUnique({ where: { id } });
    if (!currentCategory) {
      return new Response(JSON.stringify({ error: "Category not found" }), { status: 404 });
    }

    let imagePath = currentCategory.image;
    if (imageFile && imageFile instanceof File) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      imagePath = path.join(uploadsDir, imageFile.name);
      await fs.writeFile(imagePath, new Uint8Array(await imageFile.arrayBuffer()));
      imagePath = `/uploads/${imageFile.name}`;
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || "",
        image: imagePath,
      },
    });

    return new Response(JSON.stringify(updatedCategory), { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/category error:", error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred" }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.getAll("id");

    if (!ids.length) {
      return new Response(JSON.stringify({ error: "No IDs provided for deletion" }), { status: 400 });
    }

    await prisma.category.deleteMany({
      where: { id: { in: ids } },
    });

    return new Response(JSON.stringify({ message: "Categories deleted successfully" }), { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/category error:", error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred" }), { status: 500 });
  }
}
