import { createSlice } from "@reduxjs/toolkit";

// load saved orders from localStorage so order history is kept after refresh
const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

const ordersSlice = createSlice({
    name: "orders",

    initialState: {
        list: savedOrders
    },

    reducers: {

        // add a new order to the top of the list
        addOrder: (state, action) => {
            state.list.unshift(action.payload);
            try {
                localStorage.setItem("orders", JSON.stringify(state.list));
            } catch {}
        },

        // cancel an order the customer just placed.
        cancelOrder: (state, action) => {
            const order = state.list.find((o) => o.id === action.payload);
            if (order && order.status === "Placed") {
                order.status = "Cancelled";
                try {
                    localStorage.setItem("orders", JSON.stringify(state.list));
                } catch {}
            }
        },

        // remove all orders (used on logout if needed)
        clearOrders: (state) => {
            state.list = [];
            try {
                localStorage.removeItem("orders");
            } catch {}
        }
    }
});

export const { addOrder, cancelOrder, clearOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
