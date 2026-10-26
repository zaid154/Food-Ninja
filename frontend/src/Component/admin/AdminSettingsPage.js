import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Constants";
import { getKitchenHoursClosedNotice, getStoreCurrentMinutes } from "../../utils/storeNotices";
import { calculateOrderPricing } from "../../utils/orderPricing";
import AdminDropdown from "./AdminDropdown";
import { useAppDialog } from "../AppDialog";

const TIME_HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, "0"));
const TIME_MINUTE_OPTIONS = Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, "0"));

const OperatingTimePicker = ({ label, value = "06:00", onChange }) => {
  const [hour = "06", minute = "00"] = value.split(":");
  const triggerClassName = "!rounded-lg !border-0 !bg-transparent !px-2 !py-2.5 font-mono text-xs";

  return (
    <div>
      <span className="block text-[10px] text-slate-500 font-semibold mb-1">{label}</span>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center rounded-xl border border-slate-200 bg-slate-50/50 px-1 focus-within:border-emerald-500">
        <AdminDropdown
          value={hour}
          options={TIME_HOUR_OPTIONS}
          onChange={(nextHour) => onChange(`${nextHour}:${minute}`)}
          compact
          triggerClassName={triggerClassName}
        />
        <span className="font-mono text-xs text-slate-700">:</span>
        <AdminDropdown
          value={minute}
          options={TIME_MINUTE_OPTIONS}
          onChange={(nextMinute) => onChange(`${hour}:${nextMinute}`)}
          compact
          triggerClassName={triggerClassName}
        />
      </div>
    </div>
  );
};

