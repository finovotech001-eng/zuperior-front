// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://18.130.5.209:5003",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export default api;
