import React from "react";
import { useOutletContext } from "react-router-dom";

const AdminInquiries = (props) => {
  const context = useOutletContext() || {};
  const inquiries = props.inquiries || context.inquiries || [];
  const orders = props.orders || context.orders || [];
  const onDeleteInquiry = props.onDeleteInquiry || context.handleDeleteInquiry;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Customer Inquiries & Messages ({inquiries.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Reply via Email or Call customers directly
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          No customer inquiries yet. Messages sent via /contact will appear here.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3 min-w-[150px]">Customer</th>
                <th className="pb-3 min-w-[110px]">Subject</th>
                <th className="pb-3 min-w-[260px]">Customer Message</th>
                <th className="pb-3 min-w-[90px]">Date</th>
                <th className="pb-3 text-right pr-2 min-w-[160px]">Contact Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.map((inq) => {
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inq.email)}&su=${encodeURIComponent(`Re: ${inq.subject || "Your Food Ninja Inquiry"}`)}`;
                
                // Check if customer phone is in inquiry, inside message text, or in previous orders
                const orderMatch = orders.find(
                  (o) =>
                    (o.customerName && inq.name && o.customerName.trim().toLowerCase() === inq.name.trim().toLowerCase()) ||
                    (o.phone && inq.message && inq.message.includes(o.phone))
                );
                const extractedPhone = inq.message?.match(/\b[6-9]\d{9}\b/)?.[0] || "";
                const phone = inq.phone?.trim() || extractedPhone || orderMatch?.phone?.trim() || "";

                return (
                  <tr key={inq._id || inq.id} className="text-slate-700 hover:bg-slate-50/50 transition">
                    {/* Customer Info */}
                    <td className="py-3.5 align-top">
                      <p className="font-semibold text-slate-900">{inq.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{inq.email}</p>
                      {phone && (
                        <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                          📞 {phone}
                        </p>
                      )}
                    </td>

                    {/* Subject */}
                    <td className="py-3.5 align-top">
                      <span className="inline-block rounded bg-slate-100 border border-slate-200/60 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {inq.subject || "General"}
                      </span>
                    </td>

                    {/* Message */}
                    <td className="py-3.5 align-top max-w-sm">
                      <p className="text-slate-800 text-xs leading-relaxed break-words font-medium">
                        {inq.message}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 align-top text-[11px] text-slate-400 whitespace-nowrap">
                      {inq.createdAt
                        ? new Date(inq.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric"
                          })
                        : "Recent"}
                    </td>

                    {/* Action Buttons: Mail & Call & Delete */}
                    <td className="py-3.5 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1-Click Mail (Opens in Gmail) */}
                        <a
                          href={gmailUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition"
                          title={`Email ${inq.email} via Gmail`}
                        >
                          ✉️ Mail
                        </a>

                        {/* Call Button (Enabled if phone exists, cleanly disabled without alert if not) */}
                        {phone ? (
                          <a
                            href={`tel:${phone}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                            title={`Call ${phone}`}
                          >
                            📞 Call
                          </a>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200/60 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-300 cursor-not-allowed select-none"
                            title="Customer did not provide phone number"
                          >
                            📞 Call
                          </span>
                        )}

                        {/* Delete Button */}
                        {onDeleteInquiry && (
                          <button
                            type="button"
                            onClick={() => onDeleteInquiry(inq._id || inq.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                            title="Delete inquiry"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
