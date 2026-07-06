import axios from "axios";

// Fallback to the production backend so a missing VITE_API_BASE can never
// resolve auth requests against the extension's own origin (chrome-extension://...).
const API_BASE = import.meta.env.VITE_API_BASE || "https://deep-trial.onrender.com/api";
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT;
const api = axios.create({
  baseURL: ENVIRONMENT=="development" ? "http://localhost:8000/api" : API_BASE,
  headers: { "Content-Type": "application/json" }
});

// Inject JWT token into every request
api.interceptors.request.use(async (config) => {
  const { token } = await chrome.storage.local.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const setupInterceptors = (logout) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
     if (error.response?.status === 401 && !error.config._retry) {
        logout(); // clears user
      }

      return Promise.reject(error);
    }
  );
};

export default api;