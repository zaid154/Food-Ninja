import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cancelOrder } from "../utils/ordersSlice";
import UserContext from "./Usercontext";
import { API_BASE_URL } from "../utils/Constants";

const statusStyle = (status) => {
    switch (status) {
        case "Delivered":
            return "bg-green-100 text-green-800 border-green-200";
        case "Out for Delivery":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "Preparing":
            return "bg-amber-100 text-amber-800 border-amber-200";
        case "Cancelled":
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
};

const Orders = () => {
    const localOrders = useSelector((store) => store.orders.list);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
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

    const handleCancel = async (id) => {
        if (!window.confirm("Do you want to cancel this order?")) return;
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
        }
    };

    if (loading) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center bg-slate-50">
                <p className="text-sm font-semibold text-slate-500">Loading your orders...</p>
            </section>
        );
    }

    if (orders.length === 0) {
        return (
            <section className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-3">
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">No Orders Placed Yet</h1>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        Explore our delicious restaurant dishes and place your first order.
                    </p>
                    <Link
                        to="/"
                        className="mt-5 inline-block rounded-lg bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow transition hover:bg-emerald-700"
                    >
                        Browse Food Menu
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-slate-50 px-4 py-10 min-h-[85vh]">
            <div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Track live status of your food deliveries.
                        </p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="text-xs font-semibold text-emerald-700 hover:underline bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm"
                    >
                        Refresh Status
                    </button>
                </div>

                <div className="mt-6 space-y-5">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                <div>
                                    <p className="font-mono text-xs font-bold text-slate-500">Order #{order.id}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{order.date}</p>
                                </div>
                                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyle(order.status)}`}>
                                    ● {order.status}
                                </span>
                            </div>

                            <div className="mt-4 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
                                <p>
                                    <span className="font-bold text-slate-800">Delivering to:</span>{" "}
                                    {order.customerName} ({order.phone})
                                </p>
                                <p className="truncate" title={order.address}>
                                    <span className="font-bold text-slate-800">Address:</span>{" "}
                                    {order.address}
                                </p>
                                <p>
                                    <span className="font-bold text-slate-800">Payment:</span> {order.payment}
                                </p>
                            </div>

                            <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                                {order.items.map((it, idx) => (
                                    <li key={idx} className="flex justify-between text-slate-700">
                                        <span>
                                            {it.name || it.title}{" "}
                                            <span className="font-semibold text-slate-400">(x{it.quantity || 1})</span>
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            ₹{(it.price || it.caloriesPerServing || 0) * (it.quantity || 1)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                <div>
                                    <span className="text-xs text-slate-400 font-semibold">Total Paid</span>
                                    <p className="text-lg font-black text-slate-900">₹{order.total}</p>
                                </div>

                                {order.status === "Placed" ? (
                                    <button
                                        onClick={() => handleCancel(order.id)}
                                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition"
                                    >
                                        Cancel Order
                                    </button>
                                ) : (
                                    <span className="text-xs font-bold text-slate-500">
                                        Status: {order.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Orders;
