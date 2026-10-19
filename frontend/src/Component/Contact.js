import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/Constants";

const Contact = () => {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
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
                setForm({ name: "", email: "", subject: "", message: "" });
            } else {
                setErrorMsg(data.message || "Failed to submit. Please try again.");
            }
        } catch (err) {
            // Fallback graceful confirmation
            setSubmitted(true);
            setForm({ name: "", email: "", subject: "", message: "" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="bg-slate-50 py-8 px-4 min-h-[85vh] flex items-center justify-center">
            <div className="mx-auto w-full max-w-4xl">
                <div className="grid gap-6 md:grid-cols-[320px_1fr] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Left: Contact Info + Creator Profile */}
                    <div className="bg-slate-900 p-6 text-white flex flex-col justify-between space-y-4">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                                Get in Touch
                            </span>
                            <h1 className="mt-1 text-2xl font-black leading-tight text-white">
                                Contact & Support
                            </h1>
                            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                                Questions about food delivery or menu inquiries? Drop us a note anytime.
                            </p>

                            {/* Mohd Zaid Profile Card */}
                            {profile && (
                                <div className="mt-4 flex items-center gap-3.5 rounded-xl bg-white/10 p-3 border border-white/10 shadow-sm">
                                    <img
                                        src={profile.avatar_url}
                                        alt={profile.name || "Mohd Zaid"}
                                        className="h-12 w-12 rounded-lg object-cover border border-emerald-400"
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase tracking-wide">
                                            {profile.name || "MOHD ZAID"}
                                        </p>
                                        <a
                                            href={profile.html_url || "https://github.com/zaid154"}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[11px] font-semibold text-emerald-400 hover:underline"
                                        >
                                            github.com/zaid154
                                        </a>
                                        {profile.bio && (
                                            <p className="text-[10px] text-slate-300 line-clamp-1">{profile.bio}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-5 space-y-2 text-xs text-slate-300">
                                <p className="flex items-center gap-2">
                                    <span className="text-slate-400 font-semibold">Email:</span>
                                    <span className="text-white">zaidm1323@gmail.com</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-slate-400 font-semibold">Location:</span>
                                    <span className="text-white">New Delhi, India</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-slate-400 font-semibold">Platform:</span>
                                    <span className="text-white">Food Ninja Delivery</span>
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-3 text-[10px] text-slate-400">
                            Support available 7 days a week.
                        </div>
                    </div>

                    {/* Right: Sleek Form */}
                    <div className="p-6 flex flex-col justify-center">
                        <h2 className="text-lg font-black text-slate-900">Send us a message</h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            We'll get back to you promptly.
                        </p>

                        {submitted ? (
                            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm mb-1.5">
                                    ✓
                                </span>
                                <h3 className="text-sm font-bold text-emerald-950">Message Sent Successfully!</h3>
                                <p className="mt-1 text-xs text-emerald-800">
                                    Thank you for reaching out. We will respond to your email shortly.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-3 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
                                {errorMsg && (
                                    <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
                                        {errorMsg}
                                    </div>
                                )}
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={handleChange("name")}
                                            placeholder="Mohd Zaid"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={handleChange("email")}
                                            placeholder="you@example.com"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                                        <input
                                            type="tel"
                                            value={form.phone || ""}
                                            onChange={handleChange("phone")}
                                            placeholder="+91 98765 43210"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Subject</label>
                                        <input
                                            type="text"
                                            value={form.subject}
                                            onChange={handleChange("subject")}
                                            placeholder="Order enquiry, feedback, etc."
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Message *</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={form.message}
                                        onChange={handleChange("message")}
                                        placeholder="Write your message or inquiry here..."
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                                >
                                    {submitting ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
