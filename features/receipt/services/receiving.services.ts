import { apiClient } from "@/lib/api/client";
import {
  LocationListResponse,
  WarehouseListResponse,
} from "../types/receiving.types";

export async function getWarehouses(page = 1, limit = 20) {
  return apiClient<WarehouseListResponse>("/warehouses", {
    method: "GET",
    params: {
      page,
      limit,
    },
  });
}

export async function getLocations(warehouseId: string) {
  return apiClient<LocationListResponse>(
    `/warehouses/${warehouseId}/locations`,
    {
      method: "GET",
    },
  );
}
