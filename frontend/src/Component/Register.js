import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/Constants";
import BrandLogo from "./BrandLogo";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
            setError("Please fill all required fields.");
            return;
        }

        if (password.length < 4) {
            setError("Password must be at least 4 characters long.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const res = await fetch(`${API_BASE_URL}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password,
                    phone: phone.trim()
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Account created successfully! Please login with your credentials.");
                navigate("/login");
            } else {
                setError(data.message || "Registration failed. Please try a different email.");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("Unable to connect to server. Please check your network connection.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl bg-white p-7 sm:p-8 shadow-sm border border-slate-200">
                {/* Brand Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex justify-center mb-3">
                        <BrandLogo to="/" size="lg" badge hideText />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">
                        Join Food<span className="text-emerald-600">Ninja</span>
                    </h1>
                    <p className="mt-1 text-xs text-slate-500">
                        Sign up to order delicious meals and track deliveries.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleRegister} className="mt-6 space-y-4 text-xs">
                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            placeholder="e.g. Mohd Zaid"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            placeholder="10-digit mobile number"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Password *</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-10 text-xs outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                placeholder="Create a strong password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-[11px]"
                            >
                                {showPassword ? "HIDE" : "SHOW"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-lg bg-emerald-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                    >
                        {submitting ? "Creating Account..." : "Register Account"}
                    </button>
                </form>

                {/* Footer Switch */}
                <p className="mt-6 text-center text-xs text-slate-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-bold text-emerald-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Register;
