import { createUpdateProductAction } from "@/actions/create-update-product.actions";
import { deleteProductAction } from "@/actions/delete-product.actions";
import { getProductAction } from "@/actions/get-product.actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

/**
 * Hook to load and mutate a single product resource.
 *
 * Responsibilities:
 * - Fetch product data using `getProductAction` and cache it under
 *   query keys ["product", { idSlug }].
 * - Provide mutations for create/update and delete using the
 *   corresponding action functions. On success the hook updates or
 *   invalidates related queries to keep the cache consistent.
 *
 * Notes on API actions:
 * - `getProductAction({ idSlug })` should return the product object
 *   or throw on error. The hook sets retry: false and a 5 minute
 *   staleTime to reduce repeated requests.
 * - `createUpdateProductAction` and `deleteProductAction` are used
 *   with react-query mutations and must accept/return the expected
 *   payload shapes consumed by onSuccess handlers below.
 */

export const useProduct = () => {
  const queryClient = useQueryClient();
  const idSlug = useParams().idSlug || "id";
  const query = useQuery({
    queryKey: ["product", { idSlug }],
    queryFn: () => getProductAction({ idSlug }),
    staleTime: 5 * 1000 * 60, // 5 minutes
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: createUpdateProductAction,
    onSuccess: (productReceived) => {
      //cache invalidation
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // QueryData update.
      queryClient.setQueryData(
        ["product", { idSlug: productReceived.slug }],
        productReceived,
      );
      queryClient.setQueryData(
        ["product", { id: productReceived.id }],
        productReceived,
      );
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProductAction,
    onSuccess: (data) => {
      if (data) {
        //cache invalidation
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
    },
  });

  return { ...query, mutation, deleteProductMutation };
};
