import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  items: WishListItem[];
};

type WishListItem = {
  id: number;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  stock?: number;
  status?: string;
  images?: {
    url: string;
  };
};

const initialState: InitialState = {
  items:(typeof window !== 'undefined')&& JSON.parse((localStorage as any).getItem("wishlist") || "[]"), // Load from localStorage
};


export const wishlist = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItemToWishlist: (state, action: PayloadAction<WishListItem>) => {
      const { id, name, price, quantity, images, discount, status,stock } =
        action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          name,
          price,
          quantity,
          images,
          discount,
          status,
          stock
        });
      }
    },
    removeItemFromWishlist: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },

    removeAllItemsFromWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItemToWishlist,
  removeItemFromWishlist,
  removeAllItemsFromWishlist,
} = wishlist.actions;
export default wishlist.reducer;
