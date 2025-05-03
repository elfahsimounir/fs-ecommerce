import React from "react";
import Image from "next/image";
import ProductItem from "@/components/Common/ProductItem";
import shopData from "@/components/Shop/shopData";
import SectionHeader from "@/components/Common/SectionHeader";
import Navigation from "@/components/Common/Navigation";
import { ShoppingBag } from "lucide-react";

const NewArrival = ({ data }: { data: any }) => {
  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="flex items-center justify-between">
        <SectionHeader
  title={"Nouveautés"}
  description={"Derniers Produits"}
  icon={<ShoppingBag size={20} strokeWidth={1.5} />}
/>
<Navigation href="/shop">
  {'Voir Tout'}
</Navigation>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
          {/* <!-- New Arrivals item --> */}
          {data ? data.slice(0, 12).map((item, key) => (
            <ProductItem item={item} key={key} />
          )) : 'No data yet'}
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
