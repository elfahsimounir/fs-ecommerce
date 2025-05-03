import React from "react";


import { Metadata } from "next";
import Error from "../404";
export const metadata: Metadata = {
  title: "Error Page | NextCommerce Nextjs E-commerce template",
  description: "This is Error Page for NextCommerce Template",
  // other metadata
};

const NotFound = () => {
  return (
    <main>
      <Error />
    </main>
  );
};

export default NotFound
