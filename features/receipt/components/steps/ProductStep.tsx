"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import { useMasterProducts } from "../../hooks/useMasterProduct";

import type { ReceivingFormValues } from "../../schema/receiving.schema";

import type { MasterProduct } from "../../types/receiving.types";

import { AddMasterProductDialog } from "../dialogs/AddMasterProductDialog";

type ProductStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export function ProductStep({ onNext, onBack }: ProductStepProps) {
  const {
    control,
    setValue,
    trigger,

    formState: { errors },
  } = useFormContext<ReceivingFormValues>();

  const {
    masterProductsOptions,

    isLoading: isLoadingMasterProducts,

    isError: isErrorMasterProducts,

    addMasterProductToCache,
  } = useMasterProducts();

  async function handleProductCreated(product: MasterProduct) {
    await addMasterProductToCache(product);

    setValue("master_product_id", product.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function handleNextStep() {
    const isValid = await trigger("master_product_id");

    if (!isValid) {
      return;
    }

    onNext();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-section-title font-semibold text-foreground">
          Product Identification
        </h2>

        <p className="mt-1 text-small text-muted-foreground">
          Search and select the master product for the incoming item
        </p>
      </div>

      <div className="space-y-6">
        <Field>
          <FieldLabel>Master Product</FieldLabel>

          <Controller
            name="master_product_id"
            control={control}
            render={({ field }) => {
              const selectedProduct =
                masterProductsOptions.find(
                  (product) => product.value === field.value,
                ) ?? null;

              return (
                <Combobox
                  items={masterProductsOptions}
                  value={selectedProduct}

                  onValueChange={(product) =>
                    setValue("master_product_id", product?.value ?? "", {
                      shouldDirty: true,
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  itemToStringValue={(product) => product.label}
                  disabled={isLoadingMasterProducts || isErrorMasterProducts}
                >
                  <ComboboxInput
                    placeholder={
                      isLoadingMasterProducts
                        ? "Loading master products..."
                        : "Search for a master product..."
                    }
                  />

                  <ComboboxContent>
                    <ComboboxEmpty>No results found.</ComboboxEmpty>

                    <ComboboxList>
                      {(product) => (
                        <ComboboxItem key={product.value} value={product}>
                          {product.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              );
            }}
          />

          {errors.master_product_id && (
            <p className="text-sm text-destructive">
              {errors.master_product_id.message}
            </p>
          )}

          {isErrorMasterProducts && (
            <p className="text-sm text-destructive">
              Failed to load master products.
            </p>
          )}

          {!isLoadingMasterProducts &&
            !isErrorMasterProducts &&
            masterProductsOptions.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No master products available.
              </p>
            )}
        </Field>

        <div className="rounded-lg border border-dashed p-4">
          <p className="text-small text-muted-foreground">
            Can&apos;t find the master product?
          </p>

          <AddMasterProductDialog onCreated={handleProductCreated} />
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>

        <Button type="button" onClick={handleNextStep}>
          Next
        </Button>
      </div>
    </div>
  );
}
