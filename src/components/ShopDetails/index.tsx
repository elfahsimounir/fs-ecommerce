"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import Newsletter from "../Common/Newsletter";
import Loading from "../ui/loading";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Product } from "@/types/product";
import Starts from "../ui/starts";
import StockToggler from "../ui/stock-toggler";
import Link from "next/link";
import { off } from "node:process";
import { useSession } from "next-auth/react";
import { ShoppingCart, UserRound } from "lucide-react";
import { Button } from "../ui/button";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useNotification } from "@/hooks/notificationContext";
import { useRouter } from "next/navigation";

const staticData = {
  labels: {
    price: "Prix",
    breadcrumb: {
      title: "Détails du Produit",
      pages: ["boutique /", "détails"],
    },
    addToCart: "Ajouter au Panier",
    buyNow: "Acheter Maintenant",
    description: "Description",
    reviews: "Avis",
    relatedProducts: "Produits Connexes",
    hashtags: "Hashtags",
    quantity: "Quantité",
    purchaseNow: "Acheter Maintenant",
    comments: "Commentaires",
    name: "Nom",
    email: "Email",
    submitReview: "Soumettre un Avis",
    yourRating: "Votre Évaluation",
    requiredFields: "Votre adresse e-mail ne sera pas publiée. Les champs obligatoires sont marqués *",
    freeDelivery: "Livraison gratuite disponible",
    promoCode: "Ventes 30% de réduction avec le code : PROMO30",
    addReview: "Ajouter un Avis",
    reviewCount: "Avis pour ce produit",
    maximum: "Maximum",
  },
  messages: {
    outOfStock: "Rupture de Stock",
    inStock: "En Stock",
  },
};

// Reusable component for product images
const ProductImages = ({ item, previewImg, setPreviewImg, handlePreviewSlider }) => (
  <div className="lg:max-w-[570px] w-full">
    <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
      <div>
        <button
          onClick={handlePreviewSlider}
          aria-label="button for zoom"
          className="gallery__Image w-11 h-11 rounded-[5px] bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-primary absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
        >
          <svg
            className="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z"
              fill=""
            />
          </svg>
        </button>
        {previewImg ? (
          <Image
            src={previewImg}
            alt={item.name || "Product image"} // Add alt text
            width={400}
            height={400}
          />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  </div>
);

const ShopDetails = ({ item }: { item: Product | any }) => {
  const { openPreviewModal, setPreviewImages } = usePreviewSlider();
  const { showNotification } = useNotification();
  const [previewImg, setPreviewImg] = useState<any>();
  const { data: session, status } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("tabOne");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewFullName, setReviewFullName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [reviews, setReviews] = useState(item.reviews || []); // Initialize with item.reviews
  const dispatch = useAppDispatch();
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (reviewContent.length < 5) newErrors.content = "Content must be at least 5 characters long.";
    if (reviewRating < 1 || reviewRating > 5) newErrors.rating = "Rating must be between 1 and 5.";

    if (!session?.user) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewEmail)) newErrors.email = "Invalid email address.";
      if (reviewFullName.length < 3) newErrors.fullName = "Full name must be at least 3 characters long.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: reviewContent,
          rating: reviewRating,
          email: session?.user?.email || reviewEmail,
          fullName: session?.user?.name || reviewFullName,
          productId: item.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const newReview = await response.json();
      setReviews((prevReviews) => [...prevReviews, newReview]);
      setReviewContent("");
      setReviewRating(0);
      if (!session?.user) {
        setReviewEmail("");
        setReviewFullName("");
      }
      setErrors({});
    } catch (error: any) {
      console.error("Error submitting review:", error.message);
      setErrors({ form: error.message });
    }
  };
  const router = useRouter()
  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        discount: item.discount,
        quantity,
        stock: item.stock,
        slug: item.slug,
        images: item.images,
      })
    );
    showNotification(
      `1 Item(s) added successfully`,
      "success"
    );
  };
  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        id: item.id,
        name: item.name,
        price: item.price,
        discount: item.discount,
        quantity: 1, // Wishlist typically adds one item at a time
        stock: item.stock,
        images: item.images,
      })
    );
    showNotification(
      `1 Wish(s) added successfully`,
      "success"
    );
  };
  const tabs = [
    {
      id: "tabOne",
      title: staticData.labels.description,
    },
    {
      id: "tabTwo",
      title: "Informations Supplémentaires",
    },
    {
      id: "tabThree",
      title: staticData.labels.reviews,
    },
  ];

  const alreadyExist = localStorage.getItem("productDetails");
  const productFromStorage = useAppSelector(
    (state) => state.productDetailsReducer.value
  );

  const product = alreadyExist ? JSON.parse(alreadyExist) : productFromStorage;

  useEffect(() => {
    localStorage.setItem("productDetails", JSON.stringify(product));
    if (!previewImg) {
      setPreviewImg(item.images[0].url);
    }
    if (item.reviews && Array.isArray(item.reviews)) {
      setReviews(item.reviews); // Update reviews only if item.reviews is valid
    }
  }, [product, item.images, item.reviews, previewImg]);

  // pass the product here when you get the real data.
  const handlePreviewSlider = () => {
    openPreviewModal();
    setPreviewImages(item.images);
  };
