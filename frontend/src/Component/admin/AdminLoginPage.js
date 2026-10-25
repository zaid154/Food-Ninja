import { useState } from "react";
import { Link } from "react-router-dom";
import { LOGO } from "../../utils/Constants";

const AdminLoginPage = ({ adminEmail, setAdminEmail, adminPassword, setAdminPassword, authError, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl bg-white p-7 sm:p-8 shadow-sm border border-slate-200/90">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex justify-center mb-3">
            <img src={LOGO} alt="Food Ninja Admin" className="h-14 w-14 rounded-full object-cover shadow-xs border border-slate-200" />
          </Link>
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

          {/* Quick Demo Credentials Box */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
            <div className="text-[11px] text-slate-500">
              <p className="font-semibold text-slate-700">Demo Credentials</p>
              <p className="font-mono text-slate-500">admin@foodninja.com / admin123</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAdminEmail("admin@foodninja.com");
                setAdminPassword("admin123");
              }}
              className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md px-2 py-1 text-[11px] font-bold transition cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>

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

export default AdminLoginPage;
