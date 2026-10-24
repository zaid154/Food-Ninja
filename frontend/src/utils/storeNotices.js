const DEFAULT_OPERATING_HOURS = "6:00 AM – 8:00 PM";
export const STORE_TIME_ZONE = "Asia/Kolkata";

export const getStoreCurrentMinutes = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: STORE_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const timeParts = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return Number(timeParts.hour) * 60 + Number(timeParts.minute);
};

export const getKitchenHoursClosedNotice = (operatingHoursText) =>
  `We are currently closed for orders. Kitchen hours: ${operatingHoursText || DEFAULT_OPERATING_HOURS}. Orders will resume during operating hours!`;

export const getClosedStoreNotice = (settings = {}) =>
  settings.effectiveClosedReason?.trim()
  || settings.closedNoticeMessage?.trim()
  || getKitchenHoursClosedNotice(settings.operatingHoursText);
