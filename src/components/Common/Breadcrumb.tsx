import Link from "next/link";
import React from "react";

const Breadcrumb = ({ title, pages }) => {
  return (
    <div className="overflow-hidden shadow-breadcrumb pt-[209px] sm:pt-[155px] lg:pt-[95px] xl:pt-[145px]">
      <div className="border-t border-gray-3">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-5 xl:pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="font-thin text-dark text-xl sm:text-lg xl:text-xl">
              {title}
            </h1>

            <ul className="flex items-center gap-2">
              <li className="text-custom-sm hover:text-primary">
                <Link href="/">Home /</Link>
              </li>

              {pages.length > 0 &&
                pages.map((page, key) => (
                  <li className="text-custom-sm last:text-primary capitalize" key={key}>
                    {page} 
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
