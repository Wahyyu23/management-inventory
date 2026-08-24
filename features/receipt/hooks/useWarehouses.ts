import useSWR from "swr";
import { getWarehouses } from "../services/receiving.services";
import { mapWarehousesToOptions } from "../mappers/receiving.mapper";

export function useWarehouses(page = 1, limit = 20) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["warehouses", page, limit],
    () => getWarehouses(page, limit),
  );

  const warehousesOptions = mapWarehousesToOptions(
    data?.data ?? []
  );

  return {
    warehousesOptions,
    meta: data?.meta ?? null,

    isLoading,
    isValidating,
    isError: Boolean(error),
    error,
    mutate,
  };
}
