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
                        <p className="text-[11px] text-emerald-700 font-mono mt-0.5 flex items-center gap-1">
                          <svg className="h-3 w-3 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{phone}</span>
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
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition"
                          title={`Email ${inq.email} via Gmail`}
                        >
                          <svg className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Mail</span>
                        </a>

                        {/* Call Button (Enabled if phone exists, cleanly disabled without alert if not) */}
                        {phone ? (
                          <a
                            href={`tel:${phone}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                            title={`Call ${phone}`}
                          >
                            <svg className="h-3.5 w-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>Call</span>
                          </a>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-300 cursor-not-allowed select-none"
                            title="Customer did not provide phone number"
                          >
                            <svg className="h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>Call</span>
                          </span>
                        )}

                        {/* Delete Button */}
                        {onDeleteInquiry && (
                          <button
                            type="button"
                            onClick={() => onDeleteInquiry(inq._id || inq.id)}
                            className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition"
                            title="Delete inquiry"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
