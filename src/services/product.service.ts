import { makeRequestWithoutAuth } from "@/lib/api";
import { Product, ProductsResponse, Category } from "@/types/product";

export const ProductService = {
  getProducts: async ({
    limit = 20,
    skip = 0,
    category,
    search,
    sortBy,
    order,
  }: {
    limit?: number;
    skip?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  } = {}): Promise<ProductsResponse> => {
    let url = "/products";
    const params: Record<string, string | number> = { limit, skip };

    if (search) {
      url = "/products/search";
      params.q = search;
    } else if (category && category !== "all") {
      url = `/products/category/${category}`;
    }

    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order || "asc";
    }

    // Convert query parameters into a query string
    const queryString = Object.entries(params)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join("&");

    const endpoint = `${url}?${queryString}`;
    return makeRequestWithoutAuth<ProductsResponse>("GET", endpoint);
  },

  getProductDetails: async (id: number): Promise<Product> => {
    return makeRequestWithoutAuth<Product>("GET", `/products/${id}`);
  },

  getCategories: async (): Promise<Category[]> => {
    return makeRequestWithoutAuth<Category[]>("GET", "/products/categories");
  },
};
