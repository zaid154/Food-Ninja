import React from "react";

const OrderInvoiceModal = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Printable Ticket Area */}
        <div id="printable-invoice" className="text-slate-900 font-sans">
          {/* Header */}
          <div className="border-b border-dashed border-slate-300 pb-4 text-center">
            <h2 className="text-xl font-black tracking-tight text-slate-900">FOOD NINJA</h2>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
              Kitchen Order Ticket & Tax Invoice
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              FSSAI Lic: 10020042001234 • GSTIN: 27AABCF1234P1Z5
            </p>
          </div>

          {/* Order & Customer Metadata */}
          <div className="grid grid-cols-2 gap-3 py-3 border-b border-dashed border-slate-300 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Order ID</p>
              <p className="font-extrabold text-slate-900">#{order.id}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-2">Order Date</p>
              <p className="font-medium text-slate-700">{order.date || new Date().toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Customer</p>
              <p className="font-extrabold text-slate-900">{order.customerName}</p>
              <p className="text-[11px] font-mono text-slate-700">{order.phone}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-2">Delivery Address</p>
              <p className="font-medium text-slate-700 leading-snug line-clamp-2">{order.address}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-3 border-b border-dashed border-slate-300">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Order Items ({order.items?.length || 0})</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase">
                  <th className="text-left pb-1.5">Item</th>
                  <th className="text-center pb-1.5 w-12">Qty</th>
                  <th className="text-right pb-1.5 w-16">Price</th>
                  <th className="text-right pb-1.5 w-16">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(order.items || []).map((item, idx) => {
                  const itemPrice = item.price || item.caloriesPerServing || 199;
                  const itemQty = item.quantity || 1;
                  return (
                    <tr key={idx} className="py-1.5">
                      <td className="py-1.5 text-slate-800 pr-2">{item.name}</td>
                      <td className="py-1.5 text-center text-slate-600">{itemQty}</td>
                      <td className="py-1.5 text-right font-mono text-slate-600">₹{itemPrice}</td>
                      <td className="py-1.5 text-right font-mono font-bold text-slate-900">₹{itemPrice * itemQty}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financials & Total */}
          <div className="py-3 space-y-1.5 text-xs border-b border-dashed border-slate-300">
            <div className="flex justify-between text-slate-600">
              <span>Item Subtotal</span>
              <span className="font-mono">₹{order.subtotal || order.total - 45 || order.total}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="font-mono">{order.deliveryFee ? `₹${order.deliveryFee}` : "₹30"}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Restaurant Packaging & GST</span>
              <span className="font-mono">{order.taxes ? `₹${order.taxes}` : "₹15"}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
              <span>Grand Total</span>
              <span className="font-mono text-emerald-800">₹{order.total}</span>
            </div>
          </div>

          {/* Payment & Status Footer */}
          <div className="pt-3 pb-1 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Mode</span>
              <span className="font-bold text-slate-800">{order.payment || "Cash on Delivery"}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Live Status</span>
              <span className="inline-block rounded bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[10px] font-bold border border-emerald-200">
                {order.status || "Placed"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden when printed) */}
        <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Slip (KOT)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoiceModal;
