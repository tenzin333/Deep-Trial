import axios from "axios";
import config from "../../config";

const api = axios.create({
  baseURL: config.API_BASE,
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