/**
 * Axios interceptor for automatic token refresh and retry on 401
 * Handles the full retry loop without blocking concurrent requests
 */

import {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { handleUnauthorized, getValidAccessToken } from "./token-handler";
import { Session } from "@/types/auth";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _sessionCookie?: Session;
}

/**
 * Setup response interceptor for automatic 401 handling
 */
export const setupAxiosInterceptors = (axiosInstance: AxiosInstance): void => {
  // Response interceptor for 401 handling
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const config = error.config as CustomAxiosRequestConfig;

      // Not a 401 error - don't retry
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      // Already retried - don't retry again
      if (config?._retry) {
        return Promise.reject(error);
      }

      // Mark as retried to prevent infinite loops
      if (config) {
        config._retry = true;
      }

      try {
        // Attempt refresh
        const success = await handleUnauthorized(
          config,
          config?._sessionCookie
        );

        if (!success) {
          console.warn("[Interceptor] Refresh failed, returning 401");
          return Promise.reject(error);
        }

        // Retry original request with new token
        return axiosInstance(config);
      } catch (refreshError) {
        console.error("[Interceptor] Error during refresh:", refreshError);
        return Promise.reject(error);
      }
    }
  );
};

/**
 * Setup request interceptor for adding authorization header
 */
export const setupAxiosAuthInterceptor = (
  axiosInstance: AxiosInstance
): void => {
  axiosInstance.interceptors.request.use(
    async (config: CustomAxiosRequestConfig) => {
      try {
        const token = await getValidAccessToken(config._sessionCookie);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("[Interceptor] No valid access token available");
        }
      } catch (error) {
        console.error("[Interceptor] Error setting auth header:", error);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};

/**
 * Setup all interceptors for an axios instance
 */
export const setupAllInterceptors = (axiosInstance: AxiosInstance): void => {
  setupAxiosAuthInterceptor(axiosInstance);
  setupAxiosInterceptors(axiosInstance);
};
