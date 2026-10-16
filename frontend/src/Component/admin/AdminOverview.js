import React from "react";

const AdminOverview = ({ orders, foods, onNavigateToOrders }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total || 0 : 0), 0);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3 text-xs">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Total Revenue</p>
          <p className="mt-1 text-2xl font-black text-emerald-600">₹{totalRevenue}</p>
          <p className="mt-1 text-[11px] text-slate-500">Live verified orders</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Total Orders</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{orders.length}</p>
          <p className="mt-1 text-[11px] text-slate-500">Live MongoDB records</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Food Menu Items</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{foods.length}</p>
          <p className="mt-1 text-[11px] text-slate-500">Active restaurant dishes</p>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm">Recent Customer Orders</h3>
          <button onClick={onNavigateToOrders} className="text-xs font-bold text-emerald-600 hover:underline">
            Manage All Orders →
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-2">Order ID</th>
                <th className="pb-2">Customer Details</th>
                <th className="pb-2">Items Count</th>
                <th className="pb-2">Total Amount</th>
                <th className="pb-2">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="text-slate-700">
                  <td className="py-2.5 font-mono font-bold text-slate-900">#{o.id}</td>
                  <td>{o.customerName} ({o.phone})</td>
                  <td>{o.items?.length || 0} items</td>
                  <td className="font-bold text-slate-900">₹{o.total}</td>
                  <td>
                    <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 font-bold text-[10px]">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
