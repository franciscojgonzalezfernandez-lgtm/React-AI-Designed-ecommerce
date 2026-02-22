import { teslaApi } from "@/api/TesloApi";

/**
 * Delete a product by id.
 *
 * API: DELETE /products/:id
 * Input: id (string)
 * Output: boolean indicating success. Errors are caught and logged and
 * false is returned on failure.
 */
export const deleteProductAction = async (id: string): Promise<boolean> => {
  try {
    await teslaApi.delete(`/products/${id}`, {
      data: { id },
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
