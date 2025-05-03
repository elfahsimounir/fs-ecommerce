import Contact from "@/components/Contact";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Multishop | Contact",
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

export const viewport = { width: "device-width", initialScale: 1 };

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;
