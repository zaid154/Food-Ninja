const Settings = require("../models/settingsModel");

const DEFAULT_PAUSE_NOTICE = "Orders temporarily paused by kitchen. We'll be back shortly!";
const STORE_TIME_ZONE = "Asia/Kolkata";
const TEXT_SETTING_FIELDS = "restaurantName fssaiNumber gstinNumber storePhone storeEmail storeAddress announcement openingTime closingTime operatingHoursText closedNoticeMessage".split(" ");
const NUMBER_SETTING_FIELDS = "deliveryFee freeDeliveryThreshold packagingFee taxRate minOrderValue".split(" ");
const BOOLEAN_SETTING_FIELDS = "restaurantOpen autoScheduleEnabled".split(" ");

const copySettingsFields = (target, source, fields, transform) => {
  for (const field of fields) {
    if (source[field] !== undefined) target[field] = transform(source[field]);
  }
};

const getStoreCurrentMinutes = (now) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: STORE_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const timeParts = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return Number(timeParts.hour) * 60 + Number(timeParts.minute);
};

const parseTime = (value) => {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return null;
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

// Check the restaurant's local time against daytime or overnight hours.
// Supports both normal (06:00–20:00) and overnight (18:00–02:00) ranges
const isWithinHours = (openingTime, closingTime, now = new Date()) => {
  if (!openingTime || !closingTime) return true;
  const currentMinutes = getStoreCurrentMinutes(now);
  const openMin = parseTime(openingTime);
  const closeMin = parseTime(closingTime);
  if (openMin === null || closeMin === null) return true;

  // Equal times represent a full-day schedule.
  if (openMin === closeMin) return true;

  if (closeMin > openMin) {
    // Normal daytime range (e.g. 06:00–20:00)
    return currentMinutes >= openMin && currentMinutes < closeMin;
  } else {
    // Overnight range (e.g. 18:00–02:00)
    return currentMinutes >= openMin || currentMinutes < closeMin;
  }
};

// Build the effective closed reason string
const buildClosedReason = (settings, withinHours) => {
  // Admin typed a custom message — highest priority
  if (settings.closedNoticeMessage && settings.closedNoticeMessage.trim()) {
    return settings.closedNoticeMessage.trim();
  }
  // Outside operating hours
  if (!withinHours) {
    const hours = settings.operatingHoursText || "6:00 AM – 8:00 PM";
    return `We are currently closed for orders. Kitchen hours: ${hours}. Orders will resume during operating hours!`;
  }
  // Manually paused during open hours with no custom message
  return DEFAULT_PAUSE_NOTICE;
};

const getStoreStatus = (settings, now = new Date()) => {
  const withinHours = isWithinHours(settings.openingTime, settings.closingTime, now);
  const autoSchedule = settings.autoScheduleEnabled !== false;
  const isEffectiveOpen = settings.restaurantOpen !== false && (!autoSchedule || withinHours);
  return {
    isWithinHours: withinHours,
    isEffectiveOpen,
    effectiveClosedReason: isEffectiveOpen ? "" : buildClosedReason(settings, withinHours),
  };
};

const serializeSettingsWithStatus = (settings) => {
  const settingsObj = settings.toObject ? settings.toObject() : { ...settings };
  return { ...settingsObj, ...getStoreStatus(settingsObj) };
};

// GET /api/settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: "store_settings" });
    if (!settings) {
      settings = await Settings.create({ key: "store_settings" });
    } else if (!settings.openingTime || !settings.closingTime || !settings.operatingHoursText) {
      settings.openingTime = settings.openingTime || "06:00";
      settings.closingTime = settings.closingTime || "20:00";
      settings.operatingHoursText = settings.operatingHoursText || "6:00 AM – 8:00 PM";
      await settings.save();
    }

    // Compute effective open/closed status
    return res.status(200).json({ success: true, settings: serializeSettingsWithStatus(settings) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch settings", error: error.message });
  }
};

// PUT /api/settings (Admin updates charges & settings)
const updateSettings = async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = {};
    copySettingsFields(updateData, body, TEXT_SETTING_FIELDS, (value) => value.trim());
    copySettingsFields(updateData, body, NUMBER_SETTING_FIELDS, Number);
    copySettingsFields(updateData, body, BOOLEAN_SETTING_FIELDS, Boolean);

    const settings = await Settings.findOneAndUpdate(
      { key: "store_settings" },
      { $set: updateData },
      { new: true, upsert: true }
    );

    // Compute effective status for the response
    return res.status(200).json({
      success: true,
      message: "Store charges and operational settings updated successfully!",
      settings: serializeSettingsWithStatus(settings),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update settings", error: error.message });
  }
};

module.exports = { getSettings, updateSettings, getStoreStatus };
