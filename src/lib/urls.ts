const isDev = false;

export const BASE_URL = isDev
  ? "http://localhost:3001/api/v1"
  : "https://dummyjson.com";

export const API_URL = {
  LOGIN: "/auth/login",
  REFRESH: "/auth/refresh",
  ME: "/auth/me",
  PRODUCTS: "/products",
  CATEGORIES: "/products/categories",
  SEARCH: "/products/search",
};
