import { teslaApi } from "@/api/TesloApi";
import type { Login } from "../interfaces/login.response";

interface Options {
  email: string;
  password: string;
}

/**
 * Perform authentication against the backend.
 *
 * API: POST ${VITE_API_URL}/auth/login
 * Input: { email, password }
 * Output: Login object (typically contains user info and token).
 * Errors are re-thrown to the caller.
 */
export const loginAction = async ({
  email,
  password,
}: Options): Promise<Login> => {
  try {
    const { data } = await teslaApi.post<Login>(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      {
        email,
        password,
      },
    );
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
