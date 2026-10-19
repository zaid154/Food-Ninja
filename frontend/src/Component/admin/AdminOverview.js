import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const getStatusBadge = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "Out for Delivery":
      return "bg-sky-50 text-sky-800 border-sky-200";
    case "Preparing":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "Cancelled":
      return "bg-rose-50 text-rose-800 border-rose-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

const AdminOverview = (props) => {
  const context = useOutletContext() || {};
  const orders = props.orders || context.orders || [];
  const foods = props.foods || context.foods || [];
  const inquiries = props.inquiries || context.inquiries || [];
  const navigate = useNavigate();

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.status !== "Cancelled" ? o.total || 0 : 0),
    0
  );

  const pendingOrders = orders.filter(
    (o) => o.status === "Placed" || o.status === "Preparing" || o.status === "Out for Delivery"
  ).length;

  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="space-y-6">
      {/* 4 Professional, Consistent Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between h-34">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 border border-slate-200/80 text-slate-600 font-bold text-xs">
              ₹
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-slate-900">₹{totalRevenue.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-slate-400 font-medium">{deliveredCount} delivered orders</p>
          </div>
        </div>

        {/* Live Orders Card */}
        <div
          onClick={() => navigate("/admin/orders")}
          className="cursor-pointer rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between h-34 transition hover:border-slate-300 hover:shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Orders</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 border border-slate-200/80 text-slate-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </span>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold tracking-tight text-slate-900">{orders.length}</p>
              <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition">
                Manage →
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400 font-medium">{pendingOrders} active in progress</p>
          </div>
        </div>

        {/* Food Dishes Card */}
        <div
          onClick={() => navigate("/admin/foods")}
          className="cursor-pointer rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between h-34 transition hover:border-slate-300 hover:shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Food Dishes</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 border border-slate-200/80 text-slate-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold tracking-tight text-slate-900">{foods.length}</p>
              <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition">
                Edit Menu →
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400 font-medium">Active in online catalog</p>
          </div>
        </div>

        {/* Customer Messages Card */}
        <div
          onClick={() => navigate("/admin/inquiries")}
          className="cursor-pointer rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between h-34 transition hover:border-slate-300 hover:shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inquiries</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 border border-slate-200/80 text-slate-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold tracking-tight text-slate-900">{inquiries.length}</p>
              <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition">
                View →
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400 font-medium">From contact form</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview Card */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live orders placed by store customers</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
          >
            View all orders →
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No customer orders placed yet.
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((o) => {
                  const badgeClass = getStatusBadge(o.status);
                  return (
                    <tr key={o.id} className="text-slate-700 hover:bg-slate-50/50 transition">
                      <td className="py-3 font-mono font-semibold text-slate-800">#{o.id}</td>
                      <td className="py-3 font-medium text-slate-900">{o.customerName}</td>
                      <td className="py-3 text-slate-500">{o.items?.length || 1} items</td>
                      <td className="py-3 font-bold text-slate-900">₹{o.total}</td>
                      <td className="py-3">
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 font-semibold text-[10px] ${badgeClass}`}>
                          ● {o.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/orders/${o.id}`)}
                          className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
