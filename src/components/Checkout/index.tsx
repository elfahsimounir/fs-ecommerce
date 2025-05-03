"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Billing from "./Billing";
import { useAppDispatch, useAppSelector, } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice,removeAllItemsFromCart  } from "@/redux/features/cart-slice";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/notificationContext";

const Checkout = () => {
  const dispatch = useAppDispatch(); 
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
   const { showNotification } = useNotification();
  const router = useRouter();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    telephone: "",
    city: "",
    country: "Morocco",
    email: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!shippingDetails.fullName || shippingDetails.fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters long.";
    }
    if (!shippingDetails.address) {
      newErrors.address = "Address is required.";
    }
    if (!shippingDetails.telephone || !/^\d+$/.test(shippingDetails.telephone)) {
      newErrors.telephone = "Valid telephone number is required.";
    }
    if (!shippingDetails.city) {
      newErrors.city = "City is required.";
    }
    if (!shippingDetails.country) {
      newErrors.country = "Country is required.";
    }
    if (!shippingDetails.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingDetails.email)) {
      newErrors.email = "Valid email address is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            discount: item.discount || 0,
            quantity: item.quantity, // Include quantity for each product
          })),
          shipping: shippingDetails,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to place order.");
      }

      const order = await response.json();
      console.log("Order placed successfully:", order);
      alert("Order placed successfully!");
      setShippingDetails({
        fullName: "",
        address: "",
        telephone: "",
        city: "",
        country: "Morocco",
        email: "",
      });
      showNotification(
        `1 order(s) created successfully`,
       "success"
     );
      dispatch(removeAllItemsFromCart());
      router
        .push("/shop")
    } catch (error: any) {
      console.error("Error placing order:", error.message);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11 ">
              {/* Checkout Left */}
              <div className="lg:max-w-[670px] w-full">
                {/* <Login /> */}
                <Billing
                  shippingDetails={shippingDetails}
                  handleInputChange={handleInputChange}
                  errors={errors}
                />
              </div>

              {/* Checkout Right */}
              <div className="max-w-[455px] w-full">
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">Your Order</h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Product</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">Subtotal</h4>
                      </div>
                    </div>

                    {cartItems.map((item, key) => (
                      <div key={key} className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">
                            {item.name} (x{item.quantity}) {/* Display quantity */}
                          </p>
                        </div>
                        <div>
                          <p className="text-dark text-right">
                            {(item.price - item.discount) * item.quantity} DH
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">{totalPrice} DH</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-primary bg-primary/10 py-3 px-6 border border-transparent rounded-md ease-out duration-200 hover:border-primary/20 mt-7.5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Process to Checkout"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
