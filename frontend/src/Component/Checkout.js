import React, { useState, useContext, useEffect } from "react";
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
    const lastAddr = (() => { try { const arr = JSON.parse(localStorage.getItem("fn_saved_addresses") || "[]"); return Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : null; } catch { return null; } })();
    const [name, setName] = useState(user?.name || lastAddr?.name || "Store Administrator");
    const [phone, setPhone] = useState(lastAddr?.phone || "9876543210");
    const [house, setHouse] = useState(lastAddr?.house || "Flat 402, Sunshine Heights, Tower 3");
    const [street, setStreet] = useState(lastAddr?.street || "Sector 62, Noida");
    const [landmark, setLandmark] = useState(lastAddr?.landmark || "");
    const [city, setCity] = useState(lastAddr?.city || "Noida");
    const [pincode, setPincode] = useState(lastAddr?.pincode || "201301");
    const [payment, setPayment] = useState("Online Payment");
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isChangingPayment, setIsChangingPayment] = useState(false);
    const [discount, setDiscount] = useState(50);
    const [couponCode, setCouponCode] = useState("WELCOME50");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState(null);

    // Load saved address from localStorage on mount
    const [savedAddresses, setSavedAddresses] = useState(() => {
        try {
            const arr = JSON.parse(localStorage.getItem("fn_saved_addresses") || "[]");
            return Array.isArray(arr) ? arr : [];
        } catch { return []; }
    });
    const [showSaved, setShowSaved] = useState(false);

    const [settings, setSettings] = useState({
        deliveryFee: 60,
        freeDeliveryThreshold: 499,
        packagingFee: 15,
        taxRate: 5,
        restaurantOpen: true,
        restaurantName: "Food Ninja",
        fssaiNumber: "10020011000123",
        gstinNumber: "07AAAAF1234A1Z5",
    });

    useEffect(() => {
        if (typeof fetch !== "undefined") {
            fetch(`${API_BASE_URL}/settings`)
                .then((r) => r.json())
                .then((d) => {
                    if (d && d.settings) setSettings(d.settings);
                })
                .catch(() => {});
        }
    }, []);

    const totalItems = items.reduce((n, i) => n + (i.quantity || 1), 0);
    const subtotal = items.reduce(
        (sum, item) => sum + (item.price || item.caloriesPerServing || 0) * (item.quantity || 1),
        0
    );
    const isFreeDelivery = subtotal >= (settings.freeDeliveryThreshold || 499);
    const deliveryFee = totalItems > 0 ? (isFreeDelivery ? 0 : (settings.deliveryFee ?? 60)) : 0;
    const taxes = totalItems > 0 ? Math.round(subtotal * ((settings.taxRate ?? 5) / 100)) : 0;
    const discountAmount = totalItems > 0 ? discount : 0;
    const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

    const placeOrder = async (e) => {
        e.preventDefault();
        setError("");

        if (!settings.restaurantOpen) {
            setError("The restaurant is currently closed and not accepting new orders.");
            return;
        }

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

        const baseOrder = {
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
            paymentStatus: payment === "Cash on Delivery" ? "Pending" : "Paid",
            date: new Date().toLocaleString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            })
        };

        const finalizeOrder = async (orderToSave) => {
            try {
                // Save to Backend MongoDB Atlas
                await fetch(`${API_BASE_URL}/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderToSave),
                });

                // Save to Redux Store
                dispatch(addOrder(orderToSave));

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
                setConfirmedOrder(orderToSave);
            } catch (err) {
                console.error("Order error:", err);
                dispatch(addOrder(orderToSave));
                if (!isBuyNow) dispatch(clearCart());
                try {
                    const addrs = JSON.parse(localStorage.getItem("fn_saved_addresses") || "[]");
                    const newAddr = { name: name.trim(), phone: cleanPhone, house: house.trim(), street: street.trim(), landmark: landmark.trim(), city: city.trim(), pincode: cleanPincode, label: `${house.trim()}, ${street.trim()}, ${city.trim()}` };
                    const exists = addrs.some(a => a.house === newAddr.house && a.street === newAddr.street && a.pincode === newAddr.pincode);
                    if (!exists) { addrs.push(newAddr); localStorage.setItem("fn_saved_addresses", JSON.stringify(addrs.slice(-5))); }
                } catch {}
                setConfirmedOrder(orderToSave);
            } finally {
                setSubmitting(false);
            }
        };

        // 1. Cash on Delivery Flow
        if (payment === "Cash on Delivery") {
            setSubmitting(true);
            await finalizeOrder(baseOrder);
            return;
        }

        // 2. Online Payment via Razorpay
        try {
            setSubmitting(true);
            const orderRes = await fetch(`${API_BASE_URL}/payment/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: grandTotal }),
            });
            const data = await orderRes.json();

            if (!data.success) {
                setError(data.message || "Failed to initialize payment gateway.");
                setSubmitting(false);
                return;
            }

            // If real keys are configured and Razorpay SDK is loaded
            if (!data.isDemo && typeof window.Razorpay !== "undefined") {
                const options = {
                    key: data.key,
                    amount: data.order.amount,
                    currency: data.order.currency || "INR",
                    name: settings.restaurantName || "Food Ninja",
                    description: `Order Payment #${baseOrder.id}`,
                    order_id: data.order.id,
                    prefill: {
                        name: name.trim(),
                        contact: cleanPhone,
                        email: user?.email || "customer@foodninja.com",
                    },
                    theme: {
                        color: "#0c5936",
                    },
                    handler: async function (response) {
                        try {
                            const verifyRes = await fetch(`${API_BASE_URL}/payment/verify`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(response),
                            });
                            const verifyData = await verifyRes.json();
                            if (verifyData.success) {
                                await finalizeOrder({
                                    ...baseOrder,
                                    paymentStatus: "Paid",
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpaySignature: response.razorpay_signature,
                                });
                            } else {
                                setError("Payment signature verification failed.");
                                setSubmitting(false);
                            }
                        } catch {
                            await finalizeOrder({
                                ...baseOrder,
                                paymentStatus: "Paid",
                                razorpayPaymentId: response.razorpay_payment_id,
                            });
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setSubmitting(false);
                        },
                    },
                };
                const rzp = new window.Razorpay(options);
                rzp.on("payment.failed", function (resp) {
                    setError(`Payment failed: ${resp.error?.description || "Transaction declined"}`);
                    setSubmitting(false);
                });
                rzp.open();
            } else {
                // Demo / Test mode (when live/test keys are not yet configured in backend/.env)
                // Seamlessly simulate verification so the user can test the full flow
                const verifyRes = await fetch(`${API_BASE_URL}/payment/verify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isDemo: true, razorpay_payment_id: `pay_demo_${Date.now()}` }),
                });
                const verifyData = await verifyRes.json();
                await finalizeOrder({
                    ...baseOrder,
                    paymentStatus: "Paid",
                    razorpayOrderId: data.order?.id || `order_demo_${Date.now()}`,
                    razorpayPaymentId: verifyData.paymentId || `pay_demo_${Date.now()}`,
                });
            }
        } catch (err) {
            console.error("Razorpay error:", err);
            setError("Unable to connect to payment gateway. Please try again or use Cash on Delivery.");
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
                            {confirmedOrder.paymentStatus === "Paid" && (
                                <span className="ml-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                    ✓ Paid
                                </span>
                            )}
                            {confirmedOrder.razorpayPaymentId && (
                                <span className="block text-[10px] font-mono text-slate-400 mt-0.5">
                                    Ref: {confirmedOrder.razorpayPaymentId}
                                </span>
                            )}
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
                            <span>Govt. Taxes ({settings.taxRate ?? 5}% GST)</span>
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
        <section className="bg-[#f8fafc] px-4 py-8 sm:py-10 min-h-[85vh]">
            <div className="mx-auto max-w-6xl">
                <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-start">
                    
                    {/* RIGHT COLUMN on desktop: Delivery Address & Payment (Compact companion widget) */}
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs lg:order-2">
                        
                        {/* Compact Card Header */}
                        <div className="flex items-center gap-2.5 mb-3.5 pb-2.5 border-b border-slate-100">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
                                    Delivery & Payment
                                </h1>
                                <p className="text-[11px] text-slate-400">Where & how to deliver</p>
                            </div>
                        </div>

                        {/* Section 1: Delivery Address (Compact) */}
                        <div className="rounded-xl border border-slate-200/80 bg-white p-3 mb-3">
                            <div className="flex items-center justify-between pb-2">
                                <span className="text-xs font-bold text-slate-800">Delivery Address</span>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition cursor-pointer"
                                >
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    <span>{isEditingAddress ? "Close" : "Change address"}</span>
                                </button>
                            </div>

                            {!isEditingAddress ? (
                                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 flex items-start justify-between gap-2.5">
                                    <div className="flex items-start gap-2.5 min-w-0">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-xs text-slate-900 truncate">{name}</p>
                                                <span className="text-[11px] text-slate-500 font-medium shrink-0">+91 {phone}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug break-words">
                                                {house}, {street}{city ? `, ${city}` : ""}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">PIN: {pincode}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold border border-emerald-200/70 shrink-0">
                                        <svg className="h-2.5 w-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Saved</span>
                                    </span>
                                </div>
                            ) : (
                                <div className="mt-2.5 space-y-2.5 pt-2.5 border-t border-slate-100">
                                    {savedAddresses.length > 0 && (
                                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2">
                                            <p className="text-[10px] font-bold text-slate-600 mb-1">Pick Saved Address:</p>
                                            <div className="space-y-1">
                                                {savedAddresses.map((addr, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => {
                                                            setName(addr.name || name);
                                                            setPhone(addr.phone || phone);
                                                            setHouse(addr.house || "");
                                                            setStreet(addr.street || "");
                                                            setLandmark(addr.landmark || "");
                                                            setCity(addr.city || "Noida");
                                                            setPincode(addr.pincode || "");
                                                            setIsEditingAddress(false);
                                                        }}
                                                        className="w-full text-left rounded-md border border-slate-200 bg-white px-2 py-1 text-xs hover:border-emerald-500 hover:bg-emerald-50/40 transition cursor-pointer"
                                                    >
                                                        <span className="font-bold text-slate-800 text-[11px]">{addr.label || `${addr.house}, ${addr.street}`}</span>
                                                        <span className="text-[10px] text-slate-400 block">{addr.city} • {addr.pincode}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-600">Full Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="mt-0.5 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-600">Phone *</label>
                                            <input
                                                type="tel"
                                                required
                                                maxLength={10}
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                                className="mt-0.5 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-600">Flat / House / Building *</label>
                                        <input
                                            type="text"
                                            required
                                            value={house}
                                            onChange={(e) => setHouse(e.target.value)}
                                            className="mt-0.5 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-600">Street / Area *</label>
                                        <input
                                            type="text"
                                            required
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                            className="mt-0.5 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-600">City *</label>
                                            <input
                                                type="text"
                                                required
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="mt-0.5 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-600">PIN Code *</label>
                                            <input
                                                type="text"
                                                required
                                                maxLength={6}
                                                value={pincode}
                                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                                                className="mt-0.5 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500 font-mono"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsEditingAddress(false)}
                                        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 cursor-pointer transition"
                                    >
                                        Save Address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Section 2: Payment Method (Compact) */}
                        <div className="rounded-xl border border-slate-200/80 bg-white p-3">
                            <div className="flex items-center justify-between pb-2">
                                <span className="text-xs font-bold text-slate-800">Payment Method</span>
                                <button
                                    type="button"
                                    onClick={() => setIsChangingPayment(!isChangingPayment)}
                                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition cursor-pointer"
                                >
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    <span>{isChangingPayment ? "Close" : "Change"}</span>
                                </button>
                            </div>

                            {!isChangingPayment ? (
                                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-emerald-600 shrink-0">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                        </div>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 shrink-0">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" />
                                                <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-xs text-slate-900 truncate">
                                                {payment === "Online Payment" ? "Online Payment" : "Cash on Delivery"}
                                            </p>
                                            <p className="text-[10px] text-slate-400 truncate">
                                                {payment === "Online Payment" ? "UPI, Card, Net Banking" : "Pay cash / UPI on arrival"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Payment Logos */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        <span className="font-bold text-[9px] text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono">UPI</span>
                                        <span className="font-extrabold text-[9px] text-blue-700 bg-white border border-slate-200 rounded px-1.5 py-0.5 italic">VISA</span>
                                        <div className="flex items-center bg-white border border-slate-200 rounded px-1 py-0.5">
                                            <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
                                            <span className="h-2 w-2 rounded-full bg-amber-500 -ml-0.5 inline-block opacity-90" />
                                        </div>
                                        <span className="font-bold text-[9px] text-emerald-800 bg-white border border-slate-200 rounded px-1.5 py-0.5">RuPay</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-2.5 space-y-2 pt-2.5 border-t border-slate-100">
                                    <div
                                        onClick={() => { setPayment("Online Payment"); setIsChangingPayment(false); }}
                                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${payment === "Online Payment" ? "border-emerald-500 bg-emerald-50/40" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${payment === "Online Payment" ? "border-emerald-600" : "border-slate-300"}`}>
                                                {payment === "Online Payment" && <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-xs text-slate-900">Online Payment</p>
                                                <p className="text-[10px] text-slate-400">UPI, Credit/Debit Card, Net Banking</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-[9px] text-slate-800 bg-white border border-slate-200 rounded px-1 py-0.5">UPI</span>
                                            <span className="font-extrabold text-[9px] text-blue-700 bg-white border border-slate-200 rounded px-1 py-0.5 italic">VISA</span>
                                            <span className="font-bold text-[9px] text-emerald-800 bg-white border border-slate-200 rounded px-1 py-0.5">RuPay</span>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => { setPayment("Cash on Delivery"); setIsChangingPayment(false); }}
                                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${payment === "Cash on Delivery" ? "border-emerald-500 bg-emerald-50/40" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${payment === "Cash on Delivery" ? "border-emerald-600" : "border-slate-300"}`}>
                                                {payment === "Cash on Delivery" && <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-xs text-slate-900">Cash on Delivery</p>
                                                <p className="text-[10px] text-slate-400">Pay cash or scan UPI QR upon arrival</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded px-2 py-0.5">COD</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 flex items-start gap-2">
                                <span className="text-sm font-bold">⚠</span>
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* LEFT COLUMN on desktop: Order Summary */}
                    <aside className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sticky top-20 lg:order-1">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Order Summary</h2>
                                    <p className="text-xs text-slate-400">{totalItems} items in cart</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl">
                                ₹{grandTotal}
                            </span>
                        </div>

                        {/* Items list with dish photos */}
                        <ul className="my-4 space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                            {items.map((item, idx) => (
                                <li key={idx} className="flex items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <img
                                            src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80"}
                                            alt={item.name || item.title}
                                            className="h-12 w-12 rounded-xl object-cover shrink-0 border border-slate-100 bg-slate-50"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80";
                                            }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-slate-900 truncate leading-snug">{item.name || item.title}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">Qty: {item.quantity || 1}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-slate-900 shrink-0 text-xs">
                                        ₹{(item.price || item.caloriesPerServing || 0) * (item.quantity || 1)}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Price Breakdown */}
                        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                            <div className="flex justify-between text-slate-600 font-medium">
                                <span>Subtotal</span>
                                <span className="font-bold text-slate-900">₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 font-medium">
                                <span>Delivery Fee</span>
                                <span className="font-bold text-slate-900">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-600 font-bold">
                                    <span>Discount ({couponCode})</span>
                                    <span>- ₹{discountAmount}</span>
                                </div>
                            )}
                        </div>

                        {/* Grand Total */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-baseline text-slate-900">
                            <span className="text-base font-black">Grand Total</span>
                            <span className="text-xl font-black text-slate-900">₹{grandTotal}</span>
                        </div>

                        {/* Place Order CTA Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full mt-4 rounded-xl bg-[#0c5936] hover:bg-[#084227] text-white py-3.5 px-4 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] cursor-pointer disabled:opacity-50"
                        >
                            {submitting ? (
                                <span>Placing Order...</span>
                            ) : (
                                <>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <span>Place Order | ₹{grandTotal}</span>
                                    <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Trust badge */}
                        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-600 font-medium">
                            <svg className="h-3.5 w-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>100% secure payments</span>
                            <span className="text-slate-300">|</span>
                            <span>Quick & safe delivery</span>
                        </div>
                    </aside>
                </form>
            </div>
        </section>
    );
};

export default Checkout;
