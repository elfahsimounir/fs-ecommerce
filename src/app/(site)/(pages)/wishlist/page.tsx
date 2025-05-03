import React from "react";
import { Wishlist } from "@/components/Wishlist";
import { Metadata } from "next";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Wishlist Page | NextCommerce Nextjs E-commerce template",
  description: "This is Wishlist Page for NextCommerce Template",
};

const WishlistPage = () => {
  return (
    <main>
      <Wishlist />
    </main>
  );
};

export default WishlistPage;
