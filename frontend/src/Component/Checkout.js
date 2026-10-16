import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../utils/cartSlice";
import { addOrder } from "../utils/ordersSlice";
import UserContext from "./Usercontext";
import { API_BASE_URL } from "../utils/Constants";

const Checkout = () => {
    const cartItems = useSelector((store) => store.cart.item);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);

    // "Buy now" passes a single product via router state, otherwise use the cart
    const buyNowItem = location.state && location.state.buyNowItem;
    const isBuyNow = Boolean(buyNowItem);

    const items = isBuyNow
        ? [{ ...buyNowItem, quantity: 1 }]
        : cartItems;

    const [name, setName] = useState(user ? user.name : "");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [payment, setPayment] = useState("Cash on Delivery");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const totalItems = items.reduce((n, i) => n + (i.quantity || 1), 0);
    const subtotal = items.reduce(
        (sum, item) => sum + (item.price || item.caloriesPerServing || 0) * (item.quantity || 1),
        0
    );
    const deliveryFee = totalItems > 0 ? 30 : 0;
    const taxes = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + deliveryFee + taxes;

    const placeOrder = async (e) => {
        e.preventDefault();

        if (name.trim() === "" || address.trim() === "" || phone.trim() === "") {
            setError("Please fill in your name, contact phone, and delivery address.");
            return;
        }

        if (items.length === 0) {
            setError("No items in cart to order.");
            return;
        }

        const newOrder = {
            id: Date.now(),
            userEmail: user ? user.email : "guest@foodninja.com",
            customerName: name,
            address: address,
            phone: phone,
            payment: payment,
            items: items,
            total: grandTotal,
            status: "Placed",
            date: new Date().toLocaleString()
        };

        try {
            setSubmitting(true);
            // Save to Backend MongoDB Atlas
            await fetch(`${API_BASE_URL}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newOrder),
            });

            // Save to Redux Store
            dispatch(addOrder(newOrder));

            if (!isBuyNow) {
                dispatch(clearCart());
            }

            alert("Order placed successfully! Track your order status in 'My Orders'.");
            navigate("/orders");
        } catch (err) {
            console.error("Order error:", err);
            // Even if offline, proceed with local state
            dispatch(addOrder(newOrder));
            if (!isBuyNow) dispatch(clearCart());
            navigate("/orders");
        } finally {
            setSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center px-4 bg-slate-50">
                <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Your Cart is Empty
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Add some delicious food dishes before checkout.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-slate-50 px-4 py-10 min-h-[85vh]">
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_1fr]">
                {/* Delivery Form */}
                <form onSubmit={placeOrder} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                            <h1 className="text-xl font-black text-slate-900">
                                Delivery Address & Payment
                            </h1>
                            <p className="text-xs text-slate-500 mt-0.5">Please provide where you want your order delivered.</p>
                        </div>
                        {isBuyNow && (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                                Instant Order
                            </span>
                        )}
                    </div>

                    <div className="mt-5 space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Phone Number *</label>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                                placeholder="10-digit mobile number"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Delivery Address *</label>
                            <textarea
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={3}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                                placeholder="Complete address: House/Flat no, building, street, landmark, city"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Payment Method</label>
                            <div className="mt-1 flex items-center justify-between rounded-lg border-2 border-emerald-500 bg-emerald-50/60 p-3">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white font-bold">✓</span>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Cash on Delivery</p>
                                        <p className="text-[11px] text-slate-500">Pay with cash/UPI when your food arrives</p>
                                    </div>
                                </div>
                                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Only Available</span>
                            </div>
                        </div>

                        {error && (
                            <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs font-semibold text-red-700">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                        >
                            {submitting ? "Placing Order..." : `Confirm Order — ₹${grandTotal}`}
                        </button>
                    </div>
                </form>

                {/* Order Summary */}
                <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
                    <h2 className="text-lg font-black text-slate-900 pb-3 border-b border-slate-100">Order Summary</h2>

                    <ul className="mt-4 space-y-3 divide-y divide-slate-100">
                        {items.map((item, idx) => (
                            <li key={idx} className="flex justify-between pt-2 text-sm">
                                <div>
                                    <p className="font-bold text-slate-800">{item.name || item.title}</p>
                                    <span className="text-xs text-slate-400 font-medium">Qty: {item.quantity || 1}</span>
                                </div>
                                <span className="font-bold text-slate-900">
                                    ₹{(item.price || item.caloriesPerServing || 0) * (item.quantity || 1)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-600">
                        <div className="flex justify-between">
                            <span>Item Total</span>
                            <span className="font-bold text-slate-900">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Partner Fee</span>
                            <span className="font-bold text-slate-900">₹{deliveryFee}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Govt. Taxes (5% GST)</span>
                            <span className="font-bold text-slate-900">₹{taxes}</span>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-base font-black text-slate-900">
                        <span>Grand Total</span>
                        <span className="text-emerald-700">₹{grandTotal}</span>
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default Checkout;
