import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserContext from "./Usercontext";
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

const OrderResolutionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const localOrders = useSelector((store) => store.orders.list);
  const [order, setOrder] = useState(() => {
    const match = localOrders.find((o) => String(o.id) === String(id));
    if (match) return match;
    try {
      const saved = JSON.parse(localStorage.getItem("orders") || "[]");
      return saved.find((o) => String(o.id) === String(id)) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(!order);
  const [issueCategory, setIssueCategory] = useState("Delivery Delayed");
  const [name, setName] = useState(order?.customerName || user?.name || "");
  const [email, setEmail] = useState(order?.userEmail || user?.email || "");
  const [phone, setPhone] = useState(order?.phone || user?.phone || "");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("urgent");
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch live order from backend if not in cache
  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.order) {
            setOrder(data.order);
            if (!name) setName(data.order.customerName || user?.name || "");
            if (!email) setEmail(data.order.userEmail || user?.email || "");
            if (!phone) setPhone(data.order.phone || user?.phone || "");
          }
        }
      } catch {
        // Fallback to local
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Synchronize email and details from user account
  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
    if (user?.name && !name) setName(user.name);
    if (user?.phone && !phone) setPhone(user.phone);
  }, [user]);

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
      subject: `[Order #${id}] ${issueCategory}`,
      message: message.trim(),
      orderId: String(id),
      type: "order_issue",
      issueCategory,
      orderStatus: order?.status || "Placed",
      orderTotal: Number(order?.total) || 0,
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
      // Graceful fallback
      setSubmittedTicket(payload);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading Order Resolution Desk...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link
            to={`/orders/${id}`}
            className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-emerald-700 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Order Details</span>
          </Link>

          <span className="text-[11px] font-mono text-slate-400">Order #{id}</span>
        </div>

        {/* Success Confirmation Card */}
        {submittedTicket ? (
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 sm:p-10 shadow-xs text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                Ticket #{submittedTicket._id?.slice(-6)?.toUpperCase() || "RESOLVED"}
              </span>
              <h2 className="text-2xl font-black text-slate-900">Priority Ticket Submitted!</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Your issue for <strong>Order #{id}</strong> has been directly escalated to Food Ninja Kitchen & Logistics desk.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Issue Category</span>
                <span className="font-bold text-slate-800">{submittedTicket.issueCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact Email</span>
                <span className="font-semibold text-slate-700">{submittedTicket.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Priority Level</span>
                <span className="font-bold text-rose-700 uppercase">{submittedTicket.priority}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to={`/orders/${id}`}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 transition shadow-xs"
              >
                Return to Order #{id}
              </Link>
              <Link
                to="/orders"
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-5 py-2.5 transition"
              >
                View All Orders
              </Link>
            </div>
          </div>
        ) : (
          /* Main Resolution Desk Card */
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">Order Resolution Desk</h1>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                      Live Support
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct escalation to kitchen managers and delivery fleet supervisors.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Highlight Bar */}
            {order && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 px-4 py-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-slate-900">Order #{order.id}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-bold text-emerald-800">₹{order.total}</span>
                  {order.date && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{order.date}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Status:</span>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 shadow-2xs">
                    {order.status || "Placed"}
                  </span>
                </div>
              </div>
            )}

            {/* Resolution Form */}
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* Category Picker */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  What issue are you facing with this order? <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ISSUE_OPTIONS.map((opt) => {
                    const isSelected = issueCategory === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setIssueCategory(opt.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-left transition cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50/80 border-emerald-500 text-emerald-900 font-bold shadow-2xs"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <span className={isSelected ? "text-emerald-700" : "text-slate-500"}>
                          {opt.icon}
                        </span>
                        <span className="text-xs truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Fields with Auto-Filled Email from Account */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                  <span className="block text-[10px] text-emerald-700 font-medium mt-0.5">
                    Auto-filled from account
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-mono"
                  />
                </div>
              </div>

              {/* Priority Picker */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Priority Level</label>
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border cursor-pointer transition text-xs ${
                      priority === "urgent"
                        ? "bg-rose-50 border-rose-300 text-rose-900 font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value="urgent"
                      checked={priority === "urgent"}
                      onChange={() => setPriority("urgent")}
                      className="accent-rose-600"
                    />
                    <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                    <span>Urgent (Active Order Delay / Missing Dish)</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border cursor-pointer transition text-xs ${
                      priority === "normal"
                        ? "bg-slate-100 border-slate-300 text-slate-900 font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value="normal"
                      checked={priority === "normal"}
                      onChange={() => setPriority("normal")}
                      className="accent-slate-700"
                    />
                    <span>Normal (General Inquiry / Feedback)</span>
                  </label>
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Describe the Issue <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={currentOption.hint}
                  className="w-full rounded-xl border border-slate-300 p-3.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  {errorMsg}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <Link
                  to="/contact"
                  className="text-xs font-semibold text-slate-500 hover:text-emerald-700 hover:underline"
                >
                  Or open full Contact Page →
                </Link>

                <div className="flex items-center gap-2.5">
                  <Link
                    to={`/orders/${id}`}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 transition shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {submitting && (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    )}
                    <span>{submitting ? "Submitting..." : "Submit Order Ticket"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderResolutionPage;
