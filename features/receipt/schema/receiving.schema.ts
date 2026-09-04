import z from "zod";

export const receivingFormSchema = z.object({
  purchase_reference_number: z
    .string()
    .trim()
    .min(1, "Purchase Reference Number is required"),

  warehouse_id: z.string().min(1, "Warehouse is required"),

  location_id: z.string().min(1, "Location is required"),

  master_product_id: z.string().min(1, "Master product is required."),

  condition: z.enum(["good", "damaged"], { error: "Condition is required." }),

  description: z.string().trim().min(1, "Description is required."),

  proof_photo_url: z
    .string()
    .trim()
    .min(1, "Proof photo is required.")
    .url("Proof photo url is invalid."),

  tag_code: z
    .string()
    .trim()
    .min(1, "Tag code is required.")
    .startsWith("PSI-", "Tag code must start with PSI-"),

  qty: z
    .number({
      error: "Quantity is required.",
    })
    .int("Quantity must be a whole number.")
    .positive("Quantity must be greater than 0."),

  child_unit_qty: z
    .number({
      error: "Child unit quantity must be a number.",
    })
    .int("Child unit quantity must be a whole number.")
    .positive("Child unit quantity must be greater than 0.")
    .optional(),
});

export type ReceivingFormValues = z.infer<typeof receivingFormSchema>;
