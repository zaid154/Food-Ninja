const Settings = require("../models/settingsModel");

const STORE_TIME_ZONE = "Asia/Kolkata";
const TEXT_FIELDS = "restaurantName fssaiNumber gstinNumber storePhone storeEmail storeAddress announcement openingTime closingTime operatingHoursText closedNoticeMessage".split(" ");
const NUMBER_FIELDS = "deliveryFee freeDeliveryThreshold packagingFee taxRate minOrderValue".split(" ");
const BOOLEAN_FIELDS = "restaurantOpen autoScheduleEnabled".split(" ");

const getStoreCurrentMinutes = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: STORE_TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return Number(p.hour) * 60 + Number(p.minute);
};

const parseTime = (v) => {
  if (typeof v !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(v)) return null;
  const [h, m] = v.split(":").map(Number);
  return h * 60 + m;
};

const isWithinHours = (openTime, closeTime, now = new Date()) => {
  if (!openTime || !closeTime) return true;
  const current = getStoreCurrentMinutes(now), open = parseTime(openTime), close = parseTime(closeTime);
  if (open === null || close === null || open === close) return true;
  return close > open ? current >= open && current < close : current >= open || current < close;
};

const buildClosedReason = (settings, withinHours) => {
  if (settings.closedNoticeMessage?.trim()) return settings.closedNoticeMessage.trim();
  if (!withinHours) {
    const hours = settings.operatingHoursText || "6:00 AM – 8:00 PM";
    return `We are currently closed for orders. Kitchen hours: ${hours}. Orders will resume during operating hours!`;
  }
  return "Orders temporarily paused by kitchen. We'll be back shortly!";
};

const getStoreStatus = (settings, now = new Date()) => {
  const withinHours = isWithinHours(settings.openingTime, settings.closingTime, now);
  const autoSchedule = settings.autoScheduleEnabled !== false;
  const isEffectiveOpen = settings.restaurantOpen !== false && (!autoSchedule || withinHours);
  return { isWithinHours: withinHours, isEffectiveOpen, effectiveClosedReason: isEffectiveOpen ? "" : buildClosedReason(settings, withinHours) };
};

const serializeSettingsWithStatus = (settings) => {
  const obj = settings.toObject ? settings.toObject() : { ...settings };
  return { ...obj, ...getStoreStatus(obj) };
};

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: "store_settings" });
    if (!settings) {
      return res.status(200).json({ success: true, settings: null });
    }
    return res.status(200).json({ success: true, settings: serializeSettingsWithStatus(settings) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch settings", error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const body = req.body || {}, updateData = {};
    TEXT_FIELDS.forEach((f) => { if (body[f] !== undefined) updateData[f] = String(body[f]).trim(); });
    NUMBER_FIELDS.forEach((f) => { if (body[f] !== undefined) updateData[f] = Number(body[f]); });
    BOOLEAN_FIELDS.forEach((f) => { if (body[f] !== undefined) updateData[f] = Boolean(body[f]); });

    const settings = await Settings.findOneAndUpdate({ key: "store_settings" }, { $set: updateData }, { new: true, upsert: true });
    return res.status(200).json({
      success: true, message: "Store charges and operational settings updated successfully!",
      settings: serializeSettingsWithStatus(settings),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update settings", error: error.message });
  }
};

module.exports = { getSettings, updateSettings, getStoreStatus };
