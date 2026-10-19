import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cancelOrder } from "../utils/ordersSlice";
import { API_BASE_URL } from "../utils/Constants";
import UserContext from "./Usercontext";

const STEPS = [
    { key: "Placed", label: "Order Placed", desc: "Received by restaurant" },
    { key: "Preparing", label: "Kitchen Preparing", desc: "Chef is crafting your meal" },
    { key: "Out for Delivery", label: "On the Way", desc: "Delivery partner en route" },
    { key: "Delivered", label: "Delivered", desc: "Enjoy your food!" },
];

const getStepIndex = (status) => {
    switch (status) {
        case "Placed":
            return 0;
        case "Preparing":
            return 1;
        case "Out for Delivery":
            return 2;
        case "Delivered":
            return 3;
        default:
            return 0;
    }
};

const getStatusConfig = (status) => {
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
                label: "Order Placed",
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
    const [actionLoading, setActionLoading] = useState(false);

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
            setActionLoading(true);
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
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="min-h-[80vh] bg-slate-50 px-4 py-8">
                <div className="mx-auto max-w-3xl space-y-4 animate-pulse">
                    <div className="h-6 w-36 bg-slate-200 rounded" />
                    <div className="h-44 bg-white border border-slate-200 rounded-2xl p-6" />
                    <div className="h-64 bg-white border border-slate-200 rounded-2xl p-6" />
                </div>
            </section>
        );
    }

    if (!order) {
        return (
            <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-3 text-2xl font-bold">
                        ?
                    </div>
                    <h1 className="text-xl font-black text-slate-900">Order Not Found</h1>
                    <p className="mt-2 text-xs text-slate-500">
                        We couldn't find order #{id}. It may have been removed or you might have entered an invalid URL.
                    </p>
                    <Link
                        to="/orders"
                        className="mt-5 inline-block rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700"
                    >
                        ← Back to My Orders
                    </Link>
                </div>
            </section>
        );
    }

    const isCancelled = order.status === "Cancelled";
    const isDelivered = order.status === "Delivered";
    const stepIndex = getStepIndex(order.status);

    const subtotal = order.subtotal || order.items.reduce(
        (sum, it) => sum + (it.price || it.caloriesPerServing || 0) * (it.quantity || 1),
        0
    );
    const deliveryFee = order.deliveryFee !== undefined ? order.deliveryFee : 30;
    const taxes = order.taxes !== undefined ? order.taxes : Math.round(subtotal * 0.05);
    const grandTotal = order.total || subtotal + deliveryFee + taxes;

    return (
        <section className="min-h-[85vh] bg-slate-50 px-4 py-8 sm:py-10">
            <div className="mx-auto max-w-3xl space-y-6">
                {/* Back Nav & Top Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                        onClick={() => navigate("/orders")}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                    >
                        <span>←</span>
                        <span>Back to All Orders</span>
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                    >
                        <svg className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Print Invoice</span>
                    </button>
                </div>

                {/* Primary Order Tracking Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-black text-slate-900">
                                    Order #{order.id}
                                </h1>
                                {(() => {
                                    const s = getStatusConfig(order.status);
                                    return (
                                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.badge}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                                            <span>{s.label}</span>
                                        </span>
                                    );
                                })()}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Placed on {order.date || "Today"}
                            </p>
                        </div>

                        {!isCancelled && !isDelivered && (
                            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3.5 py-2 text-emerald-800">
                                <svg className="h-5 w-5 animate-pulse text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-emerald-600">Estimated Delivery</p>
                                    <p className="text-xs font-black text-emerald-900">{order.estDelivery || "25–30 mins"}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Live Stepper Tracker */}
                    {isCancelled ? (
                        <div className="my-6 rounded-xl border border-red-200 bg-red-50/70 p-4 flex items-center gap-3.5 text-red-700">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 text-lg font-bold">
                                ✕
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-red-900">Order Was Cancelled</h3>
                                <p className="text-xs text-red-700 mt-0.5">
                                    This order has been cancelled. If any payment was made online, it will be refunded to your original payment method in 24–48 hours.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="my-6 rounded-xl border border-slate-100 bg-slate-50/70 p-5">
                            <div className="flex items-center justify-between relative">
                                {STEPS.map((step, idx) => {
                                    const isCompleted = idx < stepIndex;
                                    const isCurrent = idx === stepIndex;

                                    return (
                                        <div key={step.key} className="flex-1 flex flex-col items-center relative z-10 text-center">
                                            {/* Connector Line */}
                                            {idx > 0 && (
                                                <div
                                                    className={`absolute top-4 -left-1/2 w-full h-1 -z-10 transition-colors ${
                                                        idx <= stepIndex ? "bg-emerald-600" : "bg-slate-200"
                                                    }`}
                                                />
                                            )}

                                            {/* Step Circle */}
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                                                    isCompleted
                                                        ? "bg-emerald-600 text-white"
                                                        : isCurrent
                                                        ? "bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-sm"
                                                        : "border-2 border-slate-300 bg-white text-slate-400"
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <span>{idx + 1}</span>
                                                )}
                                            </div>

                                            {/* Step Label */}
                                            <span
                                                className={`mt-2 text-xs font-bold ${
                                                    isCurrent
                                                        ? "text-emerald-700"
                                                        : isCompleted
                                                        ? "text-slate-800"
                                                        : "text-slate-400"
                                                }`}
                                            >
                                                {step.label}
                                            </span>
                                            <span className="hidden sm:block text-[10px] text-slate-400 mt-0.5">
                                                {step.desc}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Delivery & Recipient Details */}
                    <div className="grid gap-3 sm:grid-cols-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-xs">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recipient Details</span>
                            <p className="mt-1 font-bold text-slate-900 text-sm">{order.customerName}</p>
                            <p className="text-slate-600 mt-0.5">+91 {order.phone}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="font-semibold text-slate-500">Payment:</span>
                                <span className="font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                                    {order.payment}
                                </span>
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Delivery Address</span>
                            <p className="mt-1 text-slate-700 leading-relaxed font-medium">
                                {order.address}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Items Ordered Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
                        Dishes Ordered ({order.items.length})
                    </h2>

                    <div className="divide-y divide-slate-100">
                        {order.items.map((it, idx) => {
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
                                                className="h-16 w-16 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs shrink-0">
                                                Dish
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`inline-block h-3 w-3 rounded-xs border p-0.5 ${
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
                                                <h3 className="text-sm font-bold text-slate-900">
                                                    {it.name || it.title}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-700 text-[11px]">
                                                    Qty: {itemQty}
                                                </span>
                                                <span>₹{itemPrice} each</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-black text-slate-900">
                                            ₹{itemPrice * itemQty}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Complete Bill Calculation & Receipt */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
                        Bill Details & Breakdown
                    </h2>

                    <div className="mt-4 space-y-2.5 text-xs text-slate-600">
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
                        <div className="flex justify-between text-emerald-700">
                            <span>Restaurant Packaging</span>
                            <span className="font-bold uppercase text-[11px]">Free</span>
                        </div>

                        <div className="mt-3 flex justify-between border-t border-dashed border-slate-200 pt-3 text-base font-black text-slate-900">
                            <span>Grand Total Paid</span>
                            <span className="text-emerald-700">₹{grandTotal}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                        <Link
                            to="/contact"
                            className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
                        >
                            Need help with this order? Contact Support →
                        </Link>

                        <div className="flex items-center gap-2.5">
                            {order.status === "Placed" && (
                                <button
                                    onClick={handleCancel}
                                    disabled={actionLoading}
                                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition active:scale-95 disabled:opacity-50"
                                >
                                    {actionLoading ? "Cancelling..." : "Cancel Order"}
                                </button>
                            )}

                            {isDelivered && (
                                <Link
                                    to="/"
                                    className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-emerald-700 transition active:scale-95"
                                >
                                    Order Again
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderDetail;
