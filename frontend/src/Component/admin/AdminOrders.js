import React from "react";

const AdminOrders = ({ orders, onUpdateStatus }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-extrabold text-slate-900 text-sm mb-4">
        Customer Orders & Live Delivery Status Updater ({orders.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
              <th className="pb-3">Order ID & Date</th>
              <th className="pb-3">Customer Information</th>
              <th className="pb-3">Ordered Items</th>
              <th className="pb-3">Amount & Payment</th>
              <th className="pb-3">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id} className="text-slate-700">
                <td className="py-3.5 align-top">
                  <p className="font-mono font-black text-slate-900">#{o.id}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{o.date}</p>
                </td>
                <td className="py-3.5 align-top">
                  <p className="font-bold text-slate-900">{o.customerName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{o.phone}</p>
                  <p className="text-[11px] text-slate-400 max-w-[200px] truncate" title={o.address}>
                    {o.address}
                  </p>
                </td>
                <td className="py-3.5 align-top">
                  <ul className="space-y-0.5 text-[11px]">
                    {o.items?.map((it, idx) => (
                      <li key={idx}>• {it.name || it.title} (x{it.quantity || 1})</li>
                    ))}
                  </ul>
                </td>
                <td className="py-3.5 align-top">
                  <p className="font-black text-slate-900 text-sm">₹{o.total}</p>
                  <p className="text-[10px] text-slate-500">{o.payment}</p>
                </td>
                <td className="py-3.5 align-top">
                  <select
                    value={o.status}
                    onChange={(e) => onUpdateStatus(o.id, e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-bold text-xs outline-none focus:border-emerald-500 shadow-xs"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
