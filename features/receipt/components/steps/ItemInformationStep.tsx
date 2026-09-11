"use client";

import { useEffect } from "react";

import { useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useMasterProducts } from "../../hooks/useMasterProduct";

import type { ReceivingFormValues } from "../../schema/receiving.schema";

type ItemInformationStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export function ItemInformationStep({
  onNext,
  onBack,
}: ItemInformationStepProps) {
  const {
    register,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<ReceivingFormValues>();

  const {
    masterProduct,
    isLoading: isLoadingMasterProducts,
    isError: isErrorMasterProducts,
  } = useMasterProducts();

  const masterProductId = useWatch({
    control,
    name: "master_product_id",
  });

  const condition = useWatch({
    control,
    name: "condition",
  });

  const selectedProduct = masterProduct.find(
    (product) => product.id === masterProductId,
  );

  const isEditableQuantity =
    selectedProduct?.measurement === "box" ||
    selectedProduct?.measurement === "pack";

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    if (isEditableQuantity) {
      return;
    }

    setValue("qty", 1, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [selectedProduct, isEditableQuantity, setValue]);

  const conditionLabel =
    condition === "good" ? "Good" : condition === "damaged" ? "Damaged" : "—";

  async function handleNextStep() {
    if (!selectedProduct) {
      return;
    }

    const isValid = await trigger("qty");

    if (!isValid) {
      return;
    }

    onNext();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-section-title font-semibold text-foreground">
          Item Information
        </h2>

        <p className="mt-1 text-small text-muted-foreground">
          Complete the quantity information before RFID tagging.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Item Context
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Product</p>

            <p className="mt-1 text-sm font-medium text-foreground">
              {isLoadingMasterProducts
                ? "Loading..."
                : (selectedProduct?.name ?? "—")}
            </p>

            {selectedProduct && (
              <p className="mt-1 text-xs text-muted-foreground">
                Measurement:{" "}
                {selectedProduct.measurement.charAt(0).toUpperCase() +
                  selectedProduct.measurement.slice(1)}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Condition</p>

            <p className="mt-1 text-sm font-medium text-foreground">
              {conditionLabel}
            </p>
          </div>
        </div>

        {isErrorMasterProducts && (
          <p className="mt-4 text-sm text-destructive">
            Failed to load master product information.
          </p>
        )}
      </div>

      <div>
        <Field>
          <FieldLabel htmlFor="quantity">Quantity</FieldLabel>

          <Input
            id="quantity"
            type="number"
            min="1"
            placeholder={isEditableQuantity ? "Enter quantity" : "1"}
            readOnly={!isEditableQuantity}
            {...register("qty", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {selectedProduct && (
            <p className="mt-1 text-xs text-muted-foreground">
              {isEditableQuantity
                ? `Enter the quantity for this ${selectedProduct.measurement}.`
                : `Quantity is automatically set to 1 for ${selectedProduct.measurement} measurement.`}
            </p>
          )}

          {errors.qty && (
            <p className="text-sm text-destructive">{errors.qty.message}</p>
          )}
        </Field>
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>

        <Button
          type="button"
          onClick={handleNextStep}
          disabled={
            isLoadingMasterProducts || isErrorMasterProducts || !selectedProduct
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
