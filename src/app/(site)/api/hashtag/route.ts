
import { prisma } from "@/lib/ prisma";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const hashtags = await prisma.hashtag.findMany({include: { products: true } });
    return new Response(JSON.stringify(hashtags), { status: 200 });
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

    let imagePath: string | null = null;
    if (imageFile && imageFile instanceof File) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const imageFilePath = path.join(uploadsDir, imageFile.name);
      await fs.writeFile(imageFilePath, new Uint8Array(await imageFile.arrayBuffer()));
      imagePath = `/uploads/${imageFile.name}`;
    }

    const newHashtag = await prisma.hashtag.create({
      data: {
        name,
        description: description || "",
        image: imagePath,
      },
    });

    return new Response(JSON.stringify(newHashtag), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
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

    const currentHashtag = await prisma.hashtag.findUnique({ where: { id } });
    if (!currentHashtag) {
      return new Response(JSON.stringify({ error: "Hashtag not found" }), { status: 404 });
    }

    let imagePath = currentHashtag.image;
    if (imageFile && imageFile instanceof File) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const imageFilePath = path.join(uploadsDir, imageFile.name);
      await fs.writeFile(imageFilePath, new Uint8Array(await imageFile.arrayBuffer()));
      imagePath = `/uploads/${imageFile.name}`;
    }

    const updatedHashtag = await prisma.hashtag.update({
      where: { id },
      data: {
        name,
        description: description || "",
        image: imagePath,
      },
    });

    return new Response(JSON.stringify(updatedHashtag), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.getAll("id");

    if (!ids.length) {
      return new Response(JSON.stringify({ error: "No IDs provided for deletion" }), { status: 400 });
    }

    await prisma.hashtag.deleteMany({
      where: { id: { in: ids } },
    });

    return new Response(JSON.stringify({ message: "Hashtags deleted successfully" }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
