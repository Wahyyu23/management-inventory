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
      MASTER_PRODUCT_CATEGORIES
    ),

    measurement: z.enum(
      MASTER_PRODUCT_MEASUREMENT
    ),

    description: z
      .string()
      .trim()
      .optional(),
  });

export type CreateMasterProductFormValues =
  z.infer<
    typeof createMasterProductSchema
  >;