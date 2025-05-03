import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useSession } from "next-auth/react";

const Footer = () => {
  const year = new Date().getFullYear();
  const { data: session, status } = useSession();
  const footerSections = [
    {
      title: "Help & Support",
      links: [
        {
          type: "text",
          content: "Avenue Hassan II ; Rue Oued Lokous, Rés.La Colombe - Tétouan - Maroc.",
          icon: (
            <MapPin size={20} strokeWidth={1.5} className="text-primary"/>
          ),
        },
        {
          type: "link",
          content: "+212 667-659741",
          href: "#",
          icon: (
            <Phone size={20} strokeWidth={1.5} className="text-primary"/>
          ),
        },
        {
          type: "link",
          content: "contact@multicls.ma",
          href: "#",
          icon: (
            <Mail size={20} strokeWidth={1.5} className="text-primary"/>
          ),
        },
      ],
    },
    {
      title: "Account",
      links: [
        { type: "link", content: "My Account", href: "#" },
        { type: "link", content: "Login / Register", href: "#" },
        { type: "link", content: "Cart", href: "/card" },
        { type: "link", content: "Wishlist", href: "/wishlist" },
        { type: "link", content: "Shop", href: "/shop" },
      ],
    },
    {
      title: "Quick Link",
      links: [
        { type: "link", content: "Privacy Policy", href: "#" },
        { type: "link", content: "Refund Policy", href: "#" },
        { type: "link", content: "Terms of Use", href: "#" },
        { type: "link", content: "FAQ’s", href: "#" },
        { type: "link", content: "Contact", href: "/contact" },
      ],
    },
  ];

  return (
 <>
    {session?.user?null:   <footer className="overflow-hidden">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-19 xl:justify-around pt-10 xl:pt-15 pb-7 xl:pb-7">
          {footerSections.map((section, index) => (
            <div key={index} className="w-full sm:w-auto">
              <h2 className="mb-4 text-custom-1 font-medium text-dark">
                {section.title}
              </h2>
              <ul className="flex flex-col gap-3 text-sm">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.type === "text" ? (
                      <div className="flex gap-4.5">
                        <span className="flex-shrink-0">{link.icon}</span>
                        {link.content}
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className="flex items-center gap-4.5 ease-out duration-200"
                      >
                        {link.icon && (
                          <span className="flex-shrink-0 text-primary">{link.icon}</span>
                        )}
                        {link.content}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="py-7 text-xs border-t border-gray-2">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-5 flex-wrap items-center justify-between">
            <p className="text-dark ">
              &copy; {year}. All rights reserved by <span className="font-medium">Muticls.</span> 
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <p className="font-medium">We Accept:</p>

              <div className="flex flex-wrap items-center gap-6">
                {[
                  { href: "#", ariaLabel: "payment system with visa card", src: "/images/payment/payment-01.svg", alt: "visa card", width: 66, height: 22 },
                  { href: "#", ariaLabel: "payment system with paypal", src: "/images/payment/payment-02.svg", alt: "paypal", width: 18, height: 21 },
                  { href: "#", ariaLabel: "payment system with master card", src: "/images/payment/payment-03.svg", alt: "master card", width: 33, height: 24 },
                  { href: "#", ariaLabel: "payment system with apple pay", src: "/images/payment/payment-04.svg", alt: "apple pay", width: 52.94, height: 22 },
                  { href: "#", ariaLabel: "payment system with google pay", src: "/images/payment/payment-05.svg", alt: "google pay", width: 56, height: 22 },
                ].map((payment, index) => (
                  <a key={index} href={payment.href} aria-label={payment.ariaLabel}>
                    <Image
                      src={payment.src}
                      alt={payment.alt}
                      width={payment.width}
                      height={payment.height}
                      className="h-3 w-auto"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>}
 </>
 
  );
};

export default Footer;
