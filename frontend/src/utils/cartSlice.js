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
const getPortionKey = (item) => item.portionSize || (item.hasPortions ? "Full" : "");

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        item: getSavedCart()
    },

    reducers: {
        addCart: (state, action) => {
            const existingItem = state.item.find(
                (item) => String(item.id) === String(action.payload.id) &&
                    getPortionKey(item) === getPortionKey(action.payload)
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
            const target = typeof action.payload === "object" ? action.payload : { id: action.payload };
            const existingItem = state.item.find(
                (item) => String(item.id) === String(target.id) &&
                    (target.portionSize === undefined
                        ? true
                        : getPortionKey(item) === getPortionKey(target))
            );

            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                state.item = state.item.filter((item) => item !== existingItem);
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
