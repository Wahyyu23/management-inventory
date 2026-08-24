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
