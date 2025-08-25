import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "https://task-master-omega-gilt.vercel.app/api", // backend base URL
  // baseURL: "http://localhost:3000/api", // backend base URL
  
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // JWT stored in localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
