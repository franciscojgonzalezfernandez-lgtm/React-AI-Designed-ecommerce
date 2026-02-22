import { teslaApi } from "@/api/TesloApi";
import type { Product } from "@/interfaces/Product";

/**
 * Create or update a product.
 *
 * API:
 * - POST /products       (create when id === 'new')
 * - PATCH /products/:id  (update when id !== 'new')
 *
 * Input: Partial<Product> & { files?: File[] }
 * - files: optional images to upload. They are uploaded first and
 *   their returned file names are appended to the images array.
 * Output: Product (with images normalized to full URLs)
 */
export const createUpdateProductAction = async (
  productLike: Partial<Product> & { files?: File[] },
): Promise<Product> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, user, images = [], files = [], ...restProps } = productLike;

  console.log({ files });

  const isCreating = id === "new";

  restProps.price = Number(restProps.price || 0);
  restProps.stock = Number(restProps.stock || 0);

  // If new files were provided, upload them and append the returned
  // filenames to the images array before sending create/update to API.
  if (files.length) {
    const imageNames = await uploadFiles(files);
    images.push(...imageNames);
  }

  const { data } = await teslaApi<Product>({
    method: isCreating ? "POST" : "PATCH",
    url: isCreating ? "/products" : `/products/${id}`,
    data: { ...restProps, images },
  });

  return {
    ...data,
    images: images.map((image) => {
      if (image.includes("http")) return image;
      return `${import.meta.env.VITE_API_URL}/files/product/${image}`;
    }),
  };
};

export interface FileUploadResponse {
  secureUrl: string;
  fileName: string;
}

const uploadFiles = async (files: File[]) => {
  const filePromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await teslaApi<FileUploadResponse>({
      url: `/files/product`,
      method: "POST",
      data: formData,
    });
    return data.fileName;
  });
  const uploadedFileNames = await Promise.all(filePromises);

  return uploadedFileNames;
};
