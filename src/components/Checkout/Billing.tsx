import React, { useState } from "react";

const zones = {
  Morocco: ["Casablanca", "Rabat", "Marrakech"],
  USA: ["New York", "Los Angeles", "Chicago"],
  France: ["Paris", "Lyon", "Marseille"],
  Germany: ["Berlin", "Munich", "Hamburg"],
};

const Billing = ({ shippingDetails, handleInputChange, errors }: { shippingDetails: any; handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; errors: { [key: string]: string } }) => {
  const [cities, setCities] = useState<string[]>(zones[shippingDetails.country] || []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    handleInputChange(e);
    setCities(zones[selectedCountry] || []);
  };

  return (
    <div className="mt-9 md:mt-0">
      <h2 className="text-dark text-xl sm:text-2xl mb-5.5">
      Détails de facturation
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="mb-5 relative">
          <label htmlFor="fullName" className="block mb-2.5">
          Nom et prénom <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={shippingDetails.fullName}
            onChange={handleInputChange}
            placeholder="John Doe"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {errors.fullName && <p className="text-red mt-1 text-xs ml-2 absolute -bottom-4">{errors.fullName}</p>}
        </div>

        <div className="mb-5 relative">
          <label htmlFor="address" className="block mb-2.5">
            Address <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={shippingDetails.address}
            onChange={handleInputChange}
            placeholder="123 Main Street"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {errors.address && <p className="text-red mt-1 text-xs ml-2 absolute -bottom-4">{errors.address}</p>}
        </div>

        <div className="mb-5 relative">
          <label htmlFor="telephone" className="block mb-2.5">
            Telephone <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="telephone"
            id="telephone"
            value={shippingDetails.telephone}
            onChange={handleInputChange}
            placeholder="1234567890"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {errors.telephone && <p className="text-red mt-1 text-xs ml-2 absolute -bottom-4">{errors.telephone}</p>}
        </div>

        <div className="mb-5 relative">
          <label htmlFor="country" className="block mb-2.5">
          Pays <span className="text-red">*</span>
          </label>
          <select
            name="country"
            id="country"
            value={shippingDetails.country}
            onChange={handleCountryChange}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          >
            <option value="">Select a country</option>
            {Object.keys(zones).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && <p className="text-red mt-1 text-xs ml-2 absolute -bottom-4">{errors.country}</p>}
        </div>

        <div className="mb-5 relative">
          <label htmlFor="city" className="block mb-2.5">
          Ville <span className="text-red">*</span>
          </label>
          <select
            name="city"
            id="city"
            value={shippingDetails.city}
            onChange={handleInputChange}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && <p className="text-red mt-1 text-xs ml-2 absolute -bottom-4">{errors.city}</p>}
        </div>

        <div className="mb-5 relative">
          <label htmlFor="email" className="block mb-2.5">
          Adresse email <span className="text-red">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={shippingDetails.email}
            onChange={handleInputChange}
            placeholder="example@example.com"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {errors.email && <p className="text-red mt-1 text-xs ml-2 absolute -bottom-4">{errors.email}</p>}
        </div>
      </div>
    </div>
  );
};

export default Billing;
