import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const url = process.env.NEXT_PUBLIC_API_URL ;

  try {
    const response = await fetch(`${url}/api/product`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      // cache: "force-cache", 
    });
    if (!response.ok) {
      console.error("Failed to fetch products:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data.products)) {
      console.error("Unexpected API response format. Expected an array of products:", data);
      return [];
    }

    return data.products.map((product: { slug: string }) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error("Error fetching product slugs:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const response:any = await fetch(`${url}/api/product?slug=${params.slug}`);
    if (!response.ok) {
      console.error("Failed to fetch product metadata:", response.status, response.statusText);
      return {
        title: "Product Not Found | NextCommerce",
        description: "The requested product could not be found.",
      };
    }

    const product = await response.json();

    return {
      title: `${product.name} |  Multishop`,
      description: product.description,
      keywords:`eCommerce, tech store, laptops, smartphones, gadgets, accessories, online shopping, ${response.name}, ${response.description}`,
    };
  } catch (error) {
    console.error("Error fetching product metadata:", error);
    return {
      title: "Error | NextCommerce",
      description: "An error occurred while fetching product metadata.",
    };
  }
}

interface Product {
  name: string;
  description: string;
  images: { url: string; name: string }[];
  price: number;
  discountedPrice: number;
  title: string;
  reviews: { id: string; content: string; rating: number; fullName: string }[]; // Add reviews type
  // Add other product properties as needed
}

const ShopDetailsPage = async ({ params }: { params: { slug: string } }) => {
  const url = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${url}/api/data`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
    // cache: "force-cache" // Removed conflicting cache option
  });

  try {
    const response = await fetch(`${url}/api/product?slug=${params.slug}`, {
      method: "GET",
      cache: "force-cache" // Use cached data
    });

    if (!response.ok) {
      console.error("Failed to fetch product details:", response.status, response.statusText);
      return <main className="mt-[20rem]">Product not found</main>;
    }

    const product: Product = await response.json();

    // Ensure `images` and `reviews` are arrays
    if (!Array.isArray(product.images)) {
      product.images = []; // Default to an empty array
    }
    if (!Array.isArray(product.reviews)) {
      product.reviews = []; // Default to an empty array
    }

    return (
      <main>
        <ShopDetails item={product} />
      </main>
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
    return <main className="mt-[20rem]">Error loading product details</main>;
  }
};

export default ShopDetailsPage;