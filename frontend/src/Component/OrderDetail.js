import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cancelOrder } from "../utils/ordersSlice";
import { API_BASE_URL } from "../utils/Constants";
import UserContext from "./Usercontext";

const TIMELINE_STEPS = [
    { key: "Placed", title: "Order Placed", desc: "Received and acknowledged" },
    { key: "Preparing", title: "In the Kitchen", desc: "Chef is preparing your food" },
    { key: "Out for Delivery", title: "Out for Delivery", desc: "Rider on the way" },
    { key: "Delivered", title: "Delivered", desc: "Delivered to your address" },
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
                label: "Preparing in Kitchen",
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
        return localOrders.find((o) => String(o.id) === String(id)) || null;
    });
    const [loading, setLoading] = useState(!order);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadOrder = async () => {
            try {
                // Try fetching single order from backend
                const res = await fetch(`${API_BASE_URL}/orders/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && data.order) {
                        setOrder(data.order);
                        setLoading(false);
                        return;
                    }
                }

                // Fallback: fetch user's orders list
                const userEmail = user?.email || "guest@foodninja.com";
                const listRes = await fetch(`${API_BASE_URL}/orders?email=${userEmail}`);
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
                console.warn("Could not fetch remote order, using local store:", err);
            }

            if (isMounted) {
                const localMatch = localOrders.find((o) => String(o.id) === String(id));
                if (localMatch) setOrder(localMatch);
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
                    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                        <div className="h-96 bg-white border border-slate-200 rounded-xl" />
                        <div className="h-64 bg-white border border-slate-200 rounded-xl" />
                    </div>
                </div>
            </section>
        );
    }

    if (!order) {
        return (
            <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs">
                    <h1 className="text-xl font-bold text-slate-900">Order Not Found</h1>
                    <p className="mt-2 text-xs text-slate-500">
                        We could not find order #{id}. It may have been placed in another session or removed.
                    </p>
                    <Link
                        to="/orders"
                        className="mt-5 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
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
        <section className="min-h-[85vh] bg-slate-50 px-4 pt-6 pb-16">
            <div className="mx-auto max-w-5xl space-y-5">
                {/* Breadcrumb Header */}
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
                        <span>Download Invoice</span>
                    </button>
                </div>

                {/* Real-World 2-Column Layout */}
                <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] items-start">
                    {/* LEFT COLUMN: Live Status, Dishes & Bill Summary */}
                    <div className="space-y-5">
                        {/* Status & Live Tracker Card */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs">
                            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                            Order #{order.id}
                                        </h1>
                                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.badge}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                                            <span>{statusInfo.label}</span>
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Placed on {order.date}
                                    </p>
                                </div>

                                {!isCancelled && !isDelivered && (
                                    <div className="text-right">
                                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Estimated Arrival</span>
                                        <span className="text-sm font-bold text-slate-900">{order.estDelivery || "25–30 mins"}</span>
                                    </div>
                                )}
                            </div>

                            {/* Realistic Live Delivery Progress Bar */}
                            {isCancelled ? (
                                <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50/70 p-4 text-xs text-rose-800">
                                    <p className="font-bold">This order was cancelled</p>
                                    <p className="mt-0.5 text-[11px] text-rose-600">
                                        If you made an online payment, your refund will be processed back to the original source in 24–48 hours.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-5">
                                    {/* Progress Step Bar */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {TIMELINE_STEPS.map((step, idx) => {
                                            const stepNum = idx + 1;
                                            const isDone = stepNum <= currentStep;
                                            const isCurrent = stepNum === currentStep;

                                            return (
                                                <div key={step.key} className="space-y-1.5">
                                                    <div
                                                        className={`h-1.5 rounded-full transition-colors ${
                                                            isDone ? "bg-emerald-600" : "bg-slate-200"
                                                        }`}
                                                    />
                                                    <p
                                                        className={`text-xs font-semibold ${
                                                            isCurrent
                                                                ? "text-emerald-700"
                                                                : isDone
                                                                ? "text-slate-800"
                                                                : "text-slate-400"
                                                        }`}
                                                    >
                                                        {step.title}
                                                    </p>
                                                    <p className="hidden sm:block text-[10px] text-slate-400 leading-tight">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Items Ordered Card */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h2 className="text-sm font-bold text-slate-900">
                                    Items Ordered ({order.items ? order.items.length : 0})
                                </h2>
                                <span className="text-xs text-slate-400 font-mono">
                                    Food Ninja Kitchen
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {(order.items || []).map((it, idx) => {
                                    const itemPrice = it.price || it.caloriesPerServing || 0;
                                    const itemQty = it.quantity || 1;
                                    const isVeg = it.isVeg !== false && it.dietary !== "Non-Veg";

                                    return (
                                        <div key={idx} className="flex items-center justify-between gap-4 py-3.5">
                                            <div className="flex items-center gap-3.5">
                                                {/* Dish Image */}
                                                {it.image ? (
                                                    <img
                                                        src={it.image}
                                                        alt={it.name || it.title}
                                                        className="h-14 w-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                                                        onError={(e) => {
                                                            e.target.style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-slate-500 font-bold text-xs shrink-0">
                                                        Dish
                                                    </div>
                                                )}

                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`inline-block h-3.5 w-3.5 rounded-xs border p-0.5 shrink-0 ${
                                                                isVeg ? "border-emerald-600" : "border-red-600"
                                                            }`}
                                                            title={isVeg ? "Pure Veg" : "Non-Veg"}
                                                        >
                                                            <span
                                                                className={`block h-full w-full rounded-full ${
                                                                    isVeg ? "bg-emerald-600" : "bg-red-600"
                                                                }`}
                                                            />
                                                        </span>
                                                        <h3 className="text-sm font-semibold text-slate-900">
                                                            {it.name || it.title}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                        <span>Qty: {itemQty}</span>
                                                        <span>•</span>
                                                        <span>₹{itemPrice} each</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-900">
                                                    ₹{itemPrice * itemQty}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bill Breakdown Card */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs">
                            <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                                Bill Summary
                            </h2>

                            <div className="mt-3.5 space-y-2 text-xs text-slate-600">
                                <div className="flex justify-between">
                                    <span>Item Total</span>
                                    <span className="font-semibold text-slate-900">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Partner Fee</span>
                                    <span className="font-semibold text-slate-900">₹{deliveryFee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Govt. Taxes (5% GST)</span>
                                    <span className="font-semibold text-slate-900">₹{taxes}</span>
                                </div>
                                <div className="flex justify-between text-emerald-700">
                                    <span>Restaurant Packaging</span>
                                    <span className="font-semibold uppercase text-[11px]">Free</span>
                                </div>

                                <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-sm font-bold text-slate-900">
                                    <span>Grand Total Paid</span>
                                    <span className="text-base text-slate-900">₹{grandTotal}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Delivery Info, Payment & Support Actions */}
                    <div className="space-y-5">
                        {/* Delivery Address Card */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h2 className="text-sm font-bold text-slate-900">
                                    Delivery Address
                                </h2>
                            </div>

                            <div className="mt-3 text-xs space-y-1.5">
                                <p className="font-bold text-slate-900">{order.customerName}</p>
                                <p className="text-slate-500 font-mono">+91 {order.phone}</p>
                                <p className="text-slate-600 leading-relaxed pt-1">
                                    {order.address}
                                </p>
                            </div>
                        </div>

                        {/* Payment Details Card */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <h2 className="text-sm font-bold text-slate-900">
                                    Payment Method
                                </h2>
                            </div>

                            <div className="mt-3 text-xs space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Method</span>
                                    <span className="font-semibold text-slate-900">{order.payment || "Cash on Delivery"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Status</span>
                                    <span className="font-semibold text-emerald-700">
                                        {isDelivered ? "Paid" : "Pay on Delivery"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Actions & Help */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                            {order.status === "Placed" && (
                                <button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className="w-full rounded-lg border border-rose-300 bg-white py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition active:scale-95 disabled:opacity-50"
                                >
                                    {cancelling ? "Cancelling..." : "Cancel Order"}
                                </button>
                            )}

                            {isDelivered && (
                                <Link
                                    to="/"
                                    className="block w-full rounded-lg bg-emerald-600 py-2.5 text-center text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition active:scale-95"
                                >
                                    Order Again
                                </Link>
                            )}

                            <Link
                                to="/contact"
                                className="block text-center text-xs font-medium text-slate-500 hover:text-slate-900 transition pt-1"
                            >
                                Need help with this order? Contact Support →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderDetail;
