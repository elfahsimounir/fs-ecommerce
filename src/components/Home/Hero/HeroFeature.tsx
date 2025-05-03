import React from "react";
import Image from "next/image";
import { icons, MessagesSquare, PackageX, Rocket, ShieldCheck } from "lucide-react";

const featureData = [
  {
    img: "/images/icons/icon-01.svg",
    icon: <Rocket strokeWidth={1.5} size={24} />,
    title: "Livraison Gratuite",
    description: "Pour toutes les commandes de 2000 DH",
  },
  {
    img: "/images/icons/icon-02.svg",
    icon: <PackageX strokeWidth={1.5} size={24} />,
    title: "Retours 1 & 1",
    description: "Annulation après 1 jour",
  },
  {
    img: "/images/icons/icon-03.svg",
    icon: <ShieldCheck strokeWidth={1.5} size={24} />,
    title: "Paiements 100% Sécurisés",
    description: "Garantie des paiements sécurisés",
  },
  {
    img: "/images/icons/icon-04.svg",
    icon: <MessagesSquare strokeWidth={1.5} size={24} />,
    title: "Support Dédié 24/7",
    description: "Partout et à tout moment",
  },
];

const HeroFeature = () => {
  return (
    <div className="max-w-[1120px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="flex flex-wrap items-center gap-7.5 xl:gap-12.5 mt-10">
        {featureData.map((item, key) => (
          <div className="flex items-center gap-4" key={key}>
            <span className="text-primary"> {item.icon}</span>
           

            <div>
              <h3 className="font-medium text-lg text-dark">{item.title}</h3>
              <p className="text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;
