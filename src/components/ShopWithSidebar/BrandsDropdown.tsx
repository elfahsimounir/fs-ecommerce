import React from "react";

const BrandsDropdown = ({ brands, selectedBrand, onChange }) => {
  return (
    <div className="bg-white shadow-1 rounded-lg py-4 px-5">
      <h4 className="font-medium text-dark mb-4">Brands</h4>
      <ul className="space-y-2">
        {brands.map((brand) => (
          <li key={brand.name}>
            <button
              className={`text-sm ${
                selectedBrand === brand.name ? "text-blue font-bold" : "text-dark"
              }`}
              onClick={() => onChange(brand.name)}
            >
              {brand.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrandsDropdown;
