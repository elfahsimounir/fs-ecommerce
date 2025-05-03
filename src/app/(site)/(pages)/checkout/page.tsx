import React from "react";
import Checkout from "@/components/Checkout";
import { useAppSelector } from "@/redux/store";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Multishop | Checkout",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  description: "Discover the latest tech products at Multishop. Shop laptops, smartphones, accessories, and more at unbeatable prices.",
  keywords: "eCommerce, tech store, laptops, smartphones, gadgets, accessories, online shopping",
  authors: [{ name: "Multicls" }],
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const CheckoutPage = () => {

  return (
    <main>
      <Checkout  />
    </main>
  );
};

export default CheckoutPage;