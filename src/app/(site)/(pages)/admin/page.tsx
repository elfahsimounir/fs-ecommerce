import Dashboard from "@/components/dashboard";
import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextCommerce | Nextjs E-commerce template",
  description: "This is Home for NextCommerce Template",
  // other metadata
};

export default function adminPage() {
  return (
    <>
      <main className="h-[500px] text-black bg-green-500">
        <Dashboard />

        </main>
    </>
  );
}
