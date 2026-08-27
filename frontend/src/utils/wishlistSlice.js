import { createSlice } from "@reduxjs/toolkit";

const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const wishlistSlice = createSlice({
    name: "wishlist",

    initialState: {
        item: savedWishlist
    },

    reducers: {
        addWishlist: (state, action) => {
            const exists = state.item.find((i) => i.id === action.payload.id);
            if (!exists) {
                state.item.push(action.payload);
            }
        },

        removeWishlist: (state, action) => {
            state.item = state.item.filter((i) => i.id !== action.payload);
        },

        // empty the wishlist
        clearWishlist: (state) => {
            state.item = [];
        }
    }
});

export const { addWishlist, removeWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
