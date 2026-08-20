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

const warehouses = [
  {
    label: "Main Warehouse",
    value: "main-warehouse",
  },
  {
    label: "Secondary Warehouse",
    value: "secondary-warehouse",
  },
];

const locations = [
  {
    label: "Zone A",
    value: "zone-a",
  },
  {
    label: "Zone B",
    value: "zone-b",
  },
];

type ReceivingInfoStepProps = {
    onNext: () => void;
}

export function ReceivingInfoStep({
    onNext,
}: ReceivingInfoStepProps) {
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
          />
        </Field>

        <div className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel>Warehouse</FieldLabel>

            <Select items={warehouses}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {warehouses.map((warehouse) => (
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
          </Field>

          <Field>
            <FieldLabel>Location / Zone</FieldLabel>

            <Select items={locations}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {locations.map((location) => (
                    <SelectItem
                      key={location.value}
                      value={location.value}
                    >
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t pt-6">
        <Button variant="outline">
          Cancel
        </Button>

        <Button onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}