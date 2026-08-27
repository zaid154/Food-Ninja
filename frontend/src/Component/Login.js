import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "./Usercontext";
import { LOGO } from "../utils/Constants";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (email.trim() === "" || password.trim() === "") {
            setError("Please enter both email and password.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const res = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const data = await res.json();

            if (res.ok && data.user) {
                const loggedUser = {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role
                };

                localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
                setUser(loggedUser);

                // If admin logs in, unlock session and redirect
                if (data.user.role === "admin" || data.user.email === "admin@foodninja.com") {
                    sessionStorage.setItem("adminAuth", "true");
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                setError(data.message || "Invalid email or password. Please check your credentials.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Unable to connect to server. Please check your network connection.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl bg-white p-7 sm:p-8 shadow-sm border border-slate-200">
                {/* Brand Header */}
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 p-2 shadow-sm mb-3">
                        <img src={LOGO} alt="Food Ninja" className="h-full w-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">Welcome Back</h1>
                    <p className="mt-1 text-xs text-slate-500">
                        Login with your Food Ninja account to place orders.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="mt-6 space-y-4 text-xs">
                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Email Address</label>
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
                        <label className="block font-bold text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-10 text-xs outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                placeholder="Enter your password"
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
                        {submitting ? "Logging in..." : "Login to Account"}
                    </button>
                </form>

                {/* Footer Switch */}
                <p className="mt-6 text-center text-xs text-slate-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-bold text-emerald-600 hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;