const AdminSettingsPage = (props) => {
  const context = useOutletContext() || {};
  const { alert: showDialog } = useAppDialog();
  const showToast = props.showToast || context.showToast || showDialog;

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
  const [billPreviewMode, setBillPreviewMode] = useState("customer");
  const [isBillPreviewOpen, setIsBillPreviewOpen] = useState(false);

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
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("store_settings_updated", { detail: data.settings }));
        }
      } else {
        showDialog(data.message || "Failed to save settings.", { title: "Could not save settings", variant: "error" });
      }
    } catch {
      showDialog("Could not connect to the server. Please try again.", { title: "Connection error", variant: "error" });
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

  // Sample bill used to preview how the saved settings print on a two-item order.
  const previewItems = [
    { name: "Butter Chicken", portionSize: "Full Plate", quantity: 1, price: 850 },
    { name: "Paneer Tikka Masala", portionSize: "Half Plate", quantity: 2, price: 320 },
  ];
  const previewQuantity = previewItems.reduce((sum, item) => sum + item.quantity, 0);
  const previewDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const previewSubtotal = previewItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const previewPricing = calculateOrderPricing({ subtotal: previewSubtotal, settings });
  const { taxes: previewTax, packagingFee: previewPackagingFee, deliveryFee: previewDelivery, grandTotal: previewGrandTotal } = previewPricing;

  // Mirror the server's daytime and overnight schedule calculation for a live preview.
  const openingMinutes = /^([01]\d|2[0-3]):[0-5]\d$/.test(settings.openingTime || "")
    ? Number(settings.openingTime.slice(0, 2)) * 60 + Number(settings.openingTime.slice(3)) : null;
  const closingMinutes = /^([01]\d|2[0-3]):[0-5]\d$/.test(settings.closingTime || "")
    ? Number(settings.closingTime.slice(0, 2)) * 60 + Number(settings.closingTime.slice(3)) : null;
  const currentMinutes = getStoreCurrentMinutes();
  const isWithinHours = openingMinutes === null || closingMinutes === null || openingMinutes === closingMinutes
    ? true
    : closingMinutes > openingMinutes
      ? currentMinutes >= openingMinutes && currentMinutes < closingMinutes
      : currentMinutes >= openingMinutes || currentMinutes < closingMinutes;
  const isPreviewOpen = settings.restaurantOpen !== false && (settings.autoScheduleEnabled === false || isWithinHours);
  const showClosedNoticeEditor = !isPreviewOpen;
  const previewBannerText = settings.closedNoticeMessage?.trim()
    || (!isWithinHours
      ? getKitchenHoursClosedNotice(settings.operatingHoursText)
      : "Orders temporarily paused by kitchen. We'll be back shortly!");

  return (
    <div className="space-y-6 w-full">
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
          <button
            type="button"
            onClick={() => setIsBillPreviewOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:border-emerald-300 hover:text-emerald-800"
          >
            <svg className="h-3.5 w-3.5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 3h16v18l-3-2-3 2-3-2-3 2-4-2z" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
            Bill Preview
          </button>
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

      <div className="space-y-6">
        <form onSubmit={handleSave} className="space-y-5">
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

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm">Store Operations & Announcement Banner</h2>
              <p className="text-xs text-slate-400 mt-0.5">Control live order intake and customer announcements</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Manual Store Status</label>
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
                <p className="mt-2 max-w-md text-[10px] text-slate-400">
                  Open clears the manual pause. If auto-close is enabled, orders still stop outside kitchen hours.
                </p>
              </div>

              {showClosedNoticeEditor && (
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
                  <span className="text-[10px] text-slate-400 block">Shown on the storefront header, cart, and checkout whenever the store is closed</span>
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

              <div className="max-w-md">
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Kitchen Operating Hours</label>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {settings.operatingHoursText || "6:00 AM – 8:00 PM"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <OperatingTimePicker
                    label="Opening Time"
                    value={settings.openingTime || "06:00"}
                    onChange={(value) => updateHours(value, undefined)}
                  />
                  <OperatingTimePicker
                    label="Closing Time"
                    value={settings.closingTime || "20:00"}
                    onChange={(value) => updateHours(undefined, value)}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Displayed to customers on the header and during closed hours. Schedule uses India Standard Time (IST).
                </span>

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

        {isBillPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3" onClick={() => setIsBillPreviewOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Live POS KOT and bill preview" className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="space-y-2.5 pb-2.5 border-b border-slate-100">
              <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-800">
                <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Live POS KOT & Bill Preview</span>
                </div>
                <button type="button" onClick={() => setIsBillPreviewOpen(false)} aria-label="Close bill preview" className="rounded-md px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 text-[10px] font-bold" aria-label="Preview type">
                {[['kot', 'KOT'], ['customer', 'Bill']].map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setBillPreviewMode(mode)}
                    aria-pressed={billPreviewMode === mode}
                    className={`rounded-lg px-1.5 py-2 transition ${billPreviewMode === mode ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    <span className="block">{label}</span>
                    <span className="mt-0.5 block text-[8px] font-medium opacity-70">{mode === "kot" ? "Kitchen copy" : "Customer copy"}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-2.5 font-mono text-[10px] leading-tight text-slate-800 space-y-1.5">
              <div className="max-h-[62vh] overflow-y-auto pr-1">
                <div className="border-b border-dashed border-slate-300 pb-1.5 text-center">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">{settings.restaurantName || "FOOD NINJA"}</h3>
                  {billPreviewMode !== "kot" && <p className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">Tax Invoice & Delivery Bill</p>}
                  {billPreviewMode === "customer" && (
                  <>
                    <p className="mt-1 text-[9px] font-semibold text-slate-600">FSSAI: {settings.fssaiNumber || "10020011000123"}</p>
                    <p className="text-[9px] font-semibold text-slate-600">GSTIN: {settings.gstinNumber || "07AAAAF1234A1Z5"}</p>
                    {settings.storeAddress && <p className="mt-1 truncate text-[8.5px] text-slate-400">{settings.storeAddress}</p>}
                    {settings.storePhone && <p className="text-[8.5px] text-slate-400">Phone: {settings.storePhone}</p>}
                  </>
                  )}
                </div>

                <div className="space-y-1 border-b border-dashed border-slate-300 py-1.5 text-[10px]">
                  <div className="flex justify-between gap-2"><span className="font-bold">{billPreviewMode === "kot" ? "KOT #LIVE-PREVIEW" : "ORDER #LIVE-PREVIEW"}</span><span className="shrink-0 text-slate-400">{previewDate}</span></div>
                  <div className="flex justify-between gap-2"><span className="font-bold text-slate-600">TYPE</span><span>Home Delivery</span></div>
                  <div><span className="font-bold text-slate-600">CUSTOMER: </span><span className="font-bold">Mohd Zaid</span></div>
                  <div><span className="font-bold text-slate-600">PHONE: </span>+91 98765 43210</div>
                  <div className="break-words"><span className="font-bold text-slate-600">ADDRESS: </span>Flat 402, Sunshine Heights, Sector 62, Noida</div>
                  {billPreviewMode === "kot" ? (
                    <>
                      <div className="flex justify-between gap-2"><span className="font-bold text-slate-600">STATUS</span><span>New order</span></div>
                      <div className="rounded-md bg-amber-50 px-2 py-1"><span className="font-bold">KITCHEN NOTE:</span> No special instructions</div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between gap-2"><span className="font-bold text-slate-600">PAYMENT MODE</span><span className="font-bold">Cash on Delivery</span></div>
                      <div className="flex justify-between gap-2"><span className="font-bold text-slate-600">PAYMENT STATUS</span><span className="font-bold text-amber-800">Pending · Collect ₹{previewGrandTotal}</span></div>
                    </>
                  )}
                </div>

                <table className="w-full border-b border-dashed border-slate-300 text-[9px]">
                  <thead>
                    <tr className="border-b border-dashed border-slate-200 text-[8px] font-bold text-slate-500">
                      <th className="py-1 text-left">ITEM</th>
                      <th className="w-7 py-1 text-center">QTY</th>
                      {billPreviewMode !== "kot" && <><th className="w-10 py-1 text-right">RATE</th><th className="w-12 py-1 text-right">TOTAL</th></>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewItems.map((item) => (
                      <tr key={item.name}>
                        <td className="py-1.5 pr-1 font-semibold text-slate-800">{item.name}<span className="block text-[8px] font-normal text-slate-500">{item.portionSize}</span></td>
                        <td className="py-1.5 text-center font-bold">{item.quantity}</td>
                        {billPreviewMode !== "kot" && <><td className="py-1.5 text-right">₹{item.price}</td><td className="py-1.5 text-right font-bold">₹{item.quantity * item.price}</td></>}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {billPreviewMode !== "kot" && (
                  <div>
                    <div className="space-y-1 py-1 text-[10px]">
                      <div className="flex justify-between text-slate-600"><span>Item Subtotal ({previewItems.length} items · {previewQuantity} qty)</span><span>₹{previewSubtotal}</span></div>
                      <div className="flex justify-between text-slate-600"><span>Delivery Fee</span><span>{previewDelivery === 0 ? "FREE" : `₹${previewDelivery}`}</span></div>
                      {billPreviewMode === "customer" && (
                        <>
                          <div className="flex justify-between text-slate-600"><span>Packaging / Handling</span><span>₹{previewPackagingFee}</span></div>
                          <div className="flex justify-between text-slate-600"><span>GST ({settings.taxRate ?? 5}%)</span><span>₹{previewTax}</span></div>
                          <div className="flex justify-between text-emerald-700"><span>Discount</span><span>−₹{previewPricing.discountAmount}</span></div>
                        </>
                      )}
                      <div className="flex justify-between border-t border-slate-300 pt-1 text-xs font-black text-slate-900">
                        <span>GRAND TOTAL</span><span className="text-emerald-700">₹{previewGrandTotal}</span>
                      </div>
                    </div>

                    <div className="mt-1 rounded-lg border border-amber-300 bg-amber-50 p-1.5 text-center text-[9px] text-amber-950">
                      <span className="block font-black">★ CASH TO COLLECT: ₹{previewGrandTotal} ★</span>
                      <span className="text-[8px] text-slate-600">Rider: collect exact cash on handover</span>
                    </div>
                    {billPreviewMode === "customer" && (
                      <>
                        <div className="flex justify-between border-t border-dashed border-slate-300 pt-1.5 text-[8px] text-slate-500"><span>Rider: ______________</span><span>Customer: ______________</span></div>
                        <div className="border-t border-dashed border-slate-300 pt-1.5 text-center text-[8px] text-slate-500">
                          <p className="font-bold">CUSTOMER TAX INVOICE & DELIVERY BILL</p>
                          <p>Thank you for ordering with {settings.restaurantName || "Food Ninja"}!</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
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
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettingsPage;
