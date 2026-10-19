import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

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
      {/* 4 Equal-Height, Aligned Summary Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-bold text-sm">
              ₹
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">₹{totalRevenue}</p>
            <p className="mt-1 text-[11px] text-slate-500 font-medium">From {deliveredCount + pendingOrders} verified orders</p>
          </div>
        </div>

        {/* Live Orders Card (Clickable) */}
        <div
          onClick={() => navigate("/admin/orders")}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between h-36 cursor-pointer hover:border-blue-400 hover:shadow-xs transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Live Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{orders.length}</p>
            <p className="mt-1 text-[11px] text-blue-600 font-semibold group-hover:underline">
              {pendingOrders} active • View orders →
            </p>
          </div>
        </div>

        {/* Food Dishes Card (Clickable) */}
        <div
          onClick={() => navigate("/admin/foods")}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between h-36 cursor-pointer hover:border-amber-400 hover:shadow-xs transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Food Dishes</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{foods.length}</p>
            <p className="mt-1 text-[11px] text-amber-700 font-semibold group-hover:underline">
              Menu items • Manage dishes →
            </p>
          </div>
        </div>

        {/* Customer Messages Card (Clickable) */}
        <div
          onClick={() => navigate("/admin/inquiries")}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between h-36 cursor-pointer hover:border-purple-400 hover:shadow-xs transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Customer Messages</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{inquiries.length}</p>
            <p className="mt-1 text-[11px] text-purple-700 font-semibold group-hover:underline">
              Feedback from /contact • View →
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest orders placed on Food Ninja</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Manage All Orders →
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            No customer orders placed yet.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-2.5">Order ID</th>
                  <th className="pb-2.5">Customer</th>
                  <th className="pb-2.5">Items</th>
                  <th className="pb-2.5">Total Amount</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="text-slate-700">
                    <td className="py-3 font-mono font-bold text-slate-900">#{o.id}</td>
                    <td className="py-3 font-medium text-slate-900">{o.customerName}</td>
                    <td className="py-3 text-slate-500">{o.items?.length || 1} items</td>
                    <td className="py-3 font-bold text-slate-900">₹{o.total}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 font-bold text-[10px]">
                        ● {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => navigate("/admin/orders")}
                        className="text-[11px] font-bold text-emerald-600 hover:underline"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
