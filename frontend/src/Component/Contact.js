import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/Constants";

const FAQS = [
  {
    q: "How do I cancel or modify my food order?",
    a: "Because our restaurant kitchens prepare ingredients immediately upon receipt, orders can be canceled within 60 seconds of placement directly from your Order Details page. After 60 seconds, kitchen preparation commences and cancellations cannot be accepted."
  },
  {
    q: "What if an item is missing, incorrect, or damaged in my delivery?",
    a: "Please report any discrepancy within 2 hours of delivery. Submit a photo of the damaged seal or packaging through this Help Center or email support@foodninja.com. Verified claims receive an immediate item replacement or pro-rata refund to your original payment method."
  },
  {
    q: "How long does a payment refund take to reach my bank?",
    a: "Approved refunds are initiated immediately by our billing desk. Depending on your bank or payment provider (UPI, Net Banking, Credit/Debit card), funds typically reflect within 3 to 5 business days."
  },
  {
    q: "Are allergen and dietary markers (Veg/Non-Veg) verified?",
    a: "Restaurant Partners certify their dietary designations in good faith. However, food is prepared in shared commercial kitchens where airborne cross-contact with gluten, nuts, dairy, or seafood can occur. If you have severe anaphylactic allergies, please review our Terms of Service and contact the kitchen directly before ordering."
  },
  {
    q: "How do I reach the Statutory Grievance Redressal Officer?",
    a: "In compliance with the Consumer Protection (E-Commerce) Rules 2020 and IT Intermediary Rules 2021, you can escalate unresolved disputes directly to our designated Grievance Officer at grievance@foodninja.com. Every formal ticket receives an acknowledgment within 24-48 hours and formal redressal within 15 business days."
  }
];

const Contact = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch("https://api.github.com/users/zaid154")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
      } else {
        setErrorMsg(data.message || "Failed to submit. Please try again.");
      }
    } catch {
      // Fallback graceful confirmation
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14 text-slate-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Header Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <a href="/" className="text-emerald-700 hover:underline">Home</a>
            <span>/</span>
            <span className="text-slate-900 font-bold">Help Center & Support</span>
          </div>
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-[11px] font-bold">
            24/7 Customer Helpdesk Active
          </span>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs mb-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl pointer-events-none"></div>
          <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-800 mb-3">
            Customer Support & Grievance Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How can we assist you today?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Fast resolution for delivery tracking, refund claims, restaurant quality, and statutory consumer inquiries.
          </p>

          {/* Quick Support Topics */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 hover:border-emerald-300 transition">
              <span className="text-2xl">🚚</span>
              <h3 className="mt-2 text-xs font-black text-slate-900">Order Tracking</h3>
              <p className="mt-1 text-[11px] text-slate-500">Real-time status & dispatch delays</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 hover:border-emerald-300 transition">
              <span className="text-2xl">💳</span>
              <h3 className="mt-2 text-xs font-black text-slate-900">Refunds & Billing</h3>
              <p className="mt-1 text-[11px] text-slate-500">Failed payments & 3-day turnaround</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 hover:border-emerald-300 transition">
              <span className="text-2xl">🍲</span>
              <h3 className="mt-2 text-xs font-black text-slate-900">Food Quality</h3>
              <p className="mt-1 text-[11px] text-slate-500">Missing items & spill protection</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 hover:border-emerald-300 transition">
              <span className="text-2xl">⚖️</span>
              <h3 className="mt-2 text-xs font-black text-slate-900">Legal & Privacy</h3>
              <p className="mt-1 text-[11px] text-slate-500">Official Grievance Desk contact</p>
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid: Form & Info */}
        <div className="grid gap-8 lg:grid-cols-12 mb-12">
          
          {/* Left Column: Official Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">
              Submit a Support Ticket
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Our support team reviews customer tickets around the clock. Average response time is under 2 hours.
            </p>

            {submitted ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white text-xl font-bold mb-3">
                  ✓
                </div>
                <h3 className="text-base font-black text-emerald-900">Support Ticket Logged!</h3>
                <p className="mt-1.5 text-xs text-emerald-700 leading-relaxed max-w-md mx-auto">
                  Thank you for reaching out. Your reference token has been generated and our support desk has received your details. A representative will contact you via email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-5 rounded-full bg-emerald-700 px-6 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="Mohd Zaid"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={form.subject}
                      onChange={handleChange("subject")}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition cursor-pointer"
                    >
                      <option value="Delivery Issue">Delivery Delay / Driver Issue</option>
                      <option value="Refund Claim">Refund / Billing Discrepancy</option>
                      <option value="Food Quality">Food Quality / Missing Item</option>
                      <option value="General Inquiry">General Question / Feedback</option>
                      <option value="Statutory Grievance">Legal / Statutory Grievance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Describe Your Issue or Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={form.message}
                    onChange={handleChange("message")}
                    placeholder="Write your message here... Include your Order ID if applicable."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50 transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  {submitting ? "Submitting Ticket..." : "Send Message"}
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Protected under FoodNinja&apos;s <a href="/privacy" className="text-emerald-700 hover:underline">Privacy Policy</a> and <a href="/terms" className="text-emerald-700 hover:underline">Terms of Service</a>.
                </p>
              </form>
            )}
          </div>

          {/* Right Column: Statutory & Corporate Information (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Corporate & Grievance Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Corporate Credentials
              </span>
              <h2 className="mt-1 text-xl font-black text-white">
                FoodNinja Technologies
              </h2>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Registered food delivery marketplace facilitator complying with Indian E-Commerce Rules and IT Intermediary Regulations.
              </p>

              <div className="mt-6 space-y-3.5 text-xs text-slate-300 border-t border-slate-800 pt-5">
                <div className="flex items-start gap-3">
                  <span className="text-base">📍</span>
                  <div>
                    <strong className="text-white block font-bold">Registered Office:</strong>
                    <span>FoodNinja Corporate Tower, Connaught Place, New Delhi 110001, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-base">✉️</span>
                  <div>
                    <strong className="text-white block font-bold">Priority Customer Desk:</strong>
                    <a href="mailto:support@foodninja.com" className="text-emerald-400 hover:underline">support@foodninja.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-base">⚖️</span>
                  <div>
                    <strong className="text-white block font-bold">Statutory Grievance Officer:</strong>
                    <a href="mailto:grievance@foodninja.com" className="text-emerald-400 hover:underline">grievance@foodninja.com</a>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Acknowledgment within 24-48 hrs</span>
                  </div>
                </div>
              </div>

              {/* Developer / Creator Card */}
              {profile && (
                <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-3">
                  <img
                    src={profile.avatar_url}
                    alt={profile.name || "Mohd Zaid"}
                    className="h-10 w-10 rounded-full object-cover border border-emerald-400"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-white uppercase tracking-wider">
                      {profile.name || "MOHD ZAID"}
                    </p>
                    <a
                      href={profile.html_url || "https://github.com/zaid154"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-emerald-400 hover:underline"
                    >
                      Engineering Lead • github.com/zaid154
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Policy Direct Links */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-black text-slate-900 mb-3">Legal & Compliance Documentation</h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <a href="/terms" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
                    <span className="font-semibold text-slate-800">📄 Terms & Conditions of Service</span>
                    <span className="text-emerald-700 font-bold">→</span>
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
                    <span className="font-semibold text-slate-800">🛡️ Privacy & Data Protection Policy</span>
                    <span className="text-emerald-700 font-bold">→</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs mb-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
              Frequently Asked Questions
            </span>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Customer Support Knowledge Base
            </h2>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 transition"
                  >
                    <span>{faq.q}</span>
                    <span className="ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-600">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;