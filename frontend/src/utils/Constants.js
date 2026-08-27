let logoUrl = "/logo.png";
try {
  logoUrl = new URL("../../logo.png", import.meta.url).href;
} catch (e) {
  logoUrl = "/logo.png";
}

export const LOGO = logoUrl;

export const MY_API = process.env.GEMINI_API_KEY || "";

export const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT || "";