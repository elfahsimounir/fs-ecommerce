import { promises as fs } from 'fs';
import path from 'path';
import formidable, { Fields, Files } from 'formidable';
import { prisma } from '@/lib/ prisma';
import { Readable } from "stream";

function generateUniqueSlug(baseSlug: string, existingSlugs: Set<string>): string {
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (existingSlugs.has(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
const deFormatSlug = (slug: string): string => {
  return decodeURIComponent(slug); // Decode the slug back to its original format
};
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let slug = searchParams.get("slug");

    if (slug) {
      slug = deFormatSlug(slug);
      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          reviews: true, // Ensure reviews are included
          hashtags: true,
          images: true,
          category: true,
          brand: true,
        },
      });

      // console.log("Fetched product from database:", product); // Debugging

      if (!product) {
        return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
      }

      // Calculate average rating
      const averageRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
          : 0;

      return new Response(JSON.stringify({ ...product, rating: averageRating }), { status: 200 });
    }

    // Fetch all products if no slug is provided
    const products = await prisma.product.findMany({
      include: {
        reviews: true,
        hashtags: true,
        images: true,
        category: true,
        brand: true,
      },
    });

    if (!products || products.length === 0) {
      return new Response(JSON.stringify({ error: "No products found" }), { status: 404 });
    }

    const productsWithRating = products.map((product) => {
      const averageRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
          : 0;

      return {
        ...product,
        rating: averageRating,
      };
    });

    return new Response(JSON.stringify(productsWithRating), { status: 200 });
  } catch (error: any) {
    console.error("GET /api/product error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const properties = formData.get("properties")
      ? JSON.parse(formData.get("properties") as string)
      : [];
    const price = parseFloat(formData.get("price") as string);
    const discount = parseFloat(formData.get("discount") as string) || 0;
    const isNew = formData.get("isNew") === "true";
    const isPublished = formData.get("isPublished") === "true";
    const stock = parseInt(formData.get("stock") as string);
    const categoryId = formData.get("categoryId") as string;
    const brandId = formData.get("brandId") as string || null;
    const hashtags = formData.get("hashtags")
      ? JSON.parse(formData.get("hashtags") as string) // Parse hashtags from JSON string
      : [];
    const imageFiles = formData.getAll("images") as File[];

    if (!name || !description || isNaN(price) || isNaN(stock) || !categoryId || !imageFiles.length) {
      return new Response(JSON.stringify({ error: "Missing or invalid required fields" }), { status: 400 });
    }

    const existingProduct = await prisma.product.findFirst({
      where: { name },
    });

    if (existingProduct) {
      return new Response(
        JSON.stringify({ error: `A product with the name "${name}" already exists.` }),
        { status: 400 }
      );
    }

    const baseSlug = name.toLowerCase().replace(/\s+/g, "-");
    const existingProducts = await prisma.product.findMany({ select: { slug: true } });
    const existingSlugs = new Set(existingProducts.map((product) => product.slug));
    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const imagePaths: string[] = [];
    for (const imageFile of imageFiles) {
      const imagePath = path.join(uploadsDir, imageFile.name);
      await fs.writeFile(imagePath, new Uint8Array(await imageFile.arrayBuffer()));
      imagePaths.push(`/uploads/${imageFile.name}`);
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: uniqueSlug,
        description,
        properties,
        price,
        discount,
        isNew,
        isPublished,
        stock,
        image: imagePaths[0],
        images: {
          create: imagePaths.map((url) => ({ url })),
        },
        category: { connect: { id: categoryId } },
        brand: brandId ? { connect: { id: brandId } } : undefined,
        hashtags: {
          connectOrCreate: hashtags.map((tag) => ({
            where: { name: tag.trim() },
            create: { name: tag.trim() },
          })),
        },
      },
    });

    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error: any) {
    console.error("POST /api/product error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const readable = Readable.from(req.body as any);
    const headers = {
      "content-type": req.headers.get("content-type") || "",
      "content-length": req.headers.get("content-length") || "0",
    };

    const mockReq = Object.assign(readable, { headers });

    const form = formidable({ multiples: true, uploadDir: "./public/uploads", keepExtensions: true });
    const { fields, files }: { fields: Fields; files: Files } = await new Promise((resolve, reject) => {
      form.parse(mockReq, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const id = Array.isArray(fields.id) ? fields.id[0] : fields.id; // Ensure `id` is a string
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name; // Ensure `name` is a string
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description; // Ensure `description` is a string
    const categoryId = Array.isArray(fields.categoryId) ? fields.categoryId[0] : fields.categoryId; // Ensure `categoryId` is a string
    const brandId = Array.isArray(fields.brandId) ? fields.brandId[0] : fields.brandId; // Ensure `brandId` is a string
    const properties = fields.properties ? JSON.parse(fields.properties as string) : [];
    const price = parseFloat(fields.price as string);
    const stock = parseInt(fields.stock as string);
    const hashtags = fields.hashtags ? JSON.parse(fields.hashtags as string) : [];
    const deletedImages = fields.deletedImages ? JSON.parse(fields.deletedImages as string) : [];
    const mainImage = fields.mainImage || null;
      // Parse booleans correctly
      const isPublished =fields.isPublished&& fields.isPublished[0] === "true";
      const isNew =fields.isNew&& fields.isNew[0] === "true";
    const rating = fields.rating ? parseInt(fields.rating as string, 10) : 0; // Ensure number
    
    if (!id || !name || !description || isNaN(price) || isNaN(stock) || !categoryId || isNaN(rating)) {
      return new Response(JSON.stringify({ error: "Missing or invalid required fields" }), { status: 400 });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true, hashtags: true },
    });

    if (!existingProduct) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    const imagePaths: string[] = [];
    if (files.images) {
      const uploadedFiles = Array.isArray(files.images) ? files.images : [files.images];
      for (const file of uploadedFiles) {
        const newPath = path.join("./public/uploads", file.newFilename);
        await fs.rename(file.filepath, newPath);
        imagePaths.push(`/uploads/${file.newFilename}`);
      }
    }

    const image =
      mainImage && typeof mainImage === "string"
        ? mainImage
        : existingProduct.images.length > 0
        ? existingProduct.images[0].url
        : imagePaths.length > 0
        ? imagePaths[0]
        : null;

    await prisma.product.update({
      where: { id },
      data: { hashtags: { set: [] } },
    });

    const hashtagsData =
      hashtags.length > 0
        ? {
            connectOrCreate: hashtags.map((tag) => ({
              where: { name: tag.trim() },
              create: { name: tag.trim() },
            })),
          }
        : { set: [] };
  console.log('boolean string', fields.isPublished, fields.isNew);
  console.log("booleans json", isPublished, isNew);
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        properties: properties.length > 0 ? properties : null,
        price,
        stock,
        hashtags: hashtagsData,
        image,
        images: {
          deleteMany: { url: { in: deletedImages } },
          create: imagePaths.map((url) => ({ url })),
        },
        category: { connect: { id: categoryId } },
        brand: brandId ? { connect: { id: brandId } } : undefined,
        isPublished,
        isNew,
        rating,
      },
    });

    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/product error:", error);
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

    const validIds = ids.filter((id) => typeof id === 'string' && id.trim() !== '');

    if (!validIds.length) {
      return new Response(JSON.stringify({ error: 'Invalid IDs provided for deletion' }), { status: 400 });
    }

    const existingProducts = await prisma.product.findMany({
      where: { id: { in: validIds } },
      include: {
        images: true,
        reviews: true,
        hashtags: true,
      },
    });

    if (existingProducts.length !== validIds.length) {
      return new Response(
        JSON.stringify({ error: 'Some products do not exist or have already been deleted' }),
        { status: 404 }
      );
    }

    for (const product of existingProducts) {
      // Delete related images
      if (product.images.length > 0) {
        await prisma.productImage.deleteMany({
          where: { productId: product.id },
        });
      }

      // Delete related reviews
      if (product.reviews.length > 0) {
        await prisma.review.deleteMany({
          where: { productId: product.id },
        });
      }

      // Disconnect related hashtags
      if (product.hashtags.length > 0) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            hashtags: {
              set: [], // Disconnect all hashtags
            },
          },
        });
      }
    }

    // Delete the products
    await prisma.product.deleteMany({
      where: { id: { in: validIds } },
    });

    return new Response(JSON.stringify({ message: 'Products deleted successfully' }), { status: 200 });
  } catch (error: any) {
    console.error('DELETE /api/product error:', error.message, error.stack);
    return new Response(
      JSON.stringify({ error: 'Failed to delete products. Please check the server logs for more details.' }),
      { status: 500 }
    );
  }
}
