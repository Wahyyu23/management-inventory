import useSWR from "swr";

import { mapMasterProductsToOptions } from "../mappers/receiving.mapper";
import { getMasterProducts } from "../services/receiving.services";

import type {
  MasterProduct,
  MasterProductListResponse,
} from "../types/receiving.types";

export function useMasterProducts(
  page = 1,
  limit = 20
) {
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    ["master-products", page, limit],
    () => getMasterProducts(page, limit)
  );

  const masterProduct = data?.data ?? [];

  const masterProductsOptions =
    mapMasterProductsToOptions(
      masterProduct
    );

  async function addMasterProductToCache(
    product: MasterProduct
  ) {
    await mutate(
      (
        current:
          | MasterProductListResponse
          | undefined
      ) => {
        if (!current) {
          return {
            success: true,
            data: [product],
            meta: null,
          };
        }

        const alreadyExists =
          current.data.some(
            (item) => item.id === product.id
          );

        if (alreadyExists) {
          return current;
        }

        const totalItems =
          (current.meta?.total_items ?? 0) + 1;

        return {
          ...current,

          data: [
            ...current.data,
            product,
          ],

          meta: current.meta
            ? {
                ...current.meta,
                total_items: totalItems,
                total_pages: Math.ceil(
                  totalItems /
                    current.meta.limit
                ),
              }
            : null,
        };
      },
      {
        revalidate: false,
      }
    );
  }

  return {
    masterProduct,
    masterProductsOptions,
    meta: data?.meta ?? null,

    isLoading,
    isValidating,
    isError: Boolean(error),
    error,

    mutate,
    addMasterProductToCache,
  };
}