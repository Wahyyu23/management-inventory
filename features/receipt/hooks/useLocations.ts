import useSWR from "swr";

import { getLocations } from "../services/receiving.services";
import { mapLocationsToOptions } from "../mappers/receiving.mapper";

export function useLocations(
  warehouseId?: string
) {
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    warehouseId
      ? ["locations", warehouseId]
      : null,

    () => getLocations(warehouseId!)
  );

  const locationsOptions = mapLocationsToOptions(
    data?.data ?? []
  )

  return {
    locationsOptions,

    isLoading,
    isValidating,
    isError: Boolean(error),
    error,

    mutate,
  };
}