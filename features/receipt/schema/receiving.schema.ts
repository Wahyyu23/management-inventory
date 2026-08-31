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

  proof_photo_url: z.string().trim().min(1, "Proof photo is required.").url("Proof photo url is invalid."),

  tag_code: z.string().trim().min(1, "Tag code is required.").startsWith(
    "PSI-",
    "Tag code must start with PSI-"
  ),
});

export type ReceivingFormValues = z.infer<typeof receivingFormSchema>;
