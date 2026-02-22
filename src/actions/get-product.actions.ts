import { teslaApi } from "@/api/TesloApi";
import type { Product } from "@/interfaces/Product";
import { ROUTE_TO_IMAGES } from "./get-products.actions";

/**
 * Fetch a single product by id or slug.
 *
 * API: GET /products/:idSlug
 * Input: { idSlug }
 * Output: Product object (partial allowed for 'new').
 *
 * Behavior: if idSlug === 'new' returns a DUMMY_PRODUCT for UI creation
 * flows. Also normalizes image URLs: if an image path isn't absolute it
 * prefixes it with the API base URL + images route.
 */

const DUMMY_PRODUCT: Partial<Product> = {
  id: "new",
  title: "",
  price: 0,
  description: "",
  slug: "",
  stock: 0,
  sizes: [],
  gender: "men",
  tags: [],
  images: [],
};

interface Props {
  idSlug: string;
}

export const getProductAction = async ({
  idSlug,
}: Props): Promise<Partial<Product>> => {
  if (idSlug === "new") return DUMMY_PRODUCT;
  const { data } = await teslaApi.get<Product>(`/products/${idSlug}`);

  // image mapping
  const newImages = data.images.map((image) => {
    if (image.includes("http")) return image;
    return `${import.meta.env.VITE_API_URL}${ROUTE_TO_IMAGES}${image}`;
  });

  return { ...data, images: newImages };
};
