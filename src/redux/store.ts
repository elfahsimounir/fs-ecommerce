import { configureStore } from "@reduxjs/toolkit";

import quickViewReducer from "./features/quickView-slice";
import cartReducer from "./features/cart-slice";
import wishlistReducer from "./features/wishlist-slice";
import productDetailsReducer from "./features/product-details";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"; // Import useDispatch
// Middleware to sync state with localStorage
const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  // Save cart to localStorage
  const state = store.getState();
  localStorage.setItem("cart", JSON.stringify(state.cartReducer.items));
  localStorage.setItem("wishlist", JSON.stringify(state.wishlistReducer.items));

  return result;
};
export const store = configureStore({
  reducer: {
    quickViewReducer,
    cartReducer,
    wishlistReducer,
    productDetailsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Fixed