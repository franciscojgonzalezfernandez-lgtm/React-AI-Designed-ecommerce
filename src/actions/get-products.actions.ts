import { teslaApi } from "@/api/TesloApi";
import type { ProductsResponse } from "@/interfaces/Products.response";

/**
 * Fetch a paginated list of products.
 *
 * API: GET /products
 * Query params: offset, limit, gender, sizes, minPrice, maxPrice, q
 * Output: ProductsResponse { total, products: Product[] }
 *
 * Behavior: image paths returned by the API are normalized to full URLs
 * by prefixing with VITE_API_URL + ROUTE_TO_IMAGES when they are not
 * already absolute URLs.
 */
export const ROUTE_TO_IMAGES = "/files/product/";

export interface Options {
  offset: number;
  limit: number;
  gender?: string;
  sizes?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
}

export const getProductsAction = async ({
  offset,
  limit = 9,
  gender,
  sizes,
  minPrice,
  maxPrice,
  q,
}: Options): Promise<ProductsResponse> => {
  const { data } = await teslaApi.get<ProductsResponse>("/products", {
    params: {
      limit,
      offset: isNaN(offset) ? 0 : offset,
      gender,
      sizes,
      minPrice,
      maxPrice,
      q,
    },
  });

  /* Normalize data */
  const newProductsWithImageUrl = data.products.map((product) => ({
    ...product,
    images: product.images.map((image) => {
      if (image.includes("http")) return image;
      return `${import.meta.env.VITE_API_URL}${ROUTE_TO_IMAGES}${image}`;
    }),
  }));

  return { ...data, products: newProductsWithImageUrl };
};
