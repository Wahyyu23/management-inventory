import { apiClient } from "@/lib/api/client";

import type {
  LocationApiResponse,
  LocationListResponse,

  MasterProduct,
  MasterProductApiCategory,
  MasterProductApiInput,
  MasterProductApiItem,
  MasterProductApiMeasurement,
  MasterProductApiResponse,
  MasterProductCategory,
  MasterProductCreateResponse,
  MasterProductInput,
  MasterProductListResponse,
  MasterProductMeasurement,

  ReceivingInput,
  ReceivingTransactionResponse,

  WarehouseApiResponse,
  WarehouseListResponse,
} from "../types/receiving.types";

export async function getWarehouses():
  Promise<WarehouseListResponse> {
  const response =
    await apiClient<WarehouseApiResponse>(
      "/warehouses",
      {
        method: "GET",
      },
    );

  const warehouses =
    response.data.map(
      (warehouse) => ({
        id:
          warehouse.id.value,

        name:
          warehouse.name,

        addressSite:
          warehouse.addressSite,

        isActive:
          warehouse.isActive,
      }),
    );

  return {
    success: true,

    data:
      warehouses,
    meta:
      response.meta,
  };
}

export async function getLocations():
  Promise<LocationListResponse> {
  const response =
    await apiClient<LocationApiResponse>(
      "/locations",
      {
        method: "GET",
      },
    );

  const locations =
    response.data.map(
      (location) => ({
        id:
          location.id.value,

        warehouse_id:
          location
            .warehouseId
            .value,

        zone:
          location.zone,

        isActive:
          location.isActive,
      }),
    );

  return {
    success: true,
    data:
      locations,
    meta:
      response.meta,
  };
}


const MASTER_PRODUCT_CATEGORY_TO_API: Partial<
  Record<
    MasterProductCategory,
    MasterProductApiCategory
  >
> = {
  "Electrical Component":
    "ELECTRICAL_COMPONENT",

  "Mechanical Component":
    "MECHANICAL_COMPONENT",

  "IT Component":
    "IT_COMPONENT",

  "Administration Component":
    "ADMINISTRATION_COMPONENT",

  Other:
    "OTHER",
};


const MASTER_PRODUCT_CATEGORY_FROM_API: Record<
  MasterProductApiCategory,
  MasterProductCategory
> = {
  ELECTRICAL_COMPONENT:
    "Electrical Component",

  MECHANICAL_COMPONENT:
    "Mechanical Component",

  IT_COMPONENT:
    "IT Component",

  ADMINISTRATION_COMPONENT:
    "Administration Component",

  OTHER:
    "Other",
};


const MASTER_PRODUCT_MEASUREMENT_FROM_API: Record<
  MasterProductApiMeasurement,
  MasterProductMeasurement
> = {
  UNIT: "unit",
  SET: "set",
  BOX: "box",
  PACK: "pack",
  KG: "kg",
  METER: "meter",
  LITER: "liter",
};

function mapMasterProductFromApi(
  product: MasterProductApiItem,
): MasterProduct {
  const category =
    MASTER_PRODUCT_CATEGORY_FROM_API[
      product.category
    ];

  const measurement =
    MASTER_PRODUCT_MEASUREMENT_FROM_API[
      product.measurement
    ];

  if (!category) {
    throw new Error(
      `Unsupported master product category from API: ${product.category}`,
    );
  }

  if (!measurement) {
    throw new Error(
      `Unsupported master product measurement from API: ${product.measurement}`,
    );
  }

  return {
    id:
      product.id.value,

    name:
      product.name,

    category,

    measurement,

    brand:
      product.brand,

    description:
      product.description ??
      undefined,
  };
}

function mapMasterProductInputToApi(
  input: MasterProductInput,
): MasterProductApiInput {
  const apiCategory =
    MASTER_PRODUCT_CATEGORY_TO_API[
      input.category
    ];

  if (!apiCategory) {
    throw new Error(
      `Category "${input.category}" is not supported by the current backend.`,
    );
  }

  return {
    name:
      input.name,

    category:
      apiCategory,

    measurement:
      input.measurement.toUpperCase() as
        MasterProductApiMeasurement,

    brand:
      input.brand,

    description:
      input.description,
  };
}

export async function getMasterProducts():
  Promise<MasterProductListResponse> {
  const response =
    await apiClient<MasterProductApiResponse>(
      "/master-products",
      {
        method: "GET",
      },
    );

  const masterProducts =
    response.data.map(
      mapMasterProductFromApi,
    );

  return {
    success: true,
    data:
      masterProducts,
    meta:
      response.meta,
  };
}

export async function createMasterProduct(
  input: MasterProductInput,
): Promise<MasterProductCreateResponse> {
  const apiInput =
    mapMasterProductInputToApi(
      input,
    );

  await apiClient<null>(
    "/master-products",
    {
      method: "POST",

      body:
        apiInput,
    },
  );

  const refreshed =
    await getMasterProducts();

  const createdProduct =
    refreshed.data.find(
      (product) =>
        product.name ===
          input.name &&
        product.category ===
          input.category &&
        product.measurement ===
          input.measurement &&
        product.brand ===
          input.brand &&
        (product.description ??
          "") ===
          (input.description ??
            ""),
    );

  if (!createdProduct) {
    throw new Error(
      "Master product was created, but it could not be found after refreshing the product list.",
    );
  }

  return {
    success: true,

    data:
      createdProduct,
  };
}

export async function createReceiving(
  input: ReceivingInput,
) {
  return apiClient<ReceivingTransactionResponse>(
    "/transactions/receiving",
    {
      method: "POST",

      body:
        input,

      // TEMPORARY:
      // Aktifkan kembali jika Receiving real
      // masih belum tersedia dan memang masih
      // ingin fallback ke Microcks.
      //
      // fallbackToMock: true,
    },
  );
}