import z from "zod";

export const receivingFormSchema = z.object({
  purchase_reference_number: z
    .string()
    .trim()
    .min(1, "Purchase Reference Number is required"),

  warehouse_id: z.string().min(1, "Warehouse is required"),

  location_id: z.string().min(1, "Location is required"),

  master_product_id: z.string().min(1, "Master product is required."),
});

export type ReceivingFormValues = z.infer<typeof receivingFormSchema>;
