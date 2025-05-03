"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import { removeAllItemsFromWishlist } from "@/redux/features/wishlist-slice";
import { useNotification } from "@/hooks/notificationContext";

export const Wishlist = () => {
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
   const { showNotification } = useNotification();
  const dispatch = useAppDispatch(); 

  const handleClearWishlist = () => {
    dispatch(removeAllItemsFromWishlist()); 
  };
  return (
    <>
      <Breadcrumb title={"Wishlist"} pages={["Wishlist"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">Votre liste de souhaits</h2>
            <button   onClick={()=>{
              handleClearWishlist();
              showNotification(
                `Wishlist cleared successfully`,
                "success"
              );
            }} className="text-primary">Vider la liste</button>
          </div>

          <div className="bg-white rounded-[10px] shadow-1">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1170px]">
                {/* <!-- table header --> */}
                <div className="flex items-center py-5.5 px-10">
                  <div className="min-w-[83px]"></div>
                  <div className="min-w-[387px]">
                    <p className="text-dark">Produit</p>
                  </div>

                  <div className="min-w-[205px]">
                    <p className="text-dark">Prix unit </p>
                  </div>

                  <div className="min-w-[265px]">
                    <p className="text-dark">Stock Status</p>
                  </div>

                  <div className="min-w-[150px]">
                    <p className="text-dark text-right">Action</p>
                  </div>
                </div>

                {/* <!-- wish item --> */}
                {wishlistItems.map((item, key) => (
                  <SingleItem item={item} key={key} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
