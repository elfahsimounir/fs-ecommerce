import React from "react";
import { Testimonial } from "@/types/testimonial";
import Image from "next/image";
import Starts from "@/components/ui/starts";

const SingleItem = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="border border-gray-2 bg-white rounded-[10px] py-7.5 px-4 sm:px-8.5 m-1">
      <Starts count={5} />

      <p className="text-dark mb-6 mt-2">{testimonial.review}</p>

      <a href="#" className="flex items-center gap-4">
        <div className="w-12.5 h-12.5 rounded-full overflow-hidden">
          <Image
            src={testimonial.authorImg}
            alt="author"
            className="w-12.5 h-12.5 rounded-full overflow-hidden"
            width={50}
            height={50}
          />
        </div>

        <div>
          <h3 className="font-medium text-dark">{testimonial.authorName}</h3>
          <p className="text-custom-sm">{testimonial.authorRole}</p>
        </div>
      </a>
    </div>
  );
};

export default SingleItem;
