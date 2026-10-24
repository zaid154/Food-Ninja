import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Constants";

const AdminSettings = (props) => {
  const context = useOutletContext() || {};
  const showToast = props.showToast || context.showToast || alert;

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
    openingTime: "06:00",
    closingTime: "20:00",
    operatingHoursText: "6:00 AM – 8:00 PM",
    closedNoticeMessage: "",
    autoScheduleEnabled: true,
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
          openingTime: data.settings.openingTime || "06:00",
          closingTime: data.settings.closingTime || "20:00",
          operatingHoursText: data.settings.operatingHoursText || "6:00 AM – 8:00 PM",
          closedNoticeMessage: data.settings.closedNoticeMessage || "",
          autoScheduleEnabled: data.settings.autoScheduleEnabled !== false,
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
    if (e && e.preventDefault) e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("All settings & legal details saved successfully!");
      } else {
        alert(data.message || "Failed to save settings.");
      }
    } catch {
      alert("Error connecting to server.");
    } finally {
      setSaving(false);
    }
  };

  const formatTime12h = (t24) => {
    if (!t24) return "";
    const parts = t24.split(":");
    const h = parseInt(parts[0], 10);
    const m = parts[1] || "00";
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const updateHours = (newOpen, newClose) => {
    const o = newOpen !== undefined ? newOpen : (settings.openingTime || "06:00");
    const c = newClose !== undefined ? newClose : (settings.closingTime || "20:00");
    const text = `${formatTime12h(o)} – ${formatTime12h(c)}`;
    setSettings((prev) => ({
      ...prev,
      openingTime: o,
      closingTime: c,
      operatingHoursText: text,
    }));
  };

  // Live computed preview values
  const previewSubtotal = 1490;
  const previewTax = Math.round(previewSubtotal * ((settings.taxRate || 5) / 100));
  const previewDelivery = previewSubtotal >= (settings.freeDeliveryThreshold || 499) ? 0 : (settings.deliveryFee || 30);

  // Mirror the server's daytime and overnight schedule calculation for a live preview.
  const openingMinutes = /^([01]\d|2[0-3]):[0-5]\d$/.test(settings.openingTime || "")
    ? Number(settings.openingTime.slice(0, 2)) * 60 + Number(settings.openingTime.slice(3)) : null;
  const closingMinutes = /^([01]\d|2[0-3]):[0-5]\d$/.test(settings.closingTime || "")
    ? Number(settings.closingTime.slice(0, 2)) * 60 + Number(settings.closingTime.slice(3)) : null;
  const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const isWithinHours = openingMinutes === null || closingMinutes === null || openingMinutes === closingMinutes
    ? true
    : closingMinutes > openingMinutes
      ? currentMinutes >= openingMinutes && currentMinutes < closingMinutes
      : currentMinutes >= openingMinutes || currentMinutes < closingMinutes;
  const isPreviewOpen = settings.restaurantOpen !== false && (settings.autoScheduleEnabled === false || isWithinHours);
  const previewBannerText = settings.closedNoticeMessage?.trim()
    || (!isWithinHours
      ? `We are currently closed for orders. Kitchen hours: ${settings.operatingHoursText || "6:00 AM – 8:00 PM"}. Orders will resume during operating hours!`
      : "Orders temporarily paused by kitchen. We'll be back shortly!");
  const previewGrandTotal = previewSubtotal + previewDelivery + previewTax;

  return (
    <div className="space-y-6 w-full">
      {/* Page Title & Status Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Store & Legal Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure dynamic statutory compliance, restaurant branding, taxes, fees, and operational status
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
              isPreviewOpen
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isPreviewOpen ? "bg-emerald-600 animate-pulse" : "bg-rose-600"}`} />
            {isPreviewOpen ? "Open for Orders" : "Store Closed"}
          </span>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2-Column Balanced Dashboard (Zero Empty Space) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): The 3 Scrollable Form Sections */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5">
          {/* Section 1: Business & Compliance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm">Restaurant Brand & Compliance</h2>
              <p className="text-xs text-slate-400 mt-0.5">Printed live on customer invoices, KOT slips, and website footer</p>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Restaurant / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={settings.restaurantName}
                  onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                  placeholder="e.g. Food Ninja"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 font-semibold"
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
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
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
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 font-mono uppercase"
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
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Support Email Address</label>
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  placeholder="e.g. support@foodninja.com"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Kitchen / Outlet Address</label>
                <textarea
                  rows={2}
                  value={settings.storeAddress}
                  onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                  placeholder="e.g. Shop 12, Food Street, Sector 62, Delhi NCR"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Fees & Taxes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm">Fees, Thresholds & Taxes</h2>
              <p className="text-xs text-slate-400 mt-0.5">Applied automatically during cart checkout calculations</p>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Standard Delivery Fee (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.deliveryFee}
                  onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
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
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
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
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
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
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-400">Standard restaurant service tax (typically 5%)</span>
              </div>
            </div>
          </div>

          {/* Section 3: Operations & Announcements */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm">Store Operations & Announcement Banner</h2>
              <p className="text-xs text-slate-400 mt-0.5">Control live order intake and customer announcements</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Live Store Status</label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, restaurantOpen: true })}
                    className={`rounded-xl border py-2.5 px-3 font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      settings.restaurantOpen
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    <span>Open for Orders</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, restaurantOpen: false })}
                    className={`rounded-xl border py-2.5 px-3 font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      !settings.restaurantOpen
                        ? "border-rose-600 bg-rose-50 text-rose-800 ring-2 ring-rose-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-rose-600" />
                    <span>Closed (Pause)</span>
                  </button>
                </div>
              </div>

              {/* Custom Pause / Closed Notice */}
              {!settings.restaurantOpen && (
                <div className="max-w-md space-y-2">
                  <label className="block font-bold text-slate-700">Custom Pause / Closed Notice <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <textarea
                    rows={2}
                    value={settings.closedNoticeMessage || ""}
                    onChange={(e) => setSettings({ ...settings, closedNoticeMessage: e.target.value })}
                    placeholder="Leave empty for default notice, or type a custom reason..."
                    className="w-full rounded-xl border border-rose-200 px-3 py-2 outline-none focus:border-rose-400 resize-none bg-rose-50/30 text-xs"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Heavy Kitchen Rush — Resuming soon",
                      "Temporary Kitchen Maintenance",
                      "Special Event / Private Catering",
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setSettings({ ...settings, closedNoticeMessage: chip })}
                        className="text-[10px] font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 border border-rose-200 rounded-full px-2.5 py-1 transition cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 block">Shown on the storefront header, cart, and checkout when store is paused</span>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-[11px] font-bold text-white shadow-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save Store Status & Notice"}
                  </button>
                  <span className="ml-2 text-[10px] text-slate-500">Save to apply this notice to the storefront.</span>
                </div>
              )}

              {/* Operating Hours (Opening & Closing) */}
              <div className="max-w-md">
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Kitchen Operating Hours</label>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {settings.operatingHoursText || "6:00 AM – 8:00 PM"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-semibold mb-1">Opening Time</span>
                    <input
                      type="time"
                      value={settings.openingTime || "06:00"}
                      onChange={(e) => updateHours(e.target.value, undefined)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 font-mono text-xs bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-semibold mb-1">Closing Time</span>
                    <input
                      type="time"
                      value={settings.closingTime || "20:00"}
                      onChange={(e) => updateHours(undefined, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 font-mono text-xs bg-slate-50/50"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Displayed to customers on the header and during closed hours
                </span>

                {/* Auto-enforce operating hours toggle */}
                <label className="flex items-center gap-2.5 mt-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings.autoScheduleEnabled !== false}
                    onChange={(e) => setSettings({ ...settings, autoScheduleEnabled: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold text-slate-700">
                    Auto-close outside kitchen hours
                  </span>
                </label>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  When enabled, orders are automatically blocked before opening time and after closing time
                </span>
              </div>

              <div className="max-w-md">
                <label className="block font-bold text-slate-700 mb-1">Minimum Order Value (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.minOrderValue}
                  onChange={(e) => setSettings({ ...settings, minOrderValue: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-400">Checkout is blocked if total is below this amount</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Storefront Announcement Banner</label>
                <textarea
                  rows={2}
                  value={settings.announcement}
                  onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                  placeholder="e.g. Free delivery on orders above ₹499! Enjoy freshly cooked authentic meals."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500 resize-none"
                />
                <span className="text-[10px] text-slate-400">Broadcasted across customer store notice bar</span>
              </div>
            </div>
          </div>

          {/* Bottom Save Action Button */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-6">
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

        {/* Right Column (5 cols): Real-Time Live KOT Slip & Invoice Preview */}
        <aside className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Live POS KOT & Bill Preview</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                80mm Thermal
              </span>
            </div>

            {/* Simulated Live Receipt (Exact Real-Time Match with KOT Slip) */}
            <div className="mt-3 p-3.5 bg-slate-50/70 rounded-xl border border-dashed border-slate-300 font-mono text-slate-800 text-[11px] leading-tight space-y-2">
              <div className="text-center pb-2 border-b border-dashed border-slate-300">
                <h3 className="text-sm font-black tracking-wider text-slate-900 uppercase">
                  {settings.restaurantName || "FOOD NINJA"}
                </h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  Tax Invoice & Delivery Bill
                </p>
                <p className="text-[9px] text-slate-600 mt-1 font-semibold">
                  FSSAI: {settings.fssaiNumber || "10020011000123"}
                </p>
                <p className="text-[9px] text-slate-600 font-semibold">
                  GSTIN: {settings.gstinNumber || "07AAAAF1234A1Z5"}
                </p>
                {settings.storeAddress && (
                  <p className="text-[8.5px] text-slate-400 mt-1 truncate">
                    {settings.storeAddress}
                  </p>
                )}
                {settings.storePhone && (
                  <p className="text-[8.5px] text-slate-400">
                    Phone: {settings.storePhone}
                  </p>
                )}
              </div>

              {/* Sample Order Metadata */}
              <div className="py-1 text-[10px] space-y-0.5 border-b border-dashed border-slate-300">
                <div className="flex justify-between">
                  <span className="font-bold">ORDER #LIVE-PREVIEW</span>
                  <span className="text-slate-400">Today</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>CUSTOMER: Mohd Zaid</span>
                  <span className="rounded bg-amber-100 text-amber-950 font-black px-1.5 py-0.5 border border-amber-300 text-[9px]">
                    COD: COLLECT ₹{previewGrandTotal}
                  </span>
                </div>
              </div>

              {/* Sample Bill Calculation */}
              <div className="py-1 text-[10.5px] space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Item Subtotal</span>
                  <span>₹{previewSubtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span>{previewDelivery === 0 ? "FREE" : `₹${previewDelivery}`}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Packaging & GST ({settings.taxRate || 5}%)</span>
                  <span>₹{previewTax}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-300 text-xs font-black text-slate-900">
                  <span>GRAND TOTAL</span>
                  <span className="text-emerald-700">₹{previewGrandTotal}</span>
                </div>
              </div>

              {/* Rider Note Preview */}
              <div className="p-1.5 rounded-lg border border-amber-300 bg-amber-50 text-center text-[9px] text-amber-950">
                <span className="font-black block">★ CASH TO COLLECT: ₹{previewGrandTotal} ★</span>
                <span className="text-[8px] text-slate-600">Rider Note: Collect cash before handover</span>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-300 text-center text-[9px] text-slate-400">
                <p className="font-bold text-slate-600">*** CUSTOMER BILL & DELIVERY CHALLAN ***</p>
                <p className="mt-0.5">Edits above update on printed slips immediately</p>
              </div>
            </div>

            {/* Announcement & Status Banner Live Card */}
            {!isPreviewOpen ? (
              <div className="mt-3 p-3 rounded-xl bg-rose-50/90 border border-rose-300 text-xs text-rose-950">
                <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider block mb-1">
                  Live Closed Storefront Banner:
                </span>
                <p className="text-[11px] font-semibold leading-snug">
                  {previewBannerText}
                </p>
              </div>
            ) : settings.announcement ? (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-0.5">
                  Live Storefront Banner Preview:
                </span>
                <p className="text-[11px] font-medium leading-snug">
                  {settings.announcement}
                </p>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminSettings;
