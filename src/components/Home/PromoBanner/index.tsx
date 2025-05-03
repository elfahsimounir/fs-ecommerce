"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatSlug } from "@/utils/formatSlog";

interface Offer {
  images: { url: string }[];
  name: string;
  price: number;
  discount: number;
  reductionPercentage: string;
  description: string;
  slug: string;
}

const PromoBanner = () => {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/api/product");
        const products = await response.json();
        const sortedProducts = products
          .map((product: any) => ({
            ...product,
            reductionPercentage: Math.round((product.discount / product.price) * 100) + "%",
          }))
          .sort((a: Offer, b: Offer) => parseInt(b.reductionPercentage) - parseInt(a.reductionPercentage))
          .slice(0, 3); // Get top 3 offers
        setOffers(sortedProducts);
      } catch (error) {
        console.error("Échec de la récupération des offres :", error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Bannière promo grande */}
        {offers[0] && (
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
            <div className="max-w-[550px] w-full">
              <span className="block font-medium text-xl text-dark mb-3">
                {offers[0].name}
              </span>

              <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
                JUSQU&apos;À {offers[0].reductionPercentage} DE RÉDUCTION
              </h2>

              <p>{offers[0].description}</p>

              <a
                href={`/shop/${formatSlug(offers[0].slug)}`}
                className="inline-flex font-medium text-custom-sm text-white bg-primary py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
              >
                Acheter Maintenant
              </a>
            </div>

            <Image
              src={offers[0].images[0]?.url || "/images/default-product.png"}
              alt={offers[0].name}
              className="absolute bottom-0 right-4 lg:right-26 -z-1"
              width={274}
              height={350}
            />
          </div>
        )}

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {offers.slice(1).map((offer, index) => (
            <div
              key={index}
              className={`relative z-1 overflow-hidden rounded-lg ${
                index === 0 ? "bg-[#DBF4F3]" : "bg-[#FFECE1]"
              } py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10`}
            >
              <Image
                src={offer.images[0]?.url || "/images/default-product.png"}
                alt={offer.name}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  index === 0 ? "left-3 sm:left-10" : "right-3 sm:right-8.5"
                } -z-1`}
                width={index === 0 ? 241 : 200}
                height={index === 0 ? 241 : 200}
              />

              <div className={index === 0 ? "text-right" : ""}>
                <span className="block text-lg text-dark mb-1.5">
                  {offer.name}
                </span>

                <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                  {index === 0 ? "Entraînez-vous à la maison" : `Jusqu&apos;à ${offer.reductionPercentage} de réduction`}
                </h2>

                {index === 0 ? (
                  <p className="font-semibold text-custom-1 text-teal">
                    {offer.reductionPercentage} de réduction
                  </p>
                ) : (
                  <p className="max-w-[285px] text-custom-sm">{offer.description}</p>
                )}

                <a
                  href={`/shop/${formatSlug(offer.slug)}`}
                  className={`inline-flex font-medium text-custom-sm text-white ${
                    index === 0 ? "bg-teal" : "bg-orange"
                  } py-2.5 px-8.5 rounded-md ease-out duration-200 hover:$
                    {index === 0 ? "bg-teal-dark" : "bg-orange-dark"} mt-7.5`}
                >
                  {index === 0 ? "Saisir Maintenant" : "Acheter Maintenant"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
