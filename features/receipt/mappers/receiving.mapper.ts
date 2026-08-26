import {
  Location,
  MasterProduct,
  SelectOption,
  Warehouse,
} from "../types/receiving.types";

export function mapWarehouseToOption(warehouse: Warehouse): SelectOption {
  return {
    label: warehouse.name,
    value: warehouse.id,
  };
}

export function mapWarehousesToOptions(
  warehouses: Warehouse[],
): SelectOption[] {
  return warehouses.map(mapWarehouseToOption);
}

export function mapLocationToOption(location: Location): SelectOption {
  return {
    label: location.zone,
    value: location.id,
  };
}

export function mapLocationsToOptions(locations: Location[]): SelectOption[] {
  return locations.map(mapLocationToOption);
}

export function mapMasterProductToOption(
  masterProduct: MasterProduct,
): SelectOption {
  return {
    label: masterProduct.name,
    value: masterProduct.id,
  };
}

export function mapMasterProductsToOptions(
  masterProduct: MasterProduct[],
): SelectOption[] {
  return masterProduct.map(mapMasterProductToOption);
}
