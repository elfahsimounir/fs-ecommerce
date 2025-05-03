import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <>
      <Breadcrumb title={"Contact"} pages={["contact"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="font-medium text-xl text-dark">
                  Contact Information
                </p>
              </div>

              <div className="p-4 sm:p-7.5">
              <div className="flex flex-col gap-4">
                  {[
                  {
                    type: "text",
                    content:
                    "Avenue Hassan II ; Rue Oued Lokous, Rés.La Colombe - Tétouan - Maroc.",
                    icon: (
                    <MapPin
                      size={20}
                      strokeWidth={1.5}
                      className="text-primary"
                    />
                    ),
                  },
                  {
                    type: "link",
                    content: "+212 667-659741",
                    href: "#",
                    icon: (
                    <Phone
                      size={20}
                      strokeWidth={1.5}
                      className="text-primary"
                    />
                    ),
                  },
                  {
                    type: "link",
                    content: "contact@multicls.ma",
                    href: "#",
                    icon: (
                    <Mail
                      size={20}
                      strokeWidth={1.5}
                      className="text-primary"
                    />
                    ),
                  },
                  ].map((item, index) => (
                  <p
                    key={index}
                    className="flex items-center gap-4"
                  >
                   <span className="flex"> {item.icon}</span>
                    {item.type === "link" ? (
                    <a
                      href={item.href}
                      className=" hover:underline"
                    >
                      {item.content}
                    </a>
                    ) : (
                    <span>{item.content}</span>
                    )}
                  </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
              <form>
                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                  <div className="w-full">
                    <label htmlFor="firstName" className="block mb-2.5">
                      First Name <span className="text-red">*</span>
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="Jhon"
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="lastName" className="block mb-2.5">
                      Last Name <span className="text-red">*</span>
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="Deo"
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                  <div className="w-full">
                    <label htmlFor="subject" className="block mb-2.5">
                      Subject
                    </label>

                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      placeholder="Type your subject"
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="phone" className="block mb-2.5">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Enter your phone"
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>

                <div className="mb-7.5">
                  <label htmlFor="message" className="block mb-2.5">
                    Message
                  </label>

                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    placeholder="Type your message"
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
