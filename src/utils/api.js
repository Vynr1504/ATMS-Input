import axios from "axios";

// Load base URL from your environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create a custom axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to log or format responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error?.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
