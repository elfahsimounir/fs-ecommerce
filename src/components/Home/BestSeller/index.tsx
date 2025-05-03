import React from "react";
import SingleItem from "./SingleItem";
import Image from "next/image";
import Link from "next/link";
import shopData from "@/components/Shop/shopData";
import { Product } from "@prisma/client";
import SectionHeader from "@/components/Common/SectionHeader";
import { Award } from "lucide-react";

const BestSeller = ({data}:{data:Product[]}) => {
  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <SectionHeader 
  title={"Meilleures Ventes"}
  description={"Les Meilleurs Produits de Ce Mois"}
  icon={
    <Award size={20} strokeWidth={1.5} />
  }
/>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {/* <!-- Best Sellers item --> */}
          {data.slice(2, 11).map((item, key) => (
            <SingleItem item={item} key={key} />
          ))}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop"
            className="inline-flex font-medium text-custom-sm py-2 px-7 sm:px-12.5 border-t border-gray-3 rounded-b-lg  text-dark ease-out duration-200 hover:bg-dark/5  "
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