const handleBuyNow = () =>{
handleAddToCart()
router.push('/checkout')
}
  return (
    <>
      <Breadcrumb
        title={staticData.labels.breadcrumb.title}
        pages={staticData.labels.breadcrumb.pages}
      />

      {item.name === "" ? (
        "Veuillez ajouter un produit"
      ) : (
        <>
          <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
                <div className="lg:max-w-[570px] w-full">
                  <ProductImages
                    item={item}
                    previewImg={previewImg}
                    setPreviewImg={setPreviewImg}
                    handlePreviewSlider={handlePreviewSlider}
                  />
                  <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                    {item.images?.map((item, key) => (
                      <button
                        onClick={() => setPreviewImg(item.url)}
                        key={key}
                        className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue ${item.url === previewImg
                          ? "border-gray-4"
                          : "border-transparent"
                          }`}
                      >
                        <Image
                          width={50}
                          height={50}
                          src={item.url}
                          alt={item.url}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* <!-- product content --> */}
                <div className="max-w-[539px] w-full">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark">
                      {item.name}
                    </h2>
                    {(item.discount / (Number(item.price)) * 100) > 5 && <div className="inline-flex whitespace-nowrap font-medium text-custom-sm text-white bg-secondary rounded-r-full py-0.5 px-2.5">
                      {Math.round((item.discount / (Number(item.price)) * 100))}% OFF
                    </div>}

                  </div>

                  <div className="flex flex-wrap items-center gap-5.5 mb-4.5">
                    <div className="flex items-center gap-2.5">
                      {/* <!-- stars --> */}
                      <Starts count={5} />
                      <span> ({item.reviews.length} {staticData.labels.reviews}) </span>
                    </div>
                    <StockToggler stock={item.stock} />
                  </div>

                  <h3 className="font-medium text-custom-1 mb-4.5 flex gap-2 items-center">
                    <span className=" text-primary">
                      {staticData.labels.price} : {(item?.price as number) - item.discount} DH
                    </span>
                    <span className="line-through text-sm sm:text-base">
                      {item.price} DH
                    </span>
                  </h3>

                  <ul className="flex flex-col gap-2">
                    <li className="flex gap-2">
                      <svg

                        className="text-primary"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.3589 8.35863C13.603 8.11455 13.603 7.71882 13.3589 7.47475C13.1149 7.23067 12.7191 7.23067 12.4751 7.47475L8.75033 11.1995L7.5256 9.97474C7.28152 9.73067 6.8858 9.73067 6.64172 9.97474C6.39764 10.2188 6.39764 10.6146 6.64172 10.8586L8.30838 12.5253C8.55246 12.7694 8.94819 12.7694 9.19227 12.5253L13.3589 8.35863Z"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.0003 1.04169C5.05277 1.04169 1.04199 5.05247 1.04199 10C1.04199 14.9476 5.05277 18.9584 10.0003 18.9584C14.9479 18.9584 18.9587 14.9476 18.9587 10C18.9587 5.05247 14.9479 1.04169 10.0003 1.04169ZM2.29199 10C2.29199 5.74283 5.74313 2.29169 10.0003 2.29169C14.2575 2.29169 17.7087 5.74283 17.7087 10C17.7087 14.2572 14.2575 17.7084 10.0003 17.7084C5.74313 17.7084 2.29199 14.2572 2.29199 10Z"
                        />
                      </svg>
                      <span>  {staticData.labels.freeDelivery}</span>

                    </li>
                    <li className="flex gap-2">
                      <svg
                        className="text-primary"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.3589 8.35863C13.603 8.11455 13.603 7.71882 13.3589 7.47475C13.1149 7.23067 12.7191 7.23067 12.4751 7.47475L8.75033 11.1995L7.5256 9.97474C7.28152 9.73067 6.8858 9.73067 6.64172 9.97474C6.39764 10.2188 6.39764 10.6146 6.64172 10.8586L8.30838 12.5253C8.55246 12.7694 8.94819 12.7694 9.19227 12.5253L13.3589 8.35863Z"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.0003 1.04169C5.05277 1.04169 1.04199 5.05247 1.04199 10C1.04199 14.9476 5.05277 18.9584 10.0003 18.9584C14.9479 18.9584 18.9587 14.9476 18.9587 10C18.9587 5.05247 14.9479 1.04169 10.0003 1.04169ZM2.29199 10C2.29199 5.74283 5.74313 2.29169 10.0003 2.29169C14.2575 2.29169 17.7087 5.74283 17.7087 10C17.7087 14.2572 14.2575 17.7084 10.0003 17.7084C5.74313 17.7084 2.29199 14.2572 2.29199 10Z"
                        />
                      </svg>
                      <span> {staticData.labels.promoCode}</span>
                    </li>
                  </ul>



                  <form onSubmit={(e) => e.preventDefault()}>
                    {item.hashtags &&
                      <div className="flex flex-col gap-4.5 border-y border-gray-3 mt-7.5 mb-9 py-9">
                        <div className="flex items-center gap-4">
                          <div className="min-w-[65px]">
                            <h4 className="font-medium text-dark">{staticData.labels.hashtags} : </h4>
                          </div>

                          <div className="flex items-center gap-2.5">
                            {item.hashtags.map((item, index) => (
                              <Link
                                href={`/shop?hashtags=${item.name}`}
                                key={index}
                                className="bg-[black]/5 px-2.5 rounded-md"
                              >
                                #{item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    }


                    <div className="flex flex-wrap items-center gap-4.5">
                      <div className="px-2 py-1 flex items-center rounded-md border gray-2 ">
                        <Button variant={'ghost'} onClick={() =>
                          quantity > 1 && setQuantity(quantity - 1)
                        } aria-label="button for remove product">
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.33301 10.0001C3.33301 9.53984 3.7061 9.16675 4.16634 9.16675H15.833C16.2932 9.16675 16.6663 9.53984 16.6663 10.0001C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10.0001Z"
                              fill=""
                            />
                          </svg>
                        </Button>

                        <span className="flex items-center justify-center px-3 ">
                          {quantity}
                        </span>

                        <Button variant={'ghost'}

                          onClick={() => setQuantity(quantity + 1)}
                          aria-label="button for add product"

                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.33301 10C3.33301 9.5398 3.7061 9.16671 4.16634 9.16671H15.833C16.2932 9.16671 16.6663 9.5398 16.6663 10C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10Z"
                              fill=""
                            />
                            <path
                              d="M9.99967 16.6667C9.53944 16.6667 9.16634 16.2936 9.16634 15.8334L9.16634 4.16671C9.16634 3.70647 9.53944 3.33337 9.99967 3.33337C10.4599 3.33337 10.833 3.70647 10.833 4.16671L10.833 15.8334C10.833 16.2936 10.4599 16.6667 9.99967 16.6667Z"
                              fill=""
                            />
                          </svg>
                        </Button>
                      </div>

                      <Button
                        variant={'ghost'}
                        className={`border border-gray-3 p-5.5`}
                        onClick={() => handleAddToCart()}

                      >
                        <ShoppingCart strokeWidth={1.5} size={18} />
                      </Button>
                      <Button
                       className="p-5.5 bg-primary/5 hover:bg-primary/10"
                        onClick={() => handleBuyNow()}
                      >
                        {staticData.labels.purchaseNow}
                      </Button>

                      <Button
                        className={`border border-gray-3 p-5.5`}
                        variant={'ghost'}
                        onClick={() => handleItemToWishList()}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.74949 2.94946C2.6435 3.45502 1.83325 4.65749 1.83325 6.0914C1.83325 7.55633 2.43273 8.68549 3.29211 9.65318C4.0004 10.4507 4.85781 11.1118 5.694 11.7564C5.89261 11.9095 6.09002 12.0617 6.28395 12.2146C6.63464 12.491 6.94747 12.7337 7.24899 12.9099C7.55068 13.0862 7.79352 13.1667 7.99992 13.1667C8.20632 13.1667 8.44916 13.0862 8.75085 12.9099C9.05237 12.7337 9.3652 12.491 9.71589 12.2146C9.90982 12.0617 10.1072 11.9095 10.3058 11.7564C11.142 11.1118 11.9994 10.4507 12.7077 9.65318C13.5671 8.68549 14.1666 7.55633 14.1666 6.0914C14.1666 4.65749 13.3563 3.45502 12.2503 2.94946C11.1759 2.45832 9.73214 2.58839 8.36016 4.01382C8.2659 4.11175 8.13584 4.16709 7.99992 4.16709C7.864 4.16709 7.73393 4.11175 7.63967 4.01382C6.26769 2.58839 4.82396 2.45832 3.74949 2.94946ZM7.99992 2.97255C6.45855 1.5935 4.73256 1.40058 3.33376 2.03998C1.85639 2.71528 0.833252 4.28336 0.833252 6.0914C0.833252 7.86842 1.57358 9.22404 2.5444 10.3172C3.32183 11.1926 4.2734 11.9253 5.1138 12.5724C5.30431 12.7191 5.48911 12.8614 5.66486 12.9999C6.00636 13.2691 6.37295 13.5562 6.74447 13.7733C7.11582 13.9903 7.53965 14.1667 7.99992 14.1667C8.46018 14.1667 8.88401 13.9903 9.25537 13.7733C9.62689 13.5562 9.99348 13.2691 10.335 12.9999C10.5107 12.8614 10.6955 12.7191 10.886 12.5724C11.7264 11.9253 12.678 11.1926 13.4554 10.3172C14.4263 9.22404 15.1666 7.86842 15.1666 6.0914C15.1666 4.28336 14.1434 2.71528 12.6661 2.03998C11.2673 1.40058 9.54129 1.5935 7.99992 2.97255Z"
                            fill=""
                          />
                        </svg>
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden bg-gray-2 py-20">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              {/* <!--== tab header start ==--> */}
              <div className="flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
                {tabs.map((item, key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(item.id)}
                    className={`font-medium  ease-out duration-200  relative before:h-0.5 before:bg-primary before:absolute before:left-0 before:-bottom-1 before:ease-out before:duration-200 hover:before:w-full ${activeTab === item.id
                      ? "text-dark before:w-full"
                      : "text-dark before:w-0"
                      }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              {/* <!--== tab header end ==--> */}

              {/* <!--== tab content start ==--> */}
              {/* <!-- tab content one start --> */}
              <div>
                <div
                  className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${activeTab === "tabOne" ? "flex" : "hidden"
                    }`}
                >
                  <div className="max-w-[670px] w-full">
                    <p className="mb-6">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
              {/* <!-- tab content one end --> */}

              {/* <!-- tab content two start --> */}
              <div
                className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10 ${activeTab === "tabTwo" ? "block" : "hidden"
                  }`}
              >
                {item.properties && item.properties.length > 0 && (
                  <div className="flex flex-col gap-4.5 border-y border-gray-3 mt-7.5 mb-9 py-9">
                    {item.properties.map((property, key) => (
                      <>
                        <div className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                          <div className="max-w-[450px] min-w-[140px] w-full">
                            <p className="text-sm sm:text-base text-dark"> {property.name}</p>
                          </div>
                          <div className="w-full">
                            <p className="text-sm sm:text-base text-dark">  {property.value}</p>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                )}
                {/* <!-- info item --> */}
              </div>
              {/* <!-- tab content two end --> */}

              {/* <!-- tab content three start --> */}
              <div>
                <div
                  className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${activeTab === "tabThree" ? "flex" : "hidden"
                    }`}
                >
                  <div className="max-w-[570px] w-full">
                    <h2 className="font-medium text-2xl text-dark mb-9">
                      {reviews.length} {staticData.labels.reviewCount}
                    </h2>

                    <div className="flex flex-col gap-6">
                      {reviews.map((review, index) => (
                        <div key={index} className="rounded-xl bg-white shadow-1 p-4 sm:p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className=" rounded-full bg-gray-2 p-4">
                                <UserRound className="text-primary" strokeWidth={1.5} size={25} />
                              </div>
                              <div>
                                <h3 className="font-medium text-dark">{review.fullName}</h3>
                                <p className="text-custom-sm">User</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, starIndex) => (
                                <span
                                  key={starIndex}
                                  className={`cursor-pointer ${starIndex < review.rating ? "text-[#FBB040]" : "text-gray-5"}`}
                                >
                                  <svg
                                    className="fill-current"
                                    width="15"
                                    height="16"
                                    viewBox="0 0 15 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z"
                                      fill=""
                                    />
                                  </svg>
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-dark mt-6">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="max-w-[550px] w-full">
                    <form onSubmit={handleReviewSubmit}>
                      <h2 className="font-medium text-2xl text-dark mb-3.5">
                        {staticData.labels.addReview}
                      </h2>

                      <p className="mb-6">
                        {staticData.labels.requiredFields}
                      </p>

                      <div className="flex items-center gap-3 mb-7.5">
                        <span>{staticData.labels.yourRating}*</span>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className={`cursor-pointer ${reviewRating >= star ? "text-[#FBB040]" : "text-gray-5"
                                }`}
                            >
                              <svg
                                className="fill-current"
                                width="15"
                                height="16"
                                viewBox="0 0 15 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z"
                                  fill=""
                                />
                              </svg>
                            </span>
                          ))}
                        </div>
                      </div>
                      {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}

                      <textarea
                        name="comments"
                        id="comments"
                        rows={5}
                        placeholder="Your comments"
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      ></textarea>
                      {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}

                      <div className="flex flex-col lg:flex-row gap-5 sm:gap-7.5 mb-5.5">
                        {!session?.user && (
                          <>
                            <div>
                              <label htmlFor="name" className="block mb-2.5">
                                {staticData.labels.name}
                              </label>

                              <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Your name"
                                value={reviewFullName}
                                onChange={(e) => setReviewFullName(e.target.value)}
                                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                              />
                              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                            </div>

                            <div>
                              <label htmlFor="email" className="block mb-2.5">
                                {staticData.labels.email}
                              </label>

                              <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Your email"
                                value={reviewEmail}
                                onChange={(e) => setReviewEmail(e.target.value)}
                                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                              />
                              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                          </>
                        )}
                      </div>

                      {errors.form && <p className="text-red-500 text-sm mb-4">{errors.form}</p>}

                      <button
                        type="submit"
                        className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
                      >
                        {staticData.labels.submitReview}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              {/* <!-- tab content three end --> */}
              {/* <!--== tab content end ==--> */}
            </div>
          </section>

          {/* <RecentlyViewdItems /> */}

          <Newsletter />
        </>
      )}
    </>
  );
};

export default ShopDetails;
