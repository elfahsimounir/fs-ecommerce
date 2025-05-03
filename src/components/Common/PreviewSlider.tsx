"use client";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PreviewSliderModal = () => {
  const { closePreviewModal, isModalPreviewOpen, images } = usePreviewSlider();
  const swiperRef = useRef<any>(null); // Reference to the Swiper instance

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <div
      className={`preview-slider w-full h-screen z-999999 inset-0 flex justify-center items-center bg-[#000000F2] bg-opacity-70 ${
        isModalPreviewOpen ? "fixed" : "hidden"
      }`}
    >
      <button
        onClick={() => closePreviewModal()}
        aria-label="button for close modal"
        className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 text-white hover:text-meta-5 z-10"
      >
        <svg
          className="fill-current"
          width="36"
          height="36"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
            fill=""
          />
        </svg>
      </button>

      <div>
        <button
          className="absolute left-10 p-5 cursor-pointer z-10 text-white"
          onClick={handlePrev}
        >
        <ChevronLeft strokeWidth={1.5} />
        </button>

        <button
          className="absolute right-10 p-5 cursor-pointer z-10 text-white"
          onClick={handleNext}
        >
        <ChevronRight strokeWidth={1.5} />
        </button>
      </div>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)} // Attach Swiper instance to the ref
        slidesPerView={1}
        spaceBetween={20}
        modules={[Navigation]}
        navigation
      >
        {images?.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="flex justify-center items-center">
              <Image
                src={image?.url}
                alt={image?.url || `Preview image ${index + 1}`} // Add alt text
                width={450}
                height={450}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PreviewSliderModal;
