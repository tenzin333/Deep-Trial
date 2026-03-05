import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
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

export default api;