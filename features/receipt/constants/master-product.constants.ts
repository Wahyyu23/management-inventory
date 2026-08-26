export const MASTER_PRODUCT_CATEGORIES = [
  "Electrical Component",
  "Mechanical Component",
  "IT Component",
  "Administration Component",
  "Electrical Tools",
  "Mechanical Tools",
  "IT Tools",
  "Administration Tools(path)$0",
  "Other",
] as const;

export const MASTER_PRODUCT_MEASUREMENT = [
  "unit",
  "set",
  "box",
  "pack",
  "kg",
  "meter",
  "liter",
] as const;

export const MASTER_PRODUCT_CATEGORY_OPTIONS = MASTER_PRODUCT_CATEGORIES.map(
  (value) => ({
    value,
    label:
      value === "Administration Tools(path)$0" ? "Administration Tools" : value,
  }),
);

export const MASTER_PRODUCT_MEASUREMENT_OPTIONS =
  MASTER_PRODUCT_MEASUREMENT.map((value) => ({
    value,
    label: value,
  }));
