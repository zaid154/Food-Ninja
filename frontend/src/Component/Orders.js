import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cancelOrder } from "../utils/ordersSlice";
import UserContext from "./Usercontext";
import { API_BASE_URL } from "../utils/Constants";

const STEPS = [
  { key: "Placed", label: "Confirmed", desc: "Order placed" },
  { key: "Preparing", label: "Preparing", desc: "In the kitchen" },
  { key: "Out for Delivery", label: "On the Way", desc: "With delivery rider" },
  { key: "Delivered", label: "Delivered", desc: "Enjoy your meal" },
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

const statusStyle = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "Out for Delivery":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "Preparing":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "Cancelled":
      return "bg-red-50 text-red-800 border-red-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
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
    }
  };

  if (loading) {
    return (
      <section className="bg-slate-50 px-4 py-10 min-h-[85vh]">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <div className="h-7 w-36 bg-slate-200 rounded animate-pulse" />
              <div className="mt-1 h-3.5 w-52 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {[1, 2].map((n) => (
              <div key={n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1.5">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-3 w-40 bg-slate-100 rounded" />
                  </div>
                  <div className="h-6 w-24 bg-slate-200 rounded-full" />
                </div>
                <div className="my-5 h-16 bg-slate-100 rounded-xl" />
                <div className="space-y-3 pt-3">
                  <div className="h-12 bg-slate-100 rounded-xl" />
                  <div className="h-12 bg-slate-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900">No Orders Placed Yet</h1>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            You haven't placed any food orders yet. Explore our menu and indulge in your favorite meal.
          </p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
          >
            Explore Food Menu
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 px-4 py-10 min-h-[85vh]">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Track live status of your delicious meals.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        {/* Orders List */}
        <div className="mt-6 space-y-6">
          {orders.map((order) => {
            const isCancelled = order.status === "Cancelled";
            const stepIndex = getStepIndex(order.status);

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-md"
              >
                {/* Order Top Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        #{order.id}
                      </span>
                      <span className="text-[11px] text-slate-400">{order.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCancelled && order.status !== "Delivered" && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Est: 25–30 mins
                      </span>
                    )}
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyle(order.status)}`}>
                      ● {order.status}
                    </span>
                  </div>
                </div>

                {/* Live Order Progress Stepper */}
                {isCancelled ? (
                  <div className="my-4 rounded-xl border border-red-200 bg-red-50/60 p-3.5 flex items-center gap-3 text-xs text-red-700">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold shrink-0">
                      ✕
                    </div>
                    <div>
                      <p className="font-bold">Order Cancelled</p>
                      <p className="text-[11px] text-red-600">
                        This order was cancelled. Any amount paid will be refunded within 24–48 hours.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="my-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="flex items-center justify-between relative">
                      {STEPS.map((step, idx) => {
                        const isCompleted = idx < stepIndex;
                        const isCurrent = idx === stepIndex;

                        return (
                          <div key={step.key} className="flex-1 flex flex-col items-center relative z-10 text-center">
                            {/* Connector Line */}
                            {idx > 0 && (
                              <div
                                className={`absolute top-3.5 -left-1/2 w-full h-0.5 -z-10 transition-colors ${
                                  idx <= stepIndex ? "bg-emerald-600" : "bg-slate-200"
                                }`}
                              />
                            )}

                            {/* Step Indicator Circle */}
                            <div
                              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                                isCompleted
                                  ? "bg-emerald-600 text-white"
                                  : isCurrent
                                  ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                                  : "border-2 border-slate-300 bg-white text-slate-400"
                              }`}
                            >
                              {isCompleted ? (
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
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

                {/* Recipient & Address Box */}
                <div className="grid gap-2 sm:grid-cols-2 rounded-xl border border-slate-100 bg-slate-50/40 p-3 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="font-bold text-slate-800">{order.customerName}</p>
                      <p className="text-slate-500 text-[11px]">{order.phone} • {order.payment}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-bold text-slate-800">Delivering to</p>
                      <p className="text-slate-500 text-[11px] leading-tight line-clamp-1" title={order.address}>
                        {order.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dish Items with Real Photos */}
                <div className="mt-4 divide-y divide-slate-100 border-t border-slate-100 pt-3">
                  {order.items.map((it, idx) => {
                    const itemPrice = it.price || it.caloriesPerServing || 0;
                    const itemQty = it.quantity || 1;

                    return (
                      <div key={idx} className="flex items-center justify-between gap-3 py-2.5">
                        <div className="flex items-center gap-3">
                          {it.image ? (
                            <img
                              src={it.image}
                              alt={it.name || it.title}
                              className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shrink-0"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs shrink-0">
                              Dish
                            </div>
                          )}

                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{it.name || it.title}</h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                              <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[11px] font-bold text-slate-700">
                                Qty: {itemQty}
                              </span>
                              <span>₹{itemPrice} each</span>
                            </div>
                          </div>
                        </div>

                        <span className="text-sm font-bold text-slate-900">
                          ₹{itemPrice * itemQty}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Card Bottom / Bill & Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Total Bill</span>
                    <p className="text-lg font-black text-slate-900">₹{order.total}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === "Placed" && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition"
                      >
                        Cancel Order
                      </button>
                    )}

                    {order.status === "Delivered" && (
                      <Link
                        to="/"
                        className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                      >
                        Order Again
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Orders;
