import { API_BASE_URL } from "./Constants";

const TOKEN_KEY = "fn_token";
const USER_KEY = "loggedUser";
const ADMIN_FLAG_KEY = "adminAuth";

export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuthSession = (token, user) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    sessionStorage.removeItem(ADMIN_FLAG_KEY);
    localStorage.removeItem(ADMIN_FLAG_KEY);
  } catch {}
};

export const clearAuthSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(ADMIN_FLAG_KEY);
    localStorage.removeItem(ADMIN_FLAG_KEY);
  } catch {}
};

export const authFetch = (url, options = {}) => {
  const token = getAuthToken();
  const headers = { ...(options.headers || {}) };
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
};

export const fetchCurrentSessionUser = async () => {
  const res = await authFetch(`${API_BASE_URL}/users/me`);
  if (!res.ok) return null;
  const data = await res.json().catch(() => ({}));
  return data?.user || null;
};

export const logoutFromServer = async () => {
  try {
    await authFetch(`${API_BASE_URL}/users/logout`, { method: "POST" });
  } catch {}
  clearAuthSession();
};
