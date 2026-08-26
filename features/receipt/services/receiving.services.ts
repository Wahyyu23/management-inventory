import { apiClient } from "@/lib/api/client";
import {
  LocationListResponse,
  MasterProductCreateResponse,
  MasterProductInput,
  MasterProductListResponse,
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

export async function getMasterProducts(
  page = 1,
  limit = 20,
  name?: string,
  category?: string,
) {
  return apiClient<MasterProductListResponse>("/master-products", {
    method: "GET",
    params: {
      name,
      category,
      page,
      limit,
    },
  });
}

export async function createMasterProduct(input: MasterProductInput) {
  return apiClient<MasterProductCreateResponse>("/master-products", {
    method: "POST",
    body: input,
  });
}
