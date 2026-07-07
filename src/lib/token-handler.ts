import { isTokenExpired } from "./token-validity";
import { Session } from "@/types/auth";
import { setCookie, removeCookie, getCookie } from "./cookies";
import { makeRequestWithoutAuth } from "./api";
import { API_URL } from "./urls";
import { refreshMutex } from "./refresh-mutex";
import { InternalAxiosRequestConfig } from "axios";

const getCurrentSession = (): Session | null => {
  try {
    const sessionCookie = getCookie("session");
    if (!sessionCookie) return null;
    if (typeof sessionCookie === "string") {
      return JSON.parse(sessionCookie) as Session;
    }
    return sessionCookie as Session;
  } catch {
    return null;
  }
};

const performRefresh = async (
  refreshToken: string
): Promise<Session | null> => {
  try {
    // DummyJSON expects camelCase key for refreshToken
    const response = await makeRequestWithoutAuth<{ accessToken: string; refreshToken: string }>(
      "POST",
      API_URL.REFRESH,
      { refreshToken: refreshToken }
    );

    const newSession: Session = {
      access_token: response.accessToken,
      refresh_token: response.refreshToken,
    };

    setCookie("session", JSON.stringify(newSession), 365, true, "Strict");
    return newSession;
  } catch {
    return null;
  }
};

export const handleUnauthorized = async (
  originalRequest?: InternalAxiosRequestConfig | null,
  sessionCookie?: Session
): Promise<boolean> => {
  const session = sessionCookie || getCurrentSession();

  if (!session?.refresh_token || isTokenExpired(session.refresh_token)) {
    return false;
  }

  try {
    const newSession = (await refreshMutex.acquire(async () => {
      return performRefresh(session.refresh_token);
    })) as Session | null;

    if (!newSession?.access_token) {
      return false;
    }

    if (originalRequest) {
      originalRequest.headers.Authorization = `Bearer ${newSession.access_token}`;
    }

    return true;
  } catch {
    return false;
  }
};

export const getValidAccessToken = async (
  sessionCookie?: Session
): Promise<string | null> => {
  const session = sessionCookie || getCurrentSession();

  if (!session?.access_token) {
    return null;
  }

  // If token not expired, return it
  if (!isTokenExpired(session.access_token)) {
    return session.access_token;
  }

  // Token expired, try refresh
  if (!session.refresh_token || isTokenExpired(session.refresh_token)) {
    return null;
  }

  try {
    const newSession = (await refreshMutex.acquire(async () => {
      return performRefresh(session.refresh_token);
    })) as Session | null;

    return newSession?.access_token || null;
  } catch {
    return null;
  }
};

export const clearTokens = (): void => {
  refreshMutex.reset();
  removeCookie("session");
  removeCookie("user_data");
};
