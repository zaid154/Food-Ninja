import { configureStore } from "@reduxjs/toolkit";
import cartReducers from "./cartSlice";
import wishlistReducers from "./wishlistSlice";
import ordersReducers from "./ordersSlice";

const appStore = configureStore({
    reducer: {
        cart: cartReducers,
        wishlist: wishlistReducers,
        orders: ordersReducers
    }
});

// every time the store changes, save cart / wishlist / orders to localStorage
// so the data is still there after refresh
appStore.subscribe(() => {
    const state = appStore.getState();
    localStorage.setItem("cart", JSON.stringify(state.cart.item));
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist.item));
    localStorage.setItem("orders", JSON.stringify(state.orders.list));
});

export default appStore;
