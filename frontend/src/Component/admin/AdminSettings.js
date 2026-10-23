import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Constants";

const AdminSettings = (props) => {
  const context = useOutletContext() || {};
  const showToast = props.showToast || context.showToast || alert;

  const [activeTab, setActiveTab] = useState("business"); // "business", "pricing", "operations"

  const [settings, setSettings] = useState({
    restaurantName: "Food Ninja",
    fssaiNumber: "10020011000123",
    gstinNumber: "07AAAAF1234A1Z5",
    storePhone: "+91 98765 43210",
    storeEmail: "support@foodninja.com",
    storeAddress: "Shop 12, Food Street, Sector 62, Delhi NCR",
    deliveryFee: 30,
    freeDeliveryThreshold: 499,
    packagingFee: 15,
    taxRate: 5,
    minOrderValue: 99,
    restaurantOpen: true,
    announcement: "Free delivery on orders above ₹499! Enjoy freshly cooked authentic meals.",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/settings`);
      const data = await res.json();
      if (data.settings) {
        setSettings({
          restaurantName: data.settings.restaurantName || "Food Ninja",
          fssaiNumber: data.settings.fssaiNumber || "",
          gstinNumber: data.settings.gstinNumber || "",
          storePhone: data.settings.storePhone || "",
          storeEmail: data.settings.storeEmail || "",
          storeAddress: data.settings.storeAddress || "",
          deliveryFee: data.settings.deliveryFee ?? 30,
          freeDeliveryThreshold: data.settings.freeDeliveryThreshold ?? 499,
          packagingFee: data.settings.packagingFee ?? 15,
          taxRate: data.settings.taxRate ?? 5,
          minOrderValue: data.settings.minOrderValue ?? 99,
          restaurantOpen: data.settings.restaurantOpen ?? true,
          announcement: data.settings.announcement ?? "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Settings and legal details saved successfully!");
      } else {
        alert(data.message || "Failed to save settings.");
      }
    } catch {
      alert("Error connecting to server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Store Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-200 bg-white p-5 rounded-2xl shadow-2xs">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Store & Legal Settings
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage FSSAI license, GSTIN, pricing, delivery thresholds, and live restaurant status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold border ${
              settings.restaurantOpen
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${settings.restaurantOpen ? "bg-emerald-600 animate-pulse" : "bg-rose-600"}`} />
            {settings.restaurantOpen ? "Store Open & Accepting Orders" : "Store Closed (Paused)"}
          </span>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("business")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "business"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>Business & Compliance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pricing")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "pricing"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Fees & Taxes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("operations")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "operations"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          <span>Operations & Banner</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Business & Compliance (FSSAI, GST, Restaurant Name, Address) */}
        {activeTab === "business" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Restaurant Brand & Statutory Compliance</h3>
              <p className="text-xs text-slate-400 mt-0.5">These legal details appear on customer invoices and KOT slips</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Restaurant / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={settings.restaurantName}
                  onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                  placeholder="e.g. Food Ninja"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">FSSAI License Number (14 digits) *</label>
                <input
                  type="text"
                  maxLength={14}
                  value={settings.fssaiNumber}
                  onChange={(e) => setSettings({ ...settings, fssaiNumber: e.target.value })}
                  placeholder="e.g. 10020011000123"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-400">Printed on bill slips and footer</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">GSTIN Number (15 characters) *</label>
                <input
                  type="text"
                  maxLength={15}
                  value={settings.gstinNumber}
                  onChange={(e) => setSettings({ ...settings, gstinNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. 07AAAAF1234A1Z5"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-emerald-500 font-mono uppercase"
                />
                <span className="text-[10px] text-slate-400">Mandatory for GST compliant tax invoicing</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Support Phone</label>
                <input
                  type="text"
                  value={settings.storePhone}
                  onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Support Email Address</label>
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  placeholder="e.g. support@foodninja.com"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Kitchen / Store Outlet Address</label>
                <textarea
                  rows={2}
                  value={settings.storeAddress}
                  onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                  placeholder="e.g. Shop 12, Food Street, Sector 62, Delhi NCR"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pricing & Fees */}
        {activeTab === "pricing" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Customer Fees, Thresholds & Taxes</h3>
              <p className="text-xs text-slate-400 mt-0.5">Applied automatically during cart checkout calculations</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Standard Delivery Fee (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.deliveryFee}
                  onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-400">Default delivery fee charged on orders</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Free Delivery Threshold (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-400">Orders above this cart value get free delivery (₹0)</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Packaging / Handling Fee (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.packagingFee}
                  onChange={(e) => setSettings({ ...settings, packagingFee: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-400">Container & spill-proof packaging charge</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Govt. Tax / GST Rate (%) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="28"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-400">Standard restaurant service tax (typically 5%)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Store Operations & Announcements */}
        {activeTab === "operations" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Kitchen Status & Storefront Announcement</h3>
              <p className="text-xs text-slate-400 mt-0.5">Control order intake and customer notices</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Live Store Status</label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, restaurantOpen: true })}
                    className={`rounded-xl border py-3 px-4 font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      settings.restaurantOpen
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    <span>Open for Orders</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, restaurantOpen: false })}
                    className={`rounded-xl border py-3 px-4 font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      !settings.restaurantOpen
                        ? "border-rose-600 bg-rose-50 text-rose-800 ring-2 ring-rose-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                    <span>Closed (Pause)</span>
                  </button>
                </div>
              </div>

              <div className="max-w-md">
                <label className="block font-bold text-slate-700 mb-1">Minimum Order Value (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.minOrderValue}
                  onChange={(e) => setSettings({ ...settings, minOrderValue: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-400">Checkout is blocked if total is below this amount</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Storefront Announcement Banner</label>
                <textarea
                  rows={3}
                  value={settings.announcement}
                  onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                  placeholder="e.g. Free delivery on orders above ₹499! Enjoy freshly cooked authentic meals."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-emerald-500 resize-none"
                />
                <span className="text-[10px] text-slate-400">Broadcasted across customer store header</span>
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || loading}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
