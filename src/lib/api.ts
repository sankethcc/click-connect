import axios, { AxiosRequestConfig, Method } from "axios";
import { getValidAccessToken } from "./token-handler";
import { BASE_URL } from "./urls";
import { Session } from "@/types/auth";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

async function makeRequest<T = unknown>(
  method: Method,
  url: string,
  sessionCookie: Session,
  data?: unknown
): Promise<T> {
  const headers: Record<string, string> = {};

  const accessToken = await getValidAccessToken(sessionCookie);
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (method.toLowerCase() === "post" || method.toLowerCase() === "put" || method.toLowerCase() === "patch") {
    if (typeof FormData !== "undefined" && data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    } else {
      headers["Content-Type"] = "application/json";
    }
  }

  const options: AxiosRequestConfig = {
    method,
    url,
    headers,
  };

  if (data) {
    options.data = data;
  }

  try {
    const response = await axiosInstance<T>(options);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function makeRequestWithoutAuth<T = unknown>(
  method: Method,
  url: string,
  data?: unknown,
  sessionCookie?: Session
): Promise<T> {
  const headers: Record<string, string> = {};

  if (sessionCookie) {
    const accessToken = await getValidAccessToken(sessionCookie);
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  if (method.toLowerCase() === "post" || method.toLowerCase() === "put" || method.toLowerCase() === "patch") {
    if (typeof FormData !== "undefined" && data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    } else {
      headers["Content-Type"] = "application/json";
    }
  }

  const options: AxiosRequestConfig = {
    method,
    url,
    headers,
  };

  if (data) {
    options.data = data;
  }

  try {
    const response = await axiosInstance<T>(options);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default makeRequest;
