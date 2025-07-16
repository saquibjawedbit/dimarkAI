import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000", // Change as needed
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
