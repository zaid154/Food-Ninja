import React from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../BrandLogo";

const AdminLogin = ({ adminEmail, setAdminEmail, adminPassword, setAdminPassword, authError, onLogin }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl bg-white p-7 sm:p-8 shadow-sm border border-slate-200/90">
        <div className="text-center mb-6">
          <div className="inline-flex justify-center mb-3">
            <BrandLogo to="/" size="lg" badge hideText />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Food<span className="text-emerald-600">Ninja</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Admin Dashboard
          </p>
          <p className="mt-1.5 text-xs text-slate-400">
            Sign in with administrative credentials to manage store.
          </p>
        </div>

        <form onSubmit={onLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 outline-none focus:border-emerald-500 transition"
              placeholder="admin@foodninja.com"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Admin Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-10 outline-none focus:border-emerald-500 transition"
                placeholder="admin123"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 hover:text-slate-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {authError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-2xs transition hover:bg-slate-800 active:scale-95"
          >
            Access Admin Dashboard →
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          <Link to="/" className="text-emerald-600 font-semibold hover:underline">
            ← Return to Customer Store
          </Link>
        </p>
      </div>
    </section>
  );
};

export default AdminLogin;
