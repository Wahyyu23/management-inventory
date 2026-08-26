import { useState } from "react";
import { MasterProduct, MasterProductInput } from "../../types/receiving.types";
import { Controller, useForm } from "react-hook-form";
import {
  CreateMasterProductFormValues,
  createMasterProductSchema,
} from "../../schema/master-product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMasterProduct } from "../../services/receiving.services";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MASTER_PRODUCT_CATEGORY_OPTIONS,
  MASTER_PRODUCT_MEASUREMENT_OPTIONS,
} from "../../constants/master-product.constants";

type AddMasterProductDialogProps = {
  onCreated: (product: MasterProduct) => void | Promise<void>;
};

export function AddMasterProductDialog({
  onCreated,
}: AddMasterProductDialogProps) {
  const [open, setOpen] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,

    formState: { errors, isSubmitting },
  } = useForm<CreateMasterProductFormValues>({
    resolver: zodResolver(createMasterProductSchema),

    defaultValues: {
      name: "",
      description: "",
    },

    mode: "onTouched",
  });

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
      setSubmitError(null);
    }
    setOpen(nextOpen);
  }

  async function handleCreateProduct(values: CreateMasterProductFormValues) {
    try {
      setSubmitError(null);

      const input: MasterProductInput = {
        name: values.name,
        category: values.category,
        measurement: values.measurement,
        brand: values.brand,
        description: values.description || undefined,
      };

      const response = await createMasterProduct(input);
      await onCreated(response.data);

      handleOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to Create Master Product",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button type="button" variant="outline" className="mt-3" />}
      >
        Add New
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Master Product</DialogTitle>

          <DialogDescription>
            Register a new master product before continuing the receiving
            process.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleCreateProduct)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Product Name</FieldLabel>
            <Input
              placeholder="ex : ESP32, Power Supply Unit, etc"
              className="placeholder:italic"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel>Category</FieldLabel>

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  items={MASTER_PRODUCT_CATEGORY_OPTIONS}
                  value={field.value ?? null}
                  onValueChange={(value) => {
                    setValue("category", value!, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {MASTER_PRODUCT_CATEGORY_OPTIONS.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel>Brand</FieldLabel>
            <Input
              placeholder="ex : Espressif, Siemens, etc"
              className="placeholder:italic"
              {...register("brand")}
            />

            {errors.brand && (
              <p className="text-sm text-destructive">{errors.brand.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel>Measurement</FieldLabel>

            <Controller
              name="measurement"
              control={control}
              render={({ field }) => (
                <Select
                  items={MASTER_PRODUCT_MEASUREMENT_OPTIONS}
                  value={field.value ?? null}
                  onValueChange={(value) => {
                    setValue("measurement", value!, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select measurement" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {MASTER_PRODUCT_MEASUREMENT_OPTIONS.map((measurement) => (
                        <SelectItem
                          key={measurement.value}
                          value={measurement.value}
                        >
                          {measurement.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.measurement && (
              <p className="text-sm text-destructive">
                {errors.measurement.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>

            <Input
              placeholder="ex : This device is used to measure..."
              className="placeholder:italic"
              {...register("description")}
            />
          </Field>

          {submitError && (
            <p className="text-sm text-destructive">{submitError}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
