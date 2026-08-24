"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";

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

import { useWarehouses } from "../../hooks/useWarehouses";
import { useLocations } from "../../hooks/useLocations";
import type { ReceivingFormValues } from "../../schema/receiving.schema";

type ReceivingInfoStepProps = {
  onNext: () => void;
};

export function ReceivingInfoStep({ onNext }: ReceivingInfoStepProps) {
  const {
    register,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<ReceivingFormValues>();

  const warehouseId = useWatch({
    control,
    name: "warehouse_id",
  });

  const {
    warehousesOptions,
    isLoading: isLoadingWarehouses,
    isError: isErrorWarehouses,
  } = useWarehouses();

  const {
    locationsOptions,
    isLoading: isLoadingLocations,
    isError: isErrorLocations,
  } = useLocations(warehouseId || undefined);

  async function handleNextStep() {
    const isValid = await trigger([
      "purchase_reference_number",
      "warehouse_id",
      "location_id",
    ]);

    if (!isValid) {
      return;
    }

    onNext();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-section-title font-semibold text-foreground">
          Receiving Information
        </h2>

        <p className="mt-1 text-small text-muted-foreground">
          Provide the transaction reference and destination information.
        </p>
      </div>

      <div className="space-y-6">
        <Field>
          <FieldLabel htmlFor="purchase-reference">
            Purchase Reference Number
          </FieldLabel>

          <Input
            id="purchase-reference"
            placeholder="Enter purchase reference number"
            {...register("purchase_reference_number")}
          />

          {errors.purchase_reference_number && (
            <p className="text-sm text-destructive">
              {errors.purchase_reference_number.message}
            </p>
          )}
        </Field>

        <div className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel>Warehouse</FieldLabel>

            <Controller
              name="warehouse_id"
              control={control}
              render={({ field }) => (
                <Select
                  items={warehousesOptions}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value ?? "");

                    setValue("location_id", "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  disabled={isLoadingWarehouses || isErrorWarehouses}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingWarehouses
                          ? "Loading warehouses..."
                          : "Select warehouse"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {warehousesOptions.map((warehouse) => (
                        <SelectItem
                          key={warehouse.value}
                          value={warehouse.value}
                        >
                          {warehouse.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.warehouse_id && (
              <p className="text-sm text-destructive">
                {errors.warehouse_id.message}
              </p>
            )}

            {isErrorWarehouses && (
              <p className="text-sm text-destructive">
                Failed to load warehouses.
              </p>
            )}

            {!isLoadingWarehouses &&
              !isErrorWarehouses &&
              warehousesOptions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No warehouses available.
                </p>
              )}
          </Field>

          <Field>
            <FieldLabel>Location / Zone</FieldLabel>

            <Controller
              name="location_id"
              control={control}
              render={({ field }) => (
                <Select
                  items={locationsOptions}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? "")}
                  disabled={
                    !warehouseId || isLoadingLocations || isErrorLocations
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        !warehouseId
                          ? "Select warehouse first"
                          : isLoadingLocations
                            ? "Loading locations..."
                            : "Select location"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {locationsOptions.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.location_id && (
              <p className="text-sm text-destructive">
                {errors.location_id.message}
              </p>
            )}

            {isErrorLocations && (
              <p className="text-sm text-destructive">
                Failed to load locations.
              </p>
            )}

            {warehouseId &&
              !isLoadingLocations &&
              !isErrorLocations &&
              locationsOptions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No locations available for this warehouse.
                </p>
              )}
          </Field>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t pt-6">
        <Button type="button" variant="outline">
          Cancel
        </Button>

        <Button type="button" onClick={handleNextStep}>
          Next
        </Button>
      </div>
    </div>
  );
}
