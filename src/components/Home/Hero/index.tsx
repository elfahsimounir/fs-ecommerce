"use client"
import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import Link from "next/link";
import { formatSlug } from "@/utils/formatSlog";

const Hero = ({ data }: { data: { products: any[]; banners: any[] } }) => {

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel data={data.banners} />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">

              {data ? data?.products?.slice(0, 2).map((product) => (
                <HeroProduct data={product} key={product.id} />
              ))
                :
                'No data yet'
              }

            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};


const HeroProduct = ({ data }) => {

  return (<div className="w-full flex h-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
    <div className="flex items-center justify-around gap-5">
      <div>
        <Image
          src={data?.images[0].url}
          alt={data?.name}
          width={300}
          height={300}
          className="hero-product-image"
        />
      </div>
      <div>
      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
  Offre limitée 
</p>
        <h2 className=" font-semibold text-dark text-xl">
          <Link href={`shop/${formatSlug(data.slug)}`}>{data?.name}</Link>
        </h2>

        <div className="text-lg my-2">
          <span className="flex items-center gap-3">
            <span className="font-medium 5 text-yellow-dark whitespace-nowrap">
              {Number(data?.price) - Number(data?.discount)} DH
            </span>
            <del className="font-medium  text-dark-4 line-throug whitespace-nowraph">
              {data?.price}DH
            </del>
          </span>
        </div>
      </div>
    </div>

  </div>)
}
export default Hero;
