"use client";

import { useEffect } from "react";

import {
  useFormContext,
  useWatch,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field";
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
    setError,
    clearErrors,
    getValues,
    trigger,
    formState: { errors },
  } =
    useFormContext<ReceivingFormValues>();

  const {
    masterProduct,
    isLoading:
      isLoadingMasterProducts,
    isError:
      isErrorMasterProducts,
  } = useMasterProducts();

  const masterProductId =
    useWatch({
      control,
      name: "master_product_id",
    });

  const tagCode =
    useWatch({
      control,
      name: "tag_code",
    });

  const condition =
    useWatch({
      control,
      name: "condition",
    });

  const selectedProduct =
    masterProduct.find(
      (product) =>
        product.id ===
        masterProductId
    );

  const isPackageMeasurement =
    selectedProduct?.measurement ===
      "box" ||
    selectedProduct?.measurement ===
      "pack";

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    if (isPackageMeasurement) {

      setValue(
        "qty",
        1,
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      );

      return;
    }

    setValue(
      "child_unit_qty",
      undefined,
      {
        shouldDirty: true,
        shouldValidate: false,
      }
    );

    clearErrors(
      "child_unit_qty"
    );
  }, [
    selectedProduct,
    isPackageMeasurement,
    setValue,
    clearErrors,
  ]);

  const conditionLabel =
    condition === "good"
      ? "Good"
      : condition === "damaged"
        ? "Damaged"
        : "—";

  async function handleNextStep() {
    if (!selectedProduct) {
      return;
    }

    const isValid =
      await trigger([
        "qty",
        "child_unit_qty",
      ]);

    if (!isValid) {
      return;
    }

    if (isPackageMeasurement) {
      const childUnitQty =
        getValues(
          "child_unit_qty"
        );

      if (
        typeof childUnitQty !==
          "number" ||
        !Number.isInteger(
          childUnitQty
        ) ||
        childUnitQty <= 0
      ) {
        setError(
          "child_unit_qty",
          {
            type: "manual",
            message:
              "Child unit quantity is required for box or pack.",
          }
        );

        return;
      }

      clearErrors(
        "child_unit_qty"
      );
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
          Complete the inventory
          information for the tagged
          item.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Item Context
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Product
            </p>

            <p className="mt-1 text-sm font-medium text-foreground">
              {isLoadingMasterProducts
                ? "Loading..."
                : selectedProduct
                  ?.name ?? "—"}
            </p>

            {selectedProduct && (
              <p className="mt-1 text-xs text-muted-foreground">
                Measurement:{" "}
                {
                  selectedProduct.measurement.charAt(0).toUpperCase() +
                  selectedProduct.measurement.slice(1)
                }
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              RFID Tag
            </p>

            <p className="mt-1 font-mono text-sm font-medium text-foreground">
              {tagCode || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Condition
            </p>

            <p className="mt-1 text-sm font-medium text-foreground">
              {conditionLabel}
            </p>
          </div>
        </div>

        {isErrorMasterProducts && (
          <p className="mt-4 text-sm text-destructive">
            Failed to load master
            product information.
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="quantity">
            Quantity
          </FieldLabel>

          <Input
            id="quantity"
            type="number"
            min="1"
            placeholder="Enter quantity"

            readOnly={
              isPackageMeasurement
            }

            {...register(
              "qty",
              {
                setValueAs: (
                  value
                ) =>
                  value === ""
                    ? undefined
                    : Number(value),
              }
            )}
          />

          {isPackageMeasurement && (
            <p className="text-xs text-muted-foreground">
              Quantity is fixed to 1
              for box and pack
              measurements.
            </p>
          )}

          {errors.qty && (
            <p className="text-sm text-destructive">
              {
                errors.qty.message
              }
            </p>
          )}
        </Field>

        {isPackageMeasurement && (
          <Field>
            <FieldLabel htmlFor="child-unit-quantity">
              Child Unit Quantity
            </FieldLabel>

            <Input
              id="child-unit-quantity"
              type="number"
              min="1"
              placeholder="Enter child unit quantity"
              {...register(
                "child_unit_qty",
                {
                  setValueAs: (
                    value
                  ) =>
                    value === ""
                      ? undefined
                      : Number(
                          value
                        ),
                }
              )}
            />

            <p className="text-xs text-muted-foreground">
              Enter the number of
              individual units inside
              this{" "}
              {
                selectedProduct
                  ?.measurement
              }
              .
            </p>

            {errors.child_unit_qty && (
              <p className="text-sm text-destructive">
                {
                  errors
                    .child_unit_qty
                    .message
                }
              </p>
            )}
          </Field>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>

        <Button
          type="button"
          onClick={
            handleNextStep
          }
          disabled={
            isLoadingMasterProducts ||
            isErrorMasterProducts ||
            !selectedProduct
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}