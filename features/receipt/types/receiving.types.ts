import { MASTER_PRODUCT_CATEGORIES, MASTER_PRODUCT_MEASUREMENT } from "../constants/master-product.constants";

export type WarehousesStatus = "active" | "inactive";

export type Warehouse = {
  id: string;
  status: WarehousesStatus;
  name: string;
  created_at: string;
  addressSite: string;
};

export type Location = {
  id: string;
  warehouse_id: string;
  zone: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total_pages: number;
  total_items: number;
};

export type WarehouseListResponse = {
  success: boolean;
  data: Warehouse[];
  meta: PaginationMeta | null;
};

export type LocationListResponse = {
  success: boolean;
  data: Location[];
};

export type SelectOption = {
  label: string;
  value: string;
};

export type MasterProductCategory = 
(typeof MASTER_PRODUCT_CATEGORIES)[number];

export type MasterProductMeasurement = 
(typeof MASTER_PRODUCT_MEASUREMENT)[number];

export type MasterProductInput = {
    name: string,
    category: MasterProductCategory,
    measurement: MasterProductMeasurement,
    brand: string,
    description?: string  
}

export type MasterProduct = {
    id: string,
    name: string,
    category: MasterProductCategory,
    measurement: MasterProductMeasurement,
    brand: string,
    description?: string
}

export type MasterProductListResponse = {
    success: boolean,
    data: MasterProduct[],
    meta: PaginationMeta | null
}

export type MasterProductCreateResponse = {
    success: boolean,
    data: MasterProduct
}