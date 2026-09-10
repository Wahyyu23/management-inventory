export const MASTER_PRODUCT_CATEGORIES = [
  "ELECTRICAL_COMPONENT",
  "MECHANICAL_COMPONENT",
  "IT_COMPONENT",
  "ADMINISTRATION_COMPONENT",
  "ELECTRICAL_TOOLS",
  "MECHANICAL_TOOLS",
  "IT_TOOLS",
  "ADMINISTRATION_TOOLS(path)$0",
  "OTHER",
] as const;

export const MASTER_PRODUCT_MEASUREMENT = [
  "UNIT",
  "SET",
  "BOX",
  "PACK",
  "KG",
  "METER",
  "LITER",
] as const;

export const MASTER_PRODUCT_CATEGORY_OPTIONS = MASTER_PRODUCT_CATEGORIES.map(
  (value) => ({
    value,
    label:
      value === "ADMINISTRATION_TOOLS(path)$0" ? "Administration Tools" : value,
  }),
);

export const MASTER_PRODUCT_MEASUREMENT_OPTIONS =
  MASTER_PRODUCT_MEASUREMENT.map((value) => ({
    value,
    label: value,
  }));
