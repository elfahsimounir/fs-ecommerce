'use client';
import { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { ShoppingBag, Package, Tag, ClipboardList } from "lucide-react";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    activeProducts: 0,
    newProducts: 0,
    ordersCount: 0,
    inActiveProducts: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/product"),
        fetch("/api/order"),
      ]);

      const products = await productsRes.json();
      const orders = await ordersRes.json();

      const activeProducts = products.filter((p: any) => p.isPublished).length;
      const inActiveProducts = products.filter((p: any) => !p.isPublished).length;
      const newProducts = products.filter((p: any) => p.isNew).length;
      const ordersCount = orders.length;

      setDashboardData({ activeProducts, newProducts, ordersCount, inActiveProducts });
    };

    fetchData();
  }, []);

  const breadcrumb = {
    title: "Dashboard",
    pages: ["Admin", "Dashboard"],
  };

  return (
    <>
      <main className="container mx-auto p-6 bg-gray-100 min-h-screen">
        <Breadcrumb title={breadcrumb.title} pages={breadcrumb.pages} />

        <div className=" p-3">
          <h2 className="mb-6">Admin Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: "/admin/product", label: "Manage Products" },
              { href: "/admin/order", label: "Manage Orders" },
              { href: "/admin/banner", label: "Manage Banners" },
              { href: "/admin/category", label: "Manage Categories" },
              { href: "/admin/brand", label: "Manage Brands" },
              { href: "/admin/hashtag", label: "Manage Hashtags" },
              { href: "/admin/user", label: "Manage Users" },
            ].map((item) => (
              <Link href={item.href} key={item.href}>
                <div className="p-4 bg-gray-100 hover:bg-gray-200 rounded border border-gray-3 text-center hover:bg-primary/5 duration-300 ease-in-out hover:text-primary ">
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-3 border-t border-gray-3">
          <div className="p-6 justify-center bg-white  rounded flex items-center gap-4">
            <ShoppingBag size={40} strokeWidth={1} className="text-primary" />
            <div>
              <h2 className="text-lg">Active Products</h2>
              <p className="text-xl text-dark-4">{dashboardData.activeProducts}</p>
            </div>
          </div>
          <div className="p-6 justify-center bg-white  rounded flex items-center gap-4">
            <Package size={40} strokeWidth={1} className="text-primary" />
            <div>
              <h2 className="text-lg">Inactive Products</h2>
              <p className="text-xl text-dark-4">{dashboardData.inActiveProducts}</p>
            </div>
          </div>
          <div className="p-6 justify-center bg-white  rounded flex items-center gap-4">
            <Tag size={40} strokeWidth={1} className="text-primary" />
            <div>
              <h2 className="text-lg">New Products</h2>
              <p className="text-xl text-dark-4">{dashboardData.newProducts}</p>
            </div>
          </div>
          <div className="p-6 justify-center bg-white  rounded flex items-center gap-4">
            <ClipboardList size={40} strokeWidth={1} className="text-primary" />
            <div>
              <h2 className="text-lg">Orders</h2>
              <p className="text-xl text-dark-4">{dashboardData.ordersCount}</p>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
