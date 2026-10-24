import logo from "url:../assets/logo.png";
export const LOGO = logo;

const defaultUrl =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5005/api"
    : "https://food-ninja-l6b1.onrender.com/api";

const rawApiUrl = process.env.REACT_APP_API_URL || process.env.API_URL || defaultUrl;
export const API_BASE_URL = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl.replace(/\/$/, "")}/api`;

export const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT || "";
