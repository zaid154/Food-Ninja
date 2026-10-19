import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cancelOrder } from "../utils/ordersSlice";
import { API_BASE_URL } from "../utils/Constants";
import UserContext from "./Usercontext";

const TIMELINE_STEPS = [
    { key: "Placed", title: "Order Placed", desc: "Received by kitchen" },
    { key: "Preparing", title: "Cooking", desc: "Chef preparing your meal" },
    { key: "Out for Delivery", title: "On the Way", desc: "Rider heading to you" },
    { key: "Delivered", title: "Delivered", desc: "Delivered to your door" },
];

const getStepNumber = (status) => {
    switch (status) {
        case "Placed":
            return 1;
        case "Preparing":
            return 2;
        case "Out for Delivery":
            return 3;
        case "Delivered":
            return 4;
        default:
            return 1;
    }
};

const getStatusBadge = (status) => {
    switch (status) {
        case "Delivered":
            return {
                badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
                dot: "bg-emerald-600",
                label: "Delivered",
            };
        case "Out for Delivery":
            return {
                badge: "bg-sky-50 text-sky-800 border-sky-200",
                dot: "bg-sky-600",
                label: "On the Way",
            };
        case "Preparing":
            return {
                badge: "bg-amber-50 text-amber-800 border-amber-200",
                dot: "bg-amber-600",
                label: "In the Kitchen",
            };
        case "Cancelled":
            return {
                badge: "bg-rose-50 text-rose-800 border-rose-200",
                dot: "bg-rose-600",
                label: "Cancelled",
            };
        default:
            return {
                badge: "bg-slate-100 text-slate-800 border-slate-200",
                dot: "bg-slate-600",
                label: "Order Confirmed",
            };
    }
};

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useContext(UserContext);

    const localOrders = useSelector((store) => store.orders.list);
    const [order, setOrder] = useState(() => {
        const reduxMatch = localOrders.find((o) => String(o.id) === String(id));
        if (reduxMatch) return reduxMatch;
        try {
            const saved = JSON.parse(localStorage.getItem("orders") || "[]");
            return saved.find((o) => String(o.id) === String(id)) || null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(!order);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadOrder = async () => {
            try {
                // 1. Try single order endpoint
                const res = await fetch(`${API_BASE_URL}/orders/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && data.order) {
                        setOrder(data.order);
                        setLoading(false);
                        return;
                    }
                }

                // 2. Try all orders endpoint (without email restriction for guest/local orders)
                const listRes = await fetch(`${API_BASE_URL}/orders`);
                if (listRes.ok) {
                    const listData = await listRes.json();
                    const matched = (listData.orders || []).find((o) => String(o.id) === String(id));
                    if (isMounted && matched) {
                        setOrder(matched);
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.warn("Could not fetch remote order:", err);
            }

            // 3. Fallback: Local Redux & localStorage
            if (isMounted) {
                const reduxMatch = localOrders.find((o) => String(o.id) === String(id));
                if (reduxMatch) {
                    setOrder(reduxMatch);
                } else {
                    try {
                        const saved = JSON.parse(localStorage.getItem("orders") || "[]");
                        const storageMatch = saved.find((o) => String(o.id) === String(id));
                        if (storageMatch) setOrder(storageMatch);
                    } catch {}
                }
                setLoading(false);
            }
        };

        loadOrder();
        return () => {
            isMounted = false;
        };
    }, [id, user, localOrders]);

    const handleCancel = async () => {
        if (!order || order.status !== "Placed") return;
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            setCancelling(true);
            await fetch(`${API_BASE_URL}/orders/${order.id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Cancelled" }),
            });
            dispatch(cancelOrder(order.id));
            setOrder((prev) => (prev ? { ...prev, status: "Cancelled" } : null));
        } catch (err) {
            console.error("Failed to cancel order:", err);
            dispatch(cancelOrder(order.id));
            setOrder((prev) => (prev ? { ...prev, status: "Cancelled" } : null));
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <section className="min-h-[80vh] bg-slate-50 px-4 py-8">
                <div className="mx-auto max-w-5xl space-y-4 animate-pulse">
                    <div className="h-6 w-36 bg-slate-200 rounded" />
                    <div className="h-32 bg-white border border-slate-200 rounded-2xl" />
                    <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
                        <div className="h-96 bg-white border border-slate-200 rounded-2xl" />
                        <div className="h-64 bg-white border border-slate-200 rounded-2xl" />
                    </div>
                </div>
            </section>
        );
    }

    if (!order) {
        return (
            <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
                    <h1 className="text-xl font-bold text-slate-900">Order Not Found</h1>
                    <p className="mt-2 text-xs text-slate-500">
                        We could not find order #{id}. It may have been placed in another session or removed.
                    </p>
                    <Link
                        to="/orders"
                        className="mt-5 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
                    >
                        ← Back to My Orders
                    </Link>
                </div>
            </section>
        );
    }

    const isCancelled = order.status === "Cancelled";
    const isDelivered = order.status === "Delivered";
    const currentStep = getStepNumber(order.status);
    const statusInfo = getStatusBadge(order.status);

    const subtotal = order.subtotal || (order.items || []).reduce(
        (sum, it) => sum + (it.price || it.caloriesPerServing || 0) * (it.quantity || 1),
        0
    );
    const deliveryFee = order.deliveryFee !== undefined ? order.deliveryFee : 30;
    const taxes = order.taxes !== undefined ? order.taxes : Math.round(subtotal * 0.05);
    const grandTotal = order.total || subtotal + deliveryFee + taxes;

    return (
        <section className="min-h-[85vh] bg-slate-50/70 px-4 pt-6 pb-16">
            <div className="mx-auto max-w-5xl space-y-4">
                {/* Breadcrumb & Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                        onClick={() => navigate("/orders")}
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                    >
                        <span>←</span>
                        <span>Back to All Orders</span>
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                    >
                        <svg className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Print Invoice</span>
                    </button>
                </div>

                {/* Hero Live Status Banner (Swiggy / Zomato Real-Time Header) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                    {isDelivered
                                        ? "Order Delivered 🎉"
                                        : isCancelled
                                        ? "Order Cancelled"
                                        : "Order Confirmed & Preparing"}
                                </h1>
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.badge}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                                    <span>{statusInfo.label}</span>
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                {isDelivered
                                    ? "Food Ninja Express delivered your food. Enjoy your meal!"
                                    : isCancelled
                                    ? "This order was cancelled."
                                    : `Food Ninja Kitchen has confirmed your order. Arriving in ${order.estDelivery || "25–30 mins"}.`}
                            </p>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Order ID</p>
                            <p className="font-mono text-sm font-bold text-slate-800">#{order.id}</p>
                        </div>
                    </div>

                    {/* Realistic Stepper Progress Tracker */}
                    {!isCancelled && (
                        <div className="mt-5 pt-1">
                            <div className="relative">
                                {/* Track lines */}
                                <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-0" />
                                <div
                                    className="absolute top-4 left-6 h-1 bg-emerald-600 transition-all duration-500 -z-0"
                                    style={{
                                        width: `calc(${((currentStep - 1) / 3) * 100}% - 3rem)`,
                                    }}
                                />

                                <div className="flex justify-between relative z-10">
                                    {TIMELINE_STEPS.map((step, idx) => {
                                        const stepNum = idx + 1;
                                        const isDone = stepNum <= currentStep;
                                        const isCurrent = stepNum === currentStep;

                                        return (
                                            <div key={step.key} className="flex flex-col items-center text-center max-w-[80px] sm:max-w-[120px]">
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                                                        isDone
                                                            ? "bg-emerald-600 text-white shadow-2xs"
                                                            : "border-2 border-slate-200 bg-white text-slate-400"
                                                    }`}
                                                >
                                                    {isDone ? "✓" : stepNum}
                                                </div>
                                                <p
                                                    className={`mt-2 text-xs font-semibold ${
                                                        isCurrent
                                                            ? "text-emerald-700 font-bold"
                                                            : isDone
                                                            ? "text-slate-800"
                                                            : "text-slate-400"
                                                    }`}
                                                >
                                                    {step.title}
                                                </p>
                                                <p className="hidden sm:block text-[10px] text-slate-400 mt-0.5 leading-tight">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Real-World 2-Column Section */}
                <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr] items-start">
                    {/* LEFT COLUMN: Authentic Restaurant Receipt */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
                        {/* Restaurant Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-black text-sm">
                                    FN
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Food Ninja Kitchen</h2>
                                    <p className="text-xs text-slate-400">North Indian, Mughlai, Fast Food • Express Delivery</p>
                                </div>
                            </div>
                            <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                                ★ 4.6
                            </span>
                        </div>

                        {/* Itemized Food Dishes */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2">
                                Items Ordered ({order.items ? order.items.length : 0})
                            </h3>
                            <div className="divide-y divide-slate-100">
                                {(order.items || []).map((it, idx) => {
                                    const itemPrice = it.price || it.caloriesPerServing || 0;
                                    const itemQty = it.quantity || 1;
                                    const isVeg = it.isVeg !== false && it.dietary !== "Non-Veg";

                                    return (
                                        <div key={idx} className="flex items-center justify-between gap-3 py-3">
                                            <div className="flex items-center gap-3">
                                                {/* Standard Veg / Non-Veg Icon */}
                                                <span
                                                    className={`inline-flex h-4 w-4 items-center justify-center rounded-xs border p-0.5 shrink-0 ${
                                                        isVeg ? "border-emerald-600" : "border-rose-600"
                                                    }`}
                                                    title={isVeg ? "Pure Veg" : "Non-Veg"}
                                                >
                                                    <span className={`h-2 w-2 rounded-full ${isVeg ? "bg-emerald-600" : "bg-rose-600"}`} />
                                                </span>

                                                {/* Dish Image Thumbnail */}
                                                {it.image && (
                                                    <img
                                                        src={it.image}
                                                        alt={it.name || it.title}
                                                        className="h-11 w-11 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                                                        onError={(e) => {
                                                            e.target.style.display = "none";
                                                        }}
                                                    />
                                                )}

                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-800">
                                                        {it.name || it.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-400">
                                                        {itemQty} × ₹{itemPrice}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="text-sm font-bold text-slate-900">
                                                ₹{itemPrice * itemQty}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bill Details Breakdown */}
                        <div className="border-t border-slate-100 pt-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3">
                                Bill Details
                            </h3>
                            <div className="space-y-2 text-xs text-slate-600">
                                <div className="flex justify-between">
                                    <span>Item Total</span>
                                    <span className="font-semibold text-slate-800">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Partner Fee</span>
                                    <span className="font-semibold text-slate-800">₹{deliveryFee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Govt. Taxes (5% GST)</span>
                                    <span className="font-semibold text-slate-800">₹{taxes}</span>
                                </div>
                                <div className="flex justify-between text-emerald-700 font-medium">
                                    <span>Restaurant Packaging Charges</span>
                                    <span className="text-[11px] font-bold uppercase">Free</span>
                                </div>

                                <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-bold text-slate-900">
                                    <span>Grand Total</span>
                                    <span className="text-base text-slate-900">₹{grandTotal}</span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs">
                                <span className="text-slate-500 font-medium">Payment Mode</span>
                                <span className="font-bold text-slate-800">
                                    {order.payment || "Cash on Delivery"} {isDelivered ? "(Paid)" : "(Pay on Delivery)"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Delivery Info & Actions */}
                    <div className="space-y-4">
                        {/* Delivery Address Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h3 className="text-sm font-bold text-slate-900">Delivery Address</h3>
                            </div>
                            <div className="text-xs space-y-1">
                                <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
                                <p className="text-slate-500 font-mono">+91 {order.phone}</p>
                                <p className="text-slate-600 leading-relaxed pt-1 font-medium">
                                    {order.address}
                                </p>
                            </div>
                        </div>

                        {/* Order Metadata Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-sm font-bold text-slate-900">Order Summary</h3>
                            </div>
                            <div className="text-xs space-y-2 text-slate-600">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Order ID:</span>
                                    <span className="font-mono font-bold text-slate-800">#{order.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Date Placed:</span>
                                    <span className="font-medium text-slate-700">{order.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Delivery Partner:</span>
                                    <span className="font-medium text-slate-700">Food Ninja Express</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5">
                            {order.status === "Placed" && (
                                <button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className="w-full rounded-xl border border-rose-300 bg-white py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 transition active:scale-95 disabled:opacity-50"
                                >
                                    {cancelling ? "Cancelling Order..." : "Cancel Order"}
                                </button>
                            )}

                            {isDelivered && (
                                <Link
                                    to="/"
                                    className="block w-full rounded-xl bg-emerald-600 py-2.5 text-center text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition active:scale-95"
                                >
                                    Reorder Food
                                </Link>
                            )}

                            <Link
                                to="/contact"
                                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                            >
                                <svg className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>Need Help with Order?</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderDetail;
