import {
  MASTER_PRODUCT_CATEGORIES,
  MASTER_PRODUCT_MEASUREMENT,
} from "../constants/master-product.constants";

export type WarehousesStatus = "active" | "inactive";

export type ApiIdentifier = {
  value: string;
};

export type PaginationMeta = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type ApiListResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type LocationApiItem = {
  id: ApiIdentifier;
  isActive: boolean;
  warehouseId: ApiIdentifier;
  zone: string;
};

export type LocationApiResponse = ApiListResponse<LocationApiItem>;

export type WarehouseApiItem = {
  name: string;
  addressSite: string;
  id: ApiIdentifier;
  isActive: boolean;
  locations: LocationApiItem[];
};

export type WarehouseApiResponse = ApiListResponse<WarehouseApiItem>;

export type Location = {
  id: string;
  warehouse_id: string;
  zone: string;
  isActive: boolean;
};

export type Warehouse = {
  id: string;
  name: string;
  addressSite: string;
  isActive: boolean;
};

export type WarehouseListResponse = {
  success: boolean;
  data: Warehouse[];
  meta: PaginationMeta;
};

export type LocationListResponse = {
  success: boolean;
  data: Location[];
  meta: PaginationMeta;
};

export type SelectOption = {
  label: string;
  value: string;
};

export type MasterProductCategory = (typeof MASTER_PRODUCT_CATEGORIES)[number];

export type MasterProductMeasurement =
  (typeof MASTER_PRODUCT_MEASUREMENT)[number];

export type MasterProductInput = {
  name: string;
  category: MasterProductCategory;
  measurement: MasterProductMeasurement;
  brand: string;
  description?: string;
};

export type MasterProduct = {
  id: string;
  name: string;
  category: MasterProductCategory;
  measurement: MasterProductMeasurement;
  brand: string;
  description?: string;
};

export type MasterProductApiCategory =
  | "OTHER"
  | "IT_COMPONENT"
  | "ADMINISTRATION_COMPONENT"
  | "MECHANICAL_COMPONENT"
  | "ELECTRICAL_COMPONENT";

export type MasterProductApiMeasurement = Uppercase<MasterProductMeasurement>;

export type MasterProductApiItem = {
  name: string;
  category: MasterProductApiCategory;
  measurement: MasterProductApiMeasurement;
  brand: string;
  description?: string | null;

  id: ApiIdentifier;

  isActive: boolean;

  taggedUnits: unknown[];
};

export type MasterProductApiResponse = ApiListResponse<MasterProductApiItem>;

export type MasterProductApiInput = {
  name: string;
  category: MasterProductApiCategory;
  measurement: MasterProductApiMeasurement;
  brand: string;
  description?: string;
};

export type MasterProductListResponse = {
  success: boolean;
  data: MasterProduct[];
  meta: PaginationMeta;
};

export type MasterProductCreateResponse = {
  success: boolean;
  data: MasterProduct;
};

export type ReceivingInput = {
  warehouse_id: string;
  location_id: string;
  user_id: string;
  purchase_reference_number: string;
  proof_photo_url: string;
  tag_code: string;
  master_product_id: string;
  qty: number;
  condition: "good" | "damaged";
  code_ref?: string;
  description?: string;
  child_unit_qty?: number;
};

export type ReceivingTransaction = {
  id: string;
  warehouse_id: string;
  location_id: string;
  tag_id: string;
  master_product_id: string;
  qty: number;

  initial_condition: "GOOD" | "DAMAGED";

  proof_photo_url: string;

  received_by: string;

  resulting_status: "newly_registered" | "in_warehouse" | "in_use" | "borrowed";

  created_at: string;
};

export type ReceivingTransactionResponse = {
  success: boolean;
  data: ReceivingTransaction;
};
