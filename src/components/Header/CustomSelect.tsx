import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SliceHandler from "../Common/SliceHandler";
import { ChartBarStacked } from "lucide-react";

const CustomSelect = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const router = useRouter(); // Updated to use next/navigation

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    const query = new URLSearchParams(); // Initialize URLSearchParams
    query.set("category", option.label); // Use the original category name for encoding

    router.push(`/shop?${query.toString()}`); // Navigate with formatted query
    setSelectedOption(option);
    toggleDropdown();
  };

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".dropdown-content")) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown-content custom-select relative  py-2">
      <div
        className={`select-selected whitespace-nowrap ${
          isOpen ? "select-arrow-active" : ""
        }`}
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-2">
        <ChartBarStacked size={23} strokeWidth={1.5} className="text-primary" />
        {selectedOption ? <p className="text-dark">{(selectedOption.label).slice(0, 12) }<span className="opacity-40">..</span></p>: <span>Select Category</span>}
        </div>
        
      </div>
      <div className={`select-items ${isOpen ? "" : "select-hide"}`}>
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`select-item ${
              selectedOption === option ? "same-as-selected" : ""
            }`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
