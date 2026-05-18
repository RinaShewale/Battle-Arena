import axios from "axios";

const api = axios.create({
  baseURL: "https://battle-arena-589s.onrender.com/api",
  withCredentials: true, // 🔥 REQUIRED for cookies
});

export default api;