let logoUrl = "/logo.png";
try {
  logoUrl = new URL("../../logo.png", import.meta.url).href;
} catch (e) {
  logoUrl = "/logo.png";
}

export const LOGO = logoUrl;

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5005/api";

export const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT || "";