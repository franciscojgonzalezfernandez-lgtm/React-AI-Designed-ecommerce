import { teslaApi } from "@/api/TesloApi";
import type { Login } from "../interfaces/login.response";

/**
 * Validate current session token with the backend.
 *
 * API: GET /auth/check-status
 * Output: Login object (contains a fresh token). On success the token
 * is stored in localStorage.sessionToken. On failure the token is removed
 * and an error is thrown.
 */
export const checkStatus = async (): Promise<Login> => {
  try {
    const { data } = await teslaApi.get<Login>("/auth/check-status");
    localStorage.setItem("sessionToken", data.token);
    return data;
  } catch {
    localStorage.removeItem("sessionToken");
    throw new Error("No valid token");
  }
};
