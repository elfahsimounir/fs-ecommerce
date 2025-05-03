import Newsletter from "@/components/Common/Newsletter";
import BestSeller from "@/components/Home/BestSeller";
import Categories from "@/components/Home/Categories";
import Hero from "@/components/Home/Hero";
import NewArrival from "@/components/Home/NewArrivals";
import PromoBanner from "@/components/Home/PromoBanner";
import { Ribbon, Tag } from "lucide-react";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Multishop | Home",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  description: "Discover the latest tech products at Multishop. Shop laptops, smartphones, accessories, and more at unbeatable prices.",
  keywords: "eCommerce, tech store, laptops, smartphones, gadgets, accessories, online shopping",
  authors: [{ name: "Multicls" }],
  robots: "index, follow",
};
export const viewport = { width: "device-width", initialScale: 1 };
async function fetchDataFromApi(endpoint) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${baseUrl}/api/${endpoint}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch /api/${endpoint}:`, res.status, res.statusText);
      throw new Error(`Failed to fetch /api/${endpoint}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching data for ${endpoint}:`, error);
    return [];
  }
}

async function fetchData() {

  const allproducts = await fetchDataFromApi("product");
  const categorys = await fetchDataFromApi("category");
  const brands = await fetchDataFromApi("brand");
  const hashtags = await fetchDataFromApi("hashtag");
  const banners = await fetchDataFromApi("banner");

  const neWproducts = allproducts
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 12);


  const randomProducts = allproducts
    .sort(() => 0.5 - Math.random()) // Shuffle the array
    .slice(0, 12); // Select the first 9 products

  // Implement logic to get 2 products that have the highest reduction (price - discount) / price
  const highestReduction = allproducts
    .filter(product => product.price && product.discount) // Ensure price and discount exist
    .sort((a, b) => ((b.price - b.discount) / b.price) - ((a.price - a.discount) / a.price))
    .slice(0, 2);


  const products = {
    new: neWproducts,
    random: randomProducts,
    offers: highestReduction,
  }


  return { products, categorys, brands, hashtags, banners };
}


export default async function HomePage() {
  const { products, categorys, brands, hashtags, banners } = await fetchData();

  return (
    <>
      <Hero
        data={{
          products: products.offers,
          banners,
        }}
      />

      <Categories
        qOption={'category'}
        header={{
          title: "Catégories",
          description: "Parcourir par Catégorie",
          icon: <Ribbon strokeWidth={1.5} size={18} />
        }}
        data={categorys} />

      <NewArrival data={products.new} />
      <PromoBanner />

      <BestSeller data={products.random} />
      {/* <CounDown /> */}

      <Categories
        qOption={'brand'}
        header={{
          title: "Les Marques",
          description: "Parcourir par Marque",
          icon: <Tag strokeWidth={1.5} size={18} />
        }}
        data={brands} />
      {/* <Testimonials /> */}

      <Newsletter />
    </>
  );
}
