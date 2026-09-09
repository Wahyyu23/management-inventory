import useSWR from "swr";

import { getLocations } from "../services/receiving.services";
import { mapLocationsToOptions } from "../mappers/receiving.mapper";

export function useLocations(warehouseId?: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    warehouseId ? ["locations", warehouseId] : null,

    getLocations,
  );

  const locations = data?.data ?? [];

  const filteredLocations = warehouseId
    ? locations.filter((location) => location.warehouse_id === warehouseId)
    : [];

  const locationsOptions = mapLocationsToOptions(filteredLocations);

  return {
    locations: filteredLocations,
    locationsOptions,
    isLoading,
    isValidating,
    isError: Boolean(error),
    error,

    mutate,
  };
}
