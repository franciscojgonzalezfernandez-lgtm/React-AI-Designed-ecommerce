import axios from "axios";

/**
 * Centralized axios instance for API calls.
 *
 * - baseURL is read from VITE_API_URL.
 * - A request interceptor attaches a bearer token from
 *   localStorage.sessionToken when present.
 *
 * Use this client for all backend requests to keep auth and base URL
 * handling in a single place.
 */
const teslaApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach authorization header when a session token exists
teslaApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("sessionToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { teslaApi };
