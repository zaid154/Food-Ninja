import { API_BASE_URL } from "./Constants";

const CLIENT_SETTINGS_TTL_MS = 15_000;
let cachedSettings = null;
let cacheExpiresAt = 0;
let inFlightPromise = null;

export const clearSettingsClientCache = () => {
  cachedSettings = null;
  cacheExpiresAt = 0;
  inFlightPromise = null;
};

if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
  window.addEventListener("store_settings_updated", clearSettingsClientCache);
}

/**
 * Coalesces simultaneous client mount/polling calls to GET /api/settings so
 * Header, Footer, and route pages share one network request per window.
 */
export const fetchStoreSettings = async ({ force = false } = {}) => {
  if (typeof fetch === "undefined") return null;

  const now = Date.now();
  if (!force && cachedSettings && now < cacheExpiresAt) {
    return cachedSettings;
  }
  if (!force && inFlightPromise) {
    return inFlightPromise;
  }

  const request = Promise.resolve()
    .then(() => fetch(`${API_BASE_URL}/settings`))
    .then((res) => (res && res.ok !== false && typeof res.json === "function" ? res.json() : null))
    .then((data) => {
      if (data && data.settings) {
        cachedSettings = data.settings;
        cacheExpiresAt = Date.now() + CLIENT_SETTINGS_TTL_MS;
        return data.settings;
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      if (inFlightPromise === request) {
        inFlightPromise = null;
      }
    });

  inFlightPromise = request;
  return request;
};
