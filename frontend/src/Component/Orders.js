import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cancelOrder } from "../utils/ordersSlice";
import UserContext from "./Usercontext";
import { API_BASE_URL } from "../utils/Constants";

// Clean, realistic status configuration (No random AI rainbow colors)
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
                label: "Preparing",
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

const Orders = () => {
    const localOrders = useSelector((store) => store.orders.list);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const userEmailParam = user && user.email ? user.email : "foodninja@gmail.com";
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
            <section className="bg-slate-50 px-4 pt-8 pb-16 min-h-[85vh]">
                <div className="mx-auto max-w-4xl space-y-4 animate-pulse">
                    <div className="h-7 w-40 bg-slate-200 rounded" />
                    <div className="h-4 w-60 bg-slate-100 rounded" />
                    <div className="space-y-4 pt-4">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="rounded-xl border border-slate-200 bg-white p-5 h-36" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (orders.length === 0) {
        return (
            <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">No Orders Yet</h1>
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                        When you place an order, you will be able to track your delivery and review your receipts here.
                    </p>
                    <Link
                        to="/"
                        className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-95"
                    >
                        Browse Food Menu
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-slate-50 px-4 pt-6 pb-16 min-h-[85vh]">
            <div className="mx-auto max-w-4xl space-y-5">
                {/* Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Past Orders
                            </h1>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                {orders.length}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Track active deliveries and review previous food orders.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <div className="relative w-44 sm:w-60">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search order ID or dish..."
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 pl-8 text-xs outline-none focus:border-slate-400 transition"
                            />
                            <svg className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <button
                            onClick={fetchOrders}
                            className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition"
                        >
                            <svg className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Orders Overview List */}
                <div className="space-y-3.5">
                    {filteredOrders.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                            No orders found matching your search.
                        </div>
                    ) : (
                        filteredOrders.map((order) => {
                            const totalQty = (order.items || []).reduce((n, it) => n + (it.quantity || 1), 0);
                            const firstItem = order.items && order.items[0];
                            const firstItemName = firstItem ? firstItem.name || firstItem.title : "Delicious Dish";
                            const itemsSummary =
                                (order.items || []).length > 1
                                    ? `${firstItemName} + ${order.items.length - 1} more item${order.items.length > 2 ? "s" : ""}`
                                    : `${firstItemName}`;

                            const statusInfo = getStatusConfig(order.status);

                            return (
                                <div
                                    key={order.id}
                                    onClick={() => navigate(`/orders/${order.id}`)}
                                    className="cursor-pointer rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs transition hover:border-slate-300 hover:shadow-xs"
                                >
                                    {/* Top Row: Order ID, Date & Clean Status Badge */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                                                #{order.id}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {order.date}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {order.status !== "Delivered" && order.status !== "Cancelled" && (
                                                <span className="hidden sm:inline-block text-[11px] font-medium text-slate-500">
                                                    Est. {order.estDelivery || "25–30 mins"}
                                                </span>
                                            )}
                                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusInfo.badge}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                                                <span>{statusInfo.label}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Middle Row: Clean Typography Overview */}
                                    <div className="my-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-slate-900">
                                                {itemsSummary}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                                <span>{totalQty} item{totalQty > 1 ? "s" : ""}</span>
                                                <span>•</span>
                                                <span className="line-clamp-1 max-w-sm" title={order.address}>
                                                    {order.address}
                                                </span>
                                                <span>•</span>
                                                <span>{order.payment || "Cash on Delivery"}</span>
                                            </div>
                                        </div>

                                        {/* Total Price */}
                                        <div className="sm:text-right shrink-0">
                                            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total</p>
                                            <p className="text-base font-black text-slate-900">
                                                ₹{order.total}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Actions */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                        <div className="flex items-center gap-3">
                                            {order.status === "Placed" && (
                                                <button
                                                    onClick={(e) => handleCancel(e, order.id)}
                                                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}

                                            {order.status === "Delivered" && (
                                                <Link
                                                    to="/"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-xs font-semibold text-emerald-700 hover:underline transition"
                                                >
                                                    Order Again
                                                </Link>
                                            )}
                                        </div>

                                        {/* Professional Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/orders/${order.id}`);
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition"
                                        >
                                            <span>View Details</span>
                                            <span className="text-slate-400 font-normal">→</span>
                                        </button>
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
