// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export default api;
