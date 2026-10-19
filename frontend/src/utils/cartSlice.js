import { createSlice } from "@reduxjs/toolkit";

const getSavedCart = () => {
    try {
        return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
        return [];
    }
};

const saveCart = (items) => {
    try {
        localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
};

const MAX_QUANTITY_PER_ITEM = 10;

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        item: getSavedCart()
    },

    reducers: {
        addCart: (state, action) => {
            const existingItem = state.item.find(
                (item) => item.id === action.payload.id
            );

            if (existingItem) {
                if (existingItem.quantity < MAX_QUANTITY_PER_ITEM) {
                    existingItem.quantity += 1;
                }
            } else {
                state.item.push({ ...action.payload, quantity: 1 });
            }
            saveCart(state.item);
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
            saveCart(state.item);
        },

        clearCart: (state) => {
            state.item = [];
            saveCart([]);
        }
    }
});

export const { addCart, removeCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
