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
    const [confirmedOrder, setConfirmedOrder] = useState(null);

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

        if (!name.trim()) {
            setError("Please enter your full name.");
            return;
        }

        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length !== 10) {
            setError("Please enter a valid 10-digit mobile number.");
            return;
        }

        if (address.trim().length < 10) {
            setError("Please enter a complete delivery address (minimum 10 characters).");
            return;
        }

        if (items.length === 0) {
            setError("No items in cart to order.");
            return;
        }

        const estDelivery = totalItems > 4 ? "40–50 mins" : "30–40 mins";

        const newOrder = {
            id: Date.now(),
            userEmail: user ? user.email : "guest@foodninja.com",
            customerName: name.trim(),
            address: address.trim(),
            phone: cleanPhone,
            payment: payment,
            items: items,
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            taxes: taxes,
            total: grandTotal,
            estDelivery: estDelivery,
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

            setConfirmedOrder(newOrder);
        } catch (err) {
            console.error("Order error:", err);
            // Even if offline, proceed with local state
            dispatch(addOrder(newOrder));
            if (!isBuyNow) dispatch(clearCart());
            setConfirmedOrder(newOrder);
        } finally {
            setSubmitting(false);
        }
    };

    // Full Order Confirmation Screen with Complete Bill Calculation
    if (confirmedOrder) {
        return (
            <section className="min-h-[85vh] bg-slate-50 px-4 py-8">
                <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                    {/* Top Status */}
                    <div className="text-center pb-6 border-b border-slate-100">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3 ring-8 ring-emerald-50">
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800">
                            Order Placed Successfully
                        </span>
                        <h1 className="mt-2 text-2xl font-black text-slate-900">
                            Thank You, {confirmedOrder.customerName}!
                        </h1>
                        <p className="mt-1 text-xs text-slate-500">
                            Your order has been confirmed and kitchen preparation has started.
                        </p>
                    </div>

                    {/* Meta Bar */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                            <span className="text-slate-400 font-medium">Order ID: </span>
                            <span className="font-mono font-bold text-slate-800">#{confirmedOrder.id}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-emerald-700">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>Estimated: {confirmedOrder.estDelivery}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-medium">Mode: </span>
                            <span className="font-bold text-slate-800">{confirmedOrder.payment}</span>
                        </div>
                    </div>

                    {/* Delivery Details */}
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs space-y-1">
                        <p className="font-bold text-slate-800">
                            Delivering to: <span className="font-normal text-slate-600">{confirmedOrder.customerName} ({confirmedOrder.phone})</span>
                        </p>
                        <p className="text-slate-600">
                            <span className="font-bold text-slate-800">Address: </span>
                            {confirmedOrder.address}
                        </p>
                    </div>

                    {/* Dishes Ordered */}
                    <div className="mt-5">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Dishes Ordered ({confirmedOrder.items.length})
                        </h2>
                        <div className="divide-y divide-slate-100 border-y border-slate-100">
                            {confirmedOrder.items.map((it, idx) => {
                                const itemPrice = it.price || it.caloriesPerServing || 0;
                                const itemQty = it.quantity || 1;
                                return (
                                    <div key={idx} className="flex items-center justify-between py-2.5 text-xs">
                                        <div className="flex items-center gap-3">
                                            {it.image && (
                                                <img
                                                    src={it.image}
                                                    alt={it.name || it.title}
                                                    className="h-10 w-10 rounded-lg object-cover bg-slate-100 border border-slate-100 shrink-0"
                                                />
                                            )}
                                            <div>
                                                <p className="font-bold text-slate-800">{it.name || it.title}</p>
                                                <p className="text-[11px] text-slate-400">Qty: {itemQty} × ₹{itemPrice}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-800">₹{itemPrice * itemQty}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Complete Bill Calculation */}
                    <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-xs space-y-2">
                        <h3 className="font-bold text-slate-700 pb-1 border-b border-slate-200/60">
                            Bill Details & Calculation
                        </h3>
                        <div className="flex justify-between text-slate-600 pt-1">
                            <span>Item Total</span>
                            <span className="font-bold text-slate-800">₹{confirmedOrder.subtotal || subtotal}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Delivery Partner Fee</span>
                            <span className="font-bold text-slate-800">₹{confirmedOrder.deliveryFee || deliveryFee}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Govt. Taxes (5% GST)</span>
                            <span className="font-bold text-slate-800">₹{confirmedOrder.taxes || taxes}</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-slate-300 pt-2 text-sm font-black text-slate-900">
                            <span>Grand Total</span>
                            <span className="text-base text-emerald-700">₹{confirmedOrder.total}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                        >
                            Explore Food Menu
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/orders")}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            View All Past Orders →
                        </button>
                    </div>
                </div>
            </section>
        );
    }

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
