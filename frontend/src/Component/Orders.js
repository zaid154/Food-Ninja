import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cancelOrder } from "../utils/ordersSlice";
import UserContext from "./Usercontext";
import { API_BASE_URL } from "../utils/Constants";

const statusBadge = (status) => {
    switch (status) {
        case "Delivered":
            return "bg-emerald-50 text-emerald-800 border-emerald-200";
        case "Out for Delivery":
            return "bg-sky-50 text-sky-800 border-sky-200";
        case "Preparing":
            return "bg-amber-50 text-amber-800 border-amber-200";
        case "Cancelled":
            return "bg-red-50 text-red-800 border-red-200";
        default:
            return "bg-indigo-50 text-indigo-800 border-indigo-200";
    }
};

const Orders = () => {
    const localOrders = useSelector((store) => store.orders.list);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const userEmailParam = user && user.email ? user.email : "guest@foodninja.com";
            const res = await fetch(`${API_BASE_URL}/orders?email=${userEmailParam}`);
            const data = await res.json();
            if (data.orders && data.orders.length > 0) {
                setOrders(data.orders);
            } else {
                setOrders(localOrders);
            }
        } catch (err) {
            setOrders(localOrders);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user, localOrders]);

    const handleCancel = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await fetch(`${API_BASE_URL}/orders/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Cancelled" }),
            });
            dispatch(cancelOrder(id));
            setOrders((prev) =>
                prev.map((o) => (o.id === id ? { ...o, status: "Cancelled" } : o))
            );
        } catch (err) {
            dispatch(cancelOrder(id));
            setOrders((prev) =>
                prev.map((o) => (o.id === id ? { ...o, status: "Cancelled" } : o))
            );
        }
    };

    const filteredOrders = orders.filter((o) => {
        if (filterStatus === "active") {
            if (o.status === "Delivered" || o.status === "Cancelled") return false;
        } else if (filterStatus === "delivered") {
            if (o.status !== "Delivered") return false;
        } else if (filterStatus === "cancelled") {
            if (o.status !== "Cancelled") return false;
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const idMatch = String(o.id).toLowerCase().includes(q);
            const dishMatch = o.items && o.items.some((it) => (it.name || it.title || "").toLowerCase().includes(q));
            return idMatch || dishMatch;
        }

        return true;
    });

    if (loading) {
        return (
            <section className="bg-slate-50 px-4 py-8 sm:py-10 min-h-[85vh]">
                <div className="mx-auto max-w-4xl space-y-4 animate-pulse">
                    <div className="h-7 w-40 bg-slate-200 rounded" />
                    <div className="h-4 w-60 bg-slate-100 rounded" />
                    <div className="space-y-4 pt-4">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="rounded-2xl border border-slate-200 bg-white p-5 h-36" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (orders.length === 0) {
        return (
            <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">No Orders Placed Yet</h1>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                        You haven't ordered any food yet. Browse our chef-crafted menu and order your favorite dishes!
                    </p>
                    <Link
                        to="/"
                        className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                    >
                        Explore Food Menu
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-slate-50 px-4 py-8 sm:py-10 min-h-[85vh]">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
                            <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                                {orders.length}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Order summary and history. Click any order to view tracking and complete bill details.
                        </p>
                    </div>

                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-slate-50 transition"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                        {[
                            { key: "all", label: "All Orders" },
                            { key: "active", label: "Active" },
                            { key: "delivered", label: "Delivered" },
                            { key: "cancelled", label: "Cancelled" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setFilterStatus(tab.key)}
                                className={`rounded-lg px-3 py-1.5 font-bold transition ${
                                    filterStatus === tab.key
                                        ? "bg-slate-900 text-white"
                                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-60">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by ID or dish..."
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Orders Overview List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-500">
                            No orders matching your filter.
                        </div>
                    ) : (
                        filteredOrders.map((order) => {
                            const totalQty = (order.items || []).reduce((n, it) => n + (it.quantity || 1), 0);
                            const firstItem = order.items && order.items[0];
                            const firstItemName = firstItem ? firstItem.name || firstItem.title : "Dishes";
                            const itemsSummary =
                                (order.items || []).length > 1
                                    ? `${firstItemName} + ${order.items.length - 1} more item${order.items.length > 2 ? "s" : ""}`
                                    : `${firstItemName} (Qty: ${totalQty})`;

                            return (
                                <div
                                    key={order.id}
                                    onClick={() => navigate(`/orders/${order.id}`)}
                                    className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-emerald-300 hover:shadow-md"
                                >
                                    {/* Top Row: Order ID, Date, Status */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                                                #{order.id}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {order.date}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {order.status !== "Delivered" && order.status !== "Cancelled" && (
                                                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                    Est: {order.estDelivery || "25–30 mins"}
                                                </span>
                                            )}
                                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusBadge(order.status)}`}>
                                                ● {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Middle Row: Overview Summary (No Dish Listing) */}
                                    <div className="my-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                                                {itemsSummary}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                                <span className="font-medium">
                                                    {totalQty} item{totalQty > 1 ? "s" : ""}
                                                </span>
                                                <span>•</span>
                                                <span className="line-clamp-1 max-w-xs" title={order.address}>
                                                    {order.address}
                                                </span>
                                                <span>•</span>
                                                <span className="font-medium text-slate-600">
                                                    {order.payment || "Cash on Delivery"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Total Price */}
                                        <div className="sm:text-right shrink-0">
                                            <p className="text-[11px] uppercase font-bold text-slate-400">Total Paid</p>
                                            <p className="text-lg font-black text-slate-900">
                                                ₹{order.total}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Actions */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                        <div className="flex items-center gap-2">
                                            {order.status === "Placed" && (
                                                <button
                                                    onClick={(e) => handleCancel(e, order.id)}
                                                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700 hover:bg-red-100 transition"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}

                                            {order.status === "Delivered" && (
                                                <Link
                                                    to="/"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
                                                >
                                                    Order Again
                                                </Link>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                                            <span>View Order Details</span>
                                            <span>→</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
};

export default Orders;
