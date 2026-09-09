import useSWR from "swr";
import { getWarehouses } from "../services/receiving.services";
import { mapWarehousesToOptions } from "../mappers/receiving.mapper";

export function useWarehouses() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["warehouses"],
    () => getWarehouses(),
  );

  const warehouses = data?.data ?? [];

  const warehousesOptions = mapWarehousesToOptions(warehouses);

  return {
    warehouses,
    warehousesOptions,
    meta: data?.meta ?? null,
    isLoading,
    isValidating,
    isError: Boolean(error),
    error,
    mutate,
  };
}
