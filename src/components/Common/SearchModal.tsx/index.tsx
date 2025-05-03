"use client";
import React, { useEffect, useState } from "react";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import AiSearch from "@/components/ai-search";
import axios from "axios";
import SkeletonLoading from "../SkeletonLoading";
import SingleListItem from "@/components/Shop/SingleListItem";
import SearchItem from "@/components/Shop/SearchItem";
import { Search, Sparkles } from "lucide-react";

const SearchModal = () => {
  const { isOpen, openSearchModal, closeSearchModal } = useCartModalContext();
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        closeSearchModal();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeSearchModal]);

  const handleSearch = async (query) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`/api/search`, {
        params: { query },
      });
      setSearchResults(response.data.products || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const highlightMatch = (text, query) => {
    const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
    return text.replace(regex, `<span class="${'bg-secondary'} !p-0 !m-0 !border-none">$1</span>`);
  };

  return (
    <div
      className={`fixed flex items-center justify-center top-0 left-0 z-[99999] overflow-y-auto no-scrollbar w-full h-screen bg-dark/30 backdrop-blur-md ease-linear duration-300 ${isOpen ? "block opacity-100" : "hidden opacity-0"
        }`}
    >
      <div className="flex items-center justify-center w-full lg:min-w-[1200px]">
        <div className="w-full lg:max-w-[70%] shadow-1  h-screen lg:max-h-[700px] overflow-hidden  bg-white px-4 sm:px-7.5 lg:px-11 relative modal-content rounded-lg">
          <div className="sticky top-0 bg-white flex items-center justify-between pb-7 pt-4 sm:pt-7.5 lg:pt-11 border-b border-gray-3 mb-7.5">
            <h2 className="text-dark tracking-wider text-lg sm:text-2xl">
              Search
            </h2>
            <button
              onClick={() => closeSearchModal()}
              aria-label="button for close modal"
              className="flex items-center justify-center ease-in duration-150 bg-meta text-dark-5 hover:text-dark"
            >
              <svg
                className="fill-current"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5379 11.2121C12.1718 10.846 11.5782 10.846 11.212 11.2121C10.8459 11.5782 10.8459 12.1718 11.212 12.5379L13.6741 15L11.2121 17.4621C10.846 17.8282 10.846 18.4218 11.2121 18.7879C11.5782 19.154 12.1718 19.154 12.5379 18.7879L15 16.3258L17.462 18.7879C17.8281 19.154 18.4217 19.154 18.7878 18.7879C19.154 18.4218 19.154 17.8282 18.7878 17.462L16.3258 15L18.7879 12.5379C19.154 12.1718 19.154 11.5782 18.7879 11.2121C18.4218 10.846 17.8282 10.846 17.462 11.2121L15 13.6742L12.5379 11.2121Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15 1.5625C7.57867 1.5625 1.5625 7.57867 1.5625 15C1.5625 22.4213 7.57867 28.4375 15 28.4375C22.4213 28.4375 28.4375 22.4213 28.4375 15C28.4375 7.57867 22.4213 1.5625 15 1.5625ZM3.4375 15C3.4375 8.61421 8.61421 3.4375 15 3.4375C21.3858 3.4375 26.5625 8.61421 26.5625 15C26.5625 21.3858 21.3858 26.5625 15 26.5625C8.61421 26.5625 3.4375 21.3858 3.4375 15Z"
                  fill=""
                />
              </svg>
            </button>
          </div>

          <div className="flex border-b border-gray-3 mb-4">
            <button
              className={`px-4 py-2 ${activeTab === "search" ? "border-b-2 border-primary" : ""
                }`}
              onClick={() => setActiveTab("search")}
            >
             <Search className='text-primary' size={16} />
            </button>
            <button
              className={`px-4 flex items-center gap-2 py-2 ${activeTab === "ar-search" ? "border-b-2 border-primary" : ""
                }`}
              onClick={() => setActiveTab("ar-search")}
            >
             
              <Sparkles className='text-primary' size={16} />
              <span className="opacity-70 text-sm">MutiAi  </span>
            </button>
          </div>

          <div className=" ">
            {activeTab === "search" && (
              <div>
                <div className="flex relative p-4 gap-2 items-center rounded-lg border border-gray-2">

                    <input
                  type="text"
                  
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="w-full border-none  outline-none text-sm rounded"
                />
                <span className="">
                <Search  size={20} className="text-gray-6"/>
                </span>
               
                </div>
              
                <div className="h-[100vh] lg:h-[65vh] pb-10  overflow-y-auto no-scrollbar">
                  {searchQuery !== "" && !searchResults &&
                    <SkeletonLoading count={4} />
                  }
                  {searchResults.map((product: any) => (
                    <div
                    key={product.id}
                    >
                      <SearchItem
                        name={<span
                          className=""
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(product.name, searchQuery),
                          }}
                        ></span>}
                        item={product} />
                    </div>
                  ))}

                </div>
              </div>
            )}
            {activeTab === "ar-search" && <AiSearch />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
function escapeRegex(query: string): string {
  return query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

