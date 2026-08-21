import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type ItemInformationStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export function ItemInformationStep({
  onNext,
  onBack,
}: ItemInformationStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-section-title font-semibold text-foreground">
          Item Information
        </h2>

        <p className="mt-1 text-small text-muted-foreground">
          Complete the inventory information for the tagged item.
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
              Laptop Lenovo ThinkPad T14
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              RFID Tag
            </p>

            <p className="mt-1 font-mono text-sm font-medium text-foreground">
              E28068940000501A
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Condition
            </p>

            <p className="mt-1 text-sm font-medium text-foreground">
              Good
            </p>
          </div>
        </div>
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
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="rack-position">
            Rack / Storage Position
          </FieldLabel>

          <Input
            id="rack-position"
            placeholder="Enter rack or storage position"
          />
        </Field>
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>

        <Button onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}