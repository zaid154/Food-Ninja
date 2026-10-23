import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Constants";

const AdminSettings = (props) => {
  const context = useOutletContext() || {};
  const showToast = props.showToast || context.showToast || alert;

  const [settings, setSettings] = useState({
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
        showToast("Store charges & operational settings saved successfully!");
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
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 bg-white p-5 rounded-xl shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Store Charges & Operational Settings
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure delivery fees, free delivery limits, taxes, and store availability
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold border ${
              settings.restaurantOpen
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            Store Status: {settings.restaurantOpen ? "OPEN & ACCEPTING" : "TEMPORARILY CLOSED"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
        {/* Card 1: Delivery & Packaging Charges */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Delivery & Customer Fees</h3>
            <p className="text-xs text-slate-400 mt-0.5">Applied automatically during cart checkout</p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Standard Delivery Fee (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[10px] text-slate-400">Default delivery charge per order</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Free Delivery Threshold (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[10px] text-slate-400">Orders above this cart value get ₹0 delivery fee</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Packaging / Handling Fee (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={settings.packagingFee}
                onChange={(e) => setSettings({ ...settings, packagingFee: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[10px] text-slate-400">Eco-friendly container & spill-proof packaging charge</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimated Tax / GST Rate (%) *</label>
              <input
                type="number"
                required
                min="0"
                max="28"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[10px] text-slate-400">Restaurant GST percentage (typically 5% for restaurant service)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Operations & Announcements */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Store Operations & Thresholds</h3>
            <p className="text-xs text-slate-400 mt-0.5">Control store opening and minimum order requirements</p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Minimum Order Value (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={settings.minOrderValue}
                onChange={(e) => setSettings({ ...settings, minOrderValue: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[10px] text-slate-400">Customers cannot place orders below this amount</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Restaurant Availability</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, restaurantOpen: true })}
                  className={`flex-1 rounded-lg border py-2.5 px-3 font-bold transition flex items-center justify-center gap-2 ${
                    settings.restaurantOpen
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span>Open for Orders</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, restaurantOpen: false })}
                  className={`flex-1 rounded-lg border py-2.5 px-3 font-bold transition flex items-center justify-center gap-2 ${
                    !settings.restaurantOpen
                      ? "border-rose-600 bg-rose-50 text-rose-800"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-rose-600" />
                  <span>Closed (Pause Orders)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Storefront Announcement Banner</label>
              <textarea
                rows={3}
                value={settings.announcement}
                onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                placeholder="Special offer or festive update displayed to visiting customers..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 resize-none"
              />
              <span className="text-[10px] text-slate-400">Displayed in top store notice bar</span>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={saving || loading}
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? "Saving Charges..." : "Save Store Settings"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
