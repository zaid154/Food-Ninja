import React from "react";
import { Link } from "react-router-dom";
import { LOGO } from "../../utils/Constants";

const AdminLogin = ({ adminEmail, setAdminEmail, adminPassword, setAdminPassword, authError, onLogin }) => {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 p-2 shadow-2xs mb-3">
            <img src={LOGO} alt="Food Ninja" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Food<span className="text-emerald-600">Ninja</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Admin Dashboard
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Sign in with administrative credentials to manage store.
          </p>
        </div>

        <form onSubmit={onLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 outline-none focus:border-emerald-500"
              placeholder="admin@foodninja.com"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Admin Password</label>
            <input
              type="password"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 outline-none focus:border-emerald-500"
              placeholder="admin123"
            />
          </div>

          {authError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 py-3 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:bg-slate-800 active:scale-95"
          >
            Access Admin Dashboard →
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          <Link to="/" className="text-emerald-600 font-bold hover:underline">
            ← Return to Customer Store
          </Link>
        </p>
      </div>
    </section>
  );
};

export default AdminLogin;
