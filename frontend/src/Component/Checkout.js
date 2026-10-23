import React, { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../utils/cartSlice";
import { addOrder } from "../utils/ordersSlice";
import UserContext from "./Usercontext";
import { API_BASE_URL } from "../utils/Constants";

// Validation helper to detect fake keyboard spam / gibberish
const isGibberish = (str) => {
    if (!str) return false;
    const clean = str.trim().toLowerCase();
    // 4+ repeated consecutive identical characters (e.g. "aaaaaa", "111111")
    if (/(.)\1{3,}/.test(clean)) return true;
    // 6+ consecutive consonants without vowel or space (e.g. "ndjuhjdhjsdjas", "asdfghjkl")
    if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(clean)) return true;
    // Common fake patterns
    if (/^(na|n\/a|none|null|nil|test|fake|asdf|qwerty|zxcv)$/i.test(clean)) return true;
    return false;
};

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

    // Structured address fields to ensure 100% valid delivery information
    // Auto-fill from last saved address
    const lastAddr = (() => { try { const arr = JSON.parse(localStorage.getItem("fn_saved_addresses") || "[]"); return arr.length > 0 ? arr[arr.length - 1] : null; } catch { return null; } })();
    const [name, setName] = useState(user ? user.name : (lastAddr?.name || ""));
    const [phone, setPhone] = useState(lastAddr?.phone || "");
    const [house, setHouse] = useState(lastAddr?.house || "");
    const [street, setStreet] = useState(lastAddr?.street || "");
    const [landmark, setLandmark] = useState(lastAddr?.landmark || "");
    const [city, setCity] = useState(lastAddr?.city || "Delhi NCR");
    const [pincode, setPincode] = useState(lastAddr?.pincode || "");
    const [payment, setPayment] = useState("Cash on Delivery");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState(null);

    // Load saved address from localStorage on mount
    const [savedAddresses, setSavedAddresses] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("fn_saved_addresses") || "[]");
        } catch { return []; }
    });
    const [showSaved, setShowSaved] = useState(false);

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
        setError("");

        // 1. Validate Name
        if (!name.trim() || name.trim().length < 3 || isGibberish(name)) {
            setError("Please enter a valid full name (minimum 3 letters).");
            return;
        }

        // 2. Validate Indian Mobile Number (10 digits starting with 6, 7, 8, or 9)
        const cleanPhone = phone.replace(/\D/g, "");
        if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
            setError("Please enter a valid 10-digit mobile number (e.g. 9876543210).");
            return;
        }

        // 3. Validate House / Flat details
        if (!house.trim() || house.trim().length < 2 || isGibberish(house)) {
            setError("Please enter a valid Flat / House / Building details (e.g. Flat 302, Tower B).");
            return;
        }

        // 4. Validate Street / Locality
        if (!street.trim() || street.trim().length < 4 || isGibberish(street)) {
            setError("Please enter a valid Street / Area / Locality (e.g. Sector 62, MG Road).");
            return;
        }

        // 5. Validate City
        if (!city.trim() || city.trim().length < 3 || isGibberish(city)) {
            setError("Please enter a valid City / Town name (e.g. Delhi NCR, Noida).");
            return;
        }

        // 6. Validate 6-digit PIN code
        const cleanPincode = pincode.trim();
        if (!/^[1-9][0-9]{5}$/.test(cleanPincode)) {
            setError("Please enter a valid 6-digit Indian PIN code (e.g. 110001, 201301).");
            return;
        }

        if (items.length === 0) {
            setError("No items in cart to order.");
            return;
        }

        const fullAddress = `${house.trim()}, ${street.trim()}${landmark.trim() ? `, Near ${landmark.trim()}` : ""}, ${city.trim()} - ${cleanPincode}`;
        const estDelivery = totalItems > 4 ? "40–50 mins" : "25–30 mins";

        const newOrder = {
            id: Date.now(),
            userEmail: user ? user.email : "foodninja@gmail.com",
            customerName: name.trim(),
            address: fullAddress,
            phone: cleanPhone,
            payment: payment,
            items: items,
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            taxes: taxes,
            total: grandTotal,
            estDelivery: estDelivery,
            status: "Placed",
            date: new Date().toLocaleString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            })
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

            // Save address for future auto-fill
            try {
                const addrs = JSON.parse(localStorage.getItem("fn_saved_addresses") || "[]");
                const newAddr = { name: name.trim(), phone: cleanPhone, house: house.trim(), street: street.trim(), landmark: landmark.trim(), city: city.trim(), pincode: cleanPincode, label: `${house.trim()}, ${street.trim()}, ${city.trim()}` };
                const exists = addrs.some(a => a.house === newAddr.house && a.street === newAddr.street && a.pincode === newAddr.pincode);
                if (!exists) { addrs.push(newAddr); localStorage.setItem("fn_saved_addresses", JSON.stringify(addrs.slice(-5))); }
            } catch {}
            setConfirmedOrder(newOrder);
        } catch (err) {
            console.error("Order error:", err);
            // Fallback: save to local store even if offline
            dispatch(addOrder(newOrder));
            if (!isBuyNow) dispatch(clearCart());
            try {
                const addrs = JSON.parse(localStorage.getItem("fn_saved_addresses") || "[]");
                const newAddr = { name: name.trim(), phone: cleanPhone, house: house.trim(), street: street.trim(), landmark: landmark.trim(), city: city.trim(), pincode: cleanPincode, label: `${house.trim()}, ${street.trim()}, ${city.trim()}` };
                const exists = addrs.some(a => a.house === newAddr.house && a.street === newAddr.street && a.pincode === newAddr.pincode);
                if (!exists) { addrs.push(newAddr); localStorage.setItem("fn_saved_addresses", JSON.stringify(addrs.slice(-5))); }
            } catch {}
            setConfirmedOrder(newOrder);
        } finally {
            setSubmitting(false);
        }
    };

    // Full Order Confirmation Screen with Direct Tracking Button
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

                    {/* Delivery Address Summary */}
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs">
                        <p className="font-bold text-slate-700">Delivery Address:</p>
                        <p className="mt-0.5 text-slate-600">{confirmedOrder.address}</p>
                        <p className="mt-1 text-slate-500 text-[11px]">Phone: +91 {confirmedOrder.phone}</p>
                    </div>

                    {/* Bill Breakdown */}
                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Payment Summary
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
                        <Link
                            to={`/orders/${confirmedOrder.id}`}
                            className="flex-1 rounded-xl bg-emerald-600 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 flex items-center justify-center gap-1.5"
                        >
                            <span>Track Order Details</span>
                            <span>→</span>
                        </Link>
                        <Link
                            to="/orders"
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            View All Past Orders
                        </Link>
                        <Link
                            to="/"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                        >
                            Menu
                        </Link>
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
                    <Link
                        to="/"
                        className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700"
                    >
                        Explore Food Menu
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-slate-50 px-4 py-8 sm:py-10 min-h-[85vh]">
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.25fr_1fr]">
                {/* Structured Delivery Form */}
                <form onSubmit={placeOrder} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                            <h1 className="text-xl font-black text-slate-900">
                                Delivery & Payment
                            </h1>
                            <p className="text-xs text-slate-500 mt-0.5">Please provide where you want your food delivered.</p>
                        </div>
                        {isBuyNow && (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                                Instant Order
                            </span>
                        )}
                    </div>

                    {/* Saved Addresses Quick-Fill */}
                    {savedAddresses.length > 0 && (
                        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-3">
                            <button type="button" onClick={() => setShowSaved(!showSaved)} className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                                <span className="flex items-center gap-1.5">
                                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    Saved Addresses ({savedAddresses.length})
                                </span>
                                <span className="text-slate-400">{showSaved ? "Hide" : "Show"}</span>
                            </button>
                            {showSaved && (
                                <div className="mt-2 space-y-1.5">
                                    {savedAddresses.map((addr, idx) => (
                                        <button key={idx} type="button" onClick={() => {
                                            setName(addr.name || name); setPhone(addr.phone || phone);
                                            setHouse(addr.house || ""); setStreet(addr.street || "");
                                            setLandmark(addr.landmark || ""); setCity(addr.city || "Delhi NCR");
                                            setPincode(addr.pincode || ""); setShowSaved(false);
                                        }} className="w-full text-left rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/40 transition cursor-pointer">
                                            <p className="font-bold text-slate-800">{addr.label || `${addr.house}, ${addr.street}`}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{addr.city} - {addr.pincode} | {addr.phone}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-5 space-y-4">
                        {/* Name and Mobile Grid */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Mohd Zaid"
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 transition"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Phone Number *</label>
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-bold text-slate-500">
                                        +91
                                    </span>
                                    <input
                                        type="tel"
                                        required
                                        maxLength={10}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                        className="w-full rounded-lg border border-slate-300 pl-11 pr-3 py-2 text-sm outline-none focus:border-emerald-500 transition"
                                        placeholder="10-digit mobile"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Flat / House No */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                Flat / House / Floor / Building *
                            </label>
                            <input
                                type="text"
                                required
                                value={house}
                                onChange={(e) => setHouse(e.target.value)}
                                placeholder="e.g. Flat 402, Sunshine Heights, Tower 3"
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 transition"
                            />
                        </div>

                        {/* Street / Locality */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                Street / Area / Locality *
                            </label>
                            <input
                                type="text"
                                required
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                placeholder="e.g. Sector 62, Near Metro Station"
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 transition"
                            />
                        </div>

                        {/* Landmark */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                Landmark (Optional)
                            </label>
                            <input
                                type="text"
                                value={landmark}
                                onChange={(e) => setLandmark(e.target.value)}
                                placeholder="e.g. Opposite City Hospital or Apollo Pharmacy"
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 transition"
                            />
                        </div>

                        {/* City and 6-digit Pincode Grid */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    City / Town *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="e.g. Delhi NCR, Noida, Gurugram"
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 transition"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    6-Digit PIN Code *
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                                    placeholder="e.g. 110001 or 201301"
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 transition font-mono"
                                />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Payment Method</label>
                            <div className="mt-1 flex items-center justify-between rounded-lg border-2 border-emerald-500 bg-emerald-50/60 p-3">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white font-bold">✓</span>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Cash on Delivery / Pay on Arrival</p>
                                        <p className="text-[11px] text-slate-500">Pay with Cash, UPI, or Card upon food arrival</p>
                                    </div>
                                </div>
                                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Only Available</span>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs font-semibold text-red-700 flex items-start gap-2">
                                <span className="text-sm font-bold">⚠</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                        >
                            {submitting ? "Placing Order..." : `Confirm & Place Order — ₹${grandTotal}`}
                        </button>
                    </div>
                </form>

                {/* Order Summary */}
                <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
                    <h2 className="text-sm font-black text-slate-900 pb-3 border-b border-slate-100">Order Summary</h2>

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
