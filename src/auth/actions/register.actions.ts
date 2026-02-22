import { teslaApi } from "@/api/TesloApi";
import type { Login } from "../interfaces/login.response";

interface Options {
  email: string;
  password: string;
  fullName: string;
}

/**
 * Register a new user.
 *
 * API: POST ${VITE_API_URL}/auth/register
 * Input: { email, password, fullName }
 * Output: Login object (user + token). Errors re-thrown.
 */
export const registerAction = async ({
  email,
  password,
  fullName,
}: Options): Promise<Login> => {
  try {
    const { data } = await teslaApi.post<Login>(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      {
        email,
        password,
        fullName,
      },
    );
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
