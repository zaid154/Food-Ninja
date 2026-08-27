import { createSlice } from "@reduxjs/toolkit";

const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        item: savedCart
    },

    reducers: {
        addCart: (state, action) => {
            const existingItem = state.item.find(
                (item) => item.id === action.payload.id
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.item.push({ ...action.payload, quantity: 1 });
            }
        },

        removeCart: (state, action) => {
            const existingItem = state.item.find(
                (item) => item.id === action.payload
            );

            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                state.item = state.item.filter(
                    (item) => item.id !== action.payload
                );
            }
        },

        clearCart: (state) => {
            state.item = [];
        }

    }
});

export const { addCart, removeCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
