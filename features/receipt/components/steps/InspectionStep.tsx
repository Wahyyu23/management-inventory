"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { ReceivingFormValues } from "../../schema/receiving.schema";

import { ProofPhotoField } from "../ProofPhotoField";
import { set } from "zod";
import { useState } from "react";

type InspectionStepProps = {
  onNext: () => void;
  onBack: () => void;
  proofPhoto: File | null;
  onProofPhotoChange: (file: File | null) => void;
};

const conditions = [
  {
    label: "Good",
    value: "good",
  },
  {
    label: "Damaged",
    value: "damaged",
  },
] as const;

export function InspectionStep(
  { 
    onNext, 
    onBack,
    proofPhoto,
    onProofPhotoChange 
  }: InspectionStepProps) {
  const {
    register,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<ReceivingFormValues>();

  const condition = useWatch({
    control,
    name: "condition",
  });

  const isDamaged = condition === "damaged";

  const [proofPhotoRequiredError, setProofPhotoRequiredError] = useState<
    string | null
  >(null);

  function handleProofPhotoChange(file: File | null) {
    if (file) {
      setProofPhotoRequiredError(null);
    }

    onProofPhotoChange(file);
  }

  async function handleNextStep() {
    const isValid = await trigger(["condition", "description"]);

    if (!proofPhoto) {
      setProofPhotoRequiredError("Proof photo is required.");
    }

    if (!isValid || !proofPhoto) {
      return;
    }

    onNext();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-section-title font-semibold text-foreground">
          Initial Inspection
        </h2>

        <p className="mt-1 text-small text-muted-foreground">
          Inspect and record the initial condition of the incoming item.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Field>
            <FieldLabel>Initial Condition</FieldLabel>

            <Controller
              name="condition"
              control={control}
              render={({ field }) => (
                <Select
                  items={conditions}
                  value={field.value ?? null}
                  onValueChange={(value) => {
                    if (value !== "good" && value !== "damaged") {
                      return;
                    }

                    setValue("condition", value, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select item condition" />
                  </SelectTrigger>

                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.condition && (
              <p className="text-sm text-destructive">
                {errors.condition.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="inspection-description">
              {isDamaged ? "Damage Description" : "Notes"}
            </FieldLabel>

            <Textarea
              id="inspection-description"
              placeholder={
                isDamaged
                  ? "Describe the damage condition..."
                  : "Add notes about the item condition..."
              }
              className="min-h-28 resize-none"
              {...register("description")}
            />

            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </Field>
        </div>

        <ProofPhotoField 
          value={proofPhoto}
          onChange={handleProofPhotoChange}
          error={proofPhotoRequiredError}
        />
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
