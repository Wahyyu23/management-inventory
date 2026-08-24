import { Location, SelectOption, Warehouse } from "../types/receiving.types";

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
