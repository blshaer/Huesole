export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5001" : "https://lumegradients.onrender.com");
export const API_URL = `${BASE_URL}/api`;
