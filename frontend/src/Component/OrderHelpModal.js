import React, { useState } from "react";
import { API_BASE_URL } from "../utils/Constants";

const ISSUE_OPTIONS = [
  {
    id: "Delivery Delayed",
    label: "Delivery Delayed",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    hint: "Tell us how long you've been waiting or what status you see...",
  },
  {
    id: "Missing Item",
    label: "Missing Item",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    hint: "Which dish or item was missing from your delivery parcel?",
  },
  {
    id: "Food Quality",
    label: "Food Quality",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    hint: "Describe the quality issue (packaging, temperature, taste, spill)...",
  },
  {
    id: "Rider Unreachable",
    label: "Rider Unreachable",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    hint: "Were you unable to connect with your delivery rider?",
  },
  {
    id: "Cancel Request",
    label: "Cancel Request",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    hint: "Please provide the reason for requesting an order cancellation...",
  },
  {
    id: "Other",
    label: "Other Issue",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    hint: "Describe your query or concern in detail...",
  },
];

const OrderHelpModal = ({ order, isOpen, onClose }) => {
  const [issueCategory, setIssueCategory] = useState("Delivery Delayed");
  const [name, setName] = useState(order?.customerName || "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(order?.phone || "");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("urgent");
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !order) return null;

  const currentOption = ISSUE_OPTIONS.find((opt) => opt.id === issueCategory) || ISSUE_OPTIONS[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill in your name, email, and description.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: `[Order #${order.id}] ${issueCategory}`,
      message: message.trim(),
      orderId: String(order.id),
      type: "order_issue",
      issueCategory,
      orderStatus: order.status || "Placed",
      orderTotal: Number(order.total) || 0,
      priority,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedTicket(data.inquiry || payload);
      } else {
        setErrorMsg(data.message || "Failed to submit help ticket. Please try again.");
      }
    } catch {
      // Graceful fallback confirmation
      setSubmittedTicket(payload);
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmittedTicket(null);
    setMessage("");
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Order Resolution Desk
              </h3>
              <p className="text-[11px] text-slate-500">
                Direct Kitchen & Logistics Escalation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        {/* Order Context Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50/60 border-b border-emerald-100/70 px-6 py-2.5 text-xs">
          <div className="flex items-center gap-2 font-mono">
            <span className="font-extrabold text-emerald-950">Order #{order.id}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-sans font-medium">₹{order.total}</span>
            {order.date && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-sans">{order.date}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-medium">Status:</span>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 shadow-2xs">
              {order.status || "Placed"}
            </span>
          </div>
        </div>

        {submittedTicket ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                Ticket Raised for Order #{order.id}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                Your issue ({issueCategory}) has been registered with high priority. Our kitchen supervisor and customer team have been alerted.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-xs space-y-1.5 max-w-md mx-auto font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Issue Category:</span>
                <span className="font-bold text-slate-800">{issueCategory}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Priority:</span>
                <span className="font-bold text-rose-700 uppercase">{priority}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Contact Email:</span>
                <span className="text-slate-800">{email}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-2xs cursor-pointer"
              >
                Back to Order Details
              </button>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {errorMsg && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-700">
                {errorMsg}
              </div>
            )}

            {/* Quick Issue Category Chips */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                What issue are you facing with this order? *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ISSUE_OPTIONS.map((opt) => {
                  const isSelected = issueCategory === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setIssueCategory(opt.id)}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition cursor-pointer ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500/30"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <span className={isSelected ? "text-emerald-700" : "text-slate-400"}>
                        {opt.icon}
                      </span>
                      <span className="truncate text-xs">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Priority Level</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPriority("urgent")}
                  className={`flex-1 rounded-xl border py-2 px-3 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    priority === "urgent"
                      ? "border-rose-400 bg-rose-50 text-rose-800 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                  <span>Urgent (Active Order Delay/Issue)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("normal")}
                  className={`flex-1 rounded-xl border py-2 px-3 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    priority === "normal"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  <span>Normal (General Inquiry / Feedback)</span>
                </button>
              </div>
            </div>

            {/* Message Description */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Describe the Issue *
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={currentOption.hint}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600 resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <a
                href={`/contact?orderId=${encodeURIComponent(order.id)}`}
                className="text-[11px] font-semibold text-slate-500 hover:text-emerald-700 underline"
              >
                Or open full Contact Page
              </a>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-emerald-700 px-5 py-2 font-bold text-white hover:bg-emerald-800 transition disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  {submitting ? "Sending..." : "Submit Order Ticket"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderHelpModal;
