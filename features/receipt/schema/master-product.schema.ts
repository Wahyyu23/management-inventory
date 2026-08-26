import { z } from "zod";

import {
  MASTER_PRODUCT_CATEGORIES,
  MASTER_PRODUCT_MEASUREMENT,
} from "../constants/master-product.constants";

export const createMasterProductSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "Product name is required."
      ),

    category: z.enum(
      MASTER_PRODUCT_CATEGORIES,
      {
        error: "Product category is required.",
      }
    ),

    measurement: z.enum(
      MASTER_PRODUCT_MEASUREMENT,
      {
        error: "Product measurement is required.",
      }
    ),

    description: z
      .string()
      .trim()
      .optional(),

    brand: z
      .string()
      .trim(),
  });

export type CreateMasterProductFormValues =
  z.infer<
    typeof createMasterProductSchema
  >;