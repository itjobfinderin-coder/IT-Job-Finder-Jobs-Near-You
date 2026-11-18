import axios from "axios";
import { clearSession, getToken } from "./tokenStorage";

export const API_URL = import.meta.env.VITE_API_URL;

// Dispatched when a previously valid token is rejected by the server.
export const AUTH_EXPIRED_EVENT = "auth:expired";

if (!API_URL) {
  console.warn("VITE_API_URL is not set. API requests will fail.");
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && getToken() && !isLoginRequest) {
      clearSession();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  }
);
