import { apiClient } from "@/lib/api/client";

import {
  LocationApiResponse, 
  LocationListResponse,
  MasterProductCreateResponse,
  MasterProductInput,
  MasterProductListResponse,
  ReceivingInput,
  ReceivingTransactionResponse,
  WarehouseApiResponse,
  WarehouseListResponse,
} from "../types/receiving.types";

export async function getWarehouses(): Promise<WarehouseListResponse> {
  const response =
    await apiClient<WarehouseApiResponse>(
      "/warehouses",
      {
        method: "GET",
      },
    );

  const warehouses = response.map(
    (warehouse) => ({
      id: warehouse.id.value,

      name: warehouse.name,

      addressSite:
        warehouse.addressSite,

      isActive:
        warehouse.isActive,
    }),
  );

  return {
    success: true,
    data: warehouses,
    meta: null,
  };
};

export async function getLocations(): Promise<LocationListResponse> {
  const response =
    await apiClient<LocationApiResponse>(
      "/locations",
      {
        method: "GET",
      },
    );


  const locations = response.map(
    (location) => ({
      id: location.id.value,

      warehouse_id:
        location.warehouseId.value,

      zone: location.zone,

      isActive:
        location.isActive,
    }),
  );

  return {
    success: true,
    data: locations,
  };
}

export async function getMasterProducts(
  page? : 1,
  limit? : 20,
  name?: string,
  category?: string, 
) {
  return apiClient<MasterProductListResponse>(
    "/master-products",
    {
      method: "GET",

      params: {
        name,
        category,
        page,
        limit,
      },
    },
  );
}

export async function createMasterProduct(
  input: MasterProductInput,
) {
  return apiClient<MasterProductCreateResponse>(
    "/master-products",
    {
      method: "POST",
      body: input,
    },
  );
}

export async function createReceiving(
  input: ReceivingInput,
) {
  return apiClient<ReceivingTransactionResponse>(
    "/transactions/receiving",
    {
      method: "POST",
      body: input,
    },
  );
}