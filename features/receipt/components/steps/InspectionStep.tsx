"use client";

import { useState } from "react";

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

type InspectionStepProps = {
  onNext: () => void;
  onBack: () => void;
};

const conditions = [
  {
    label: "Good",
    value: "good",
  },
  {
    label: "Minor Damage",
    value: "minor-damage",
  },
  {
    label: "Damaged",
    value: "damaged",
  },
];

export function InspectionStep({
  onNext,
  onBack,
}: InspectionStepProps) {
  const [condition, setCondition] = useState<string | null>(null);

  const requiresDescription =
    condition === "minor-damage" || condition === "damaged";

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

      <div className="space-y-6">
        <Field>
          <FieldLabel>Initial Condition</FieldLabel>

          <Select
            items={conditions}
            value={condition}
            onValueChange={setCondition}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select item condition" />
            </SelectTrigger>

            <SelectContent>
              {conditions.map((condition) => (
                <SelectItem
                  key={condition.value}
                  value={condition.value}
                >
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {requiresDescription && (
          <Field>
            <FieldLabel htmlFor="damage-description">
              Damage Description
            </FieldLabel>

            <Textarea
              id="damage-description"
              placeholder="Describe the damage condition..."
              className="min-h-28 resize-none"
            />
          </Field>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>

        <Button onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}