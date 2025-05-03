"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";
import { it } from "node:test";
import Link from "next/link";
import { formatSlug } from "@/utils/formatSlog";
import { Button } from "@/components/ui/button";

const HeroCarousal = ({data}:{data:any[]}) => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 7500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
     {data? data.map((item,itemIdx)=>(
      <SwiperSlide key={itemIdx}>
      <div
      style={{
        backgroundImage: `url(${item.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      key={itemIdx}
      className="flex w-full  min-w-[100%] h-[510px] items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
       <Link href={`/shop/${formatSlug(item.slug)}`} className="flex w-full h-full p-3 items-end ">
        <div className=" bg-white/10 h-[30%] backdrop-blur flex w-full rounded-lg justify-between px-4">
          <div className="flex flex-col p-3 gap-2 justify-center">
          <h1 className="font-medium text-gray-2 text-xl sm:text-3xl">
            <span>{item.title}</span>
          </h1>
          <p className="text-sm tracking-wider text-gray-4"> {item.description}</p>
          </div>
          <div className="flex items-center">
          <Button className="text-gray-2" variant={'default'}>Shop Now</Button>
          </div>
        </div>  
        </Link>
        {/* <div>
               <Image
                           src={item?.image}
                           alt={item?.title}
                           width={300}
                           height={300}
                           className="hero-product-image"
                         />
        </div> */}
      </div>
    </SwiperSlide>

     )):'No data yet'}

    </Swiper>
  );
};

export default HeroCarousal;
