import { makeRequestWithoutAuth } from "@/lib/api";
import { API_URL } from "@/lib/urls";
import { AuthResponse, Session, User } from "@/types/auth";
import { setCookie } from "@/lib/cookies";

export const AuthService = {
  login: async (
    username: string,
    password: string,
    rememberMe = false
  ): Promise<{ user: User; session: Session }> => {
    const response = await makeRequestWithoutAuth<AuthResponse>(
      "POST",
      API_URL.LOGIN,
      {
        username,
        password,
        expiresInMins: rememberMe ? 10080 : 120, // 7 days (10080 mins) if remember me, else 2 hours
      }
    );

    const user: User = {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      gender: response.gender,
      image: response.image,
    };

    const session: Session = {
      access_token: response.accessToken,
      refresh_token: response.refreshToken,
    };

    const days = rememberMe ? 7 : 1;
    setCookie("session", JSON.stringify(session), days, true, "Strict");
    setCookie("user_data", JSON.stringify(user), days, false, "Lax");

    return { user, session };
  },

  getCurrentUser: async (session: Session): Promise<User> => {
    // In DummyJSON, GET /auth/me returns the user profile associated with the Bearer token
    return makeRequestWithoutAuth<User>(
      "GET",
      API_URL.ME,
      undefined,
      session
    );
  },
};
