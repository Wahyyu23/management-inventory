import { Button } from "@/components/ui/button";

type ReviewStepProps = {
  onBack: () => void;
};

export function ReviewStep({
  onBack,
}: ReviewStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-section-title font-semibold text-foreground">
          Review Receiving
        </h2>

        <p className="mt-1 text-small text-muted-foreground">
          Review all information before saving this receiving transaction.
        </p>
      </div>

      <div className="space-y-4">
        <ReviewSection title="Receiving Information">
          <ReviewItem
            label="Purchase Reference"
            value="PO-2026-001"
          />

          <ReviewItem
            label="Warehouse"
            value="Main Warehouse"
          />

          <ReviewItem
            label="Location / Zone"
            value="Zone A"
          />
        </ReviewSection>

        <ReviewSection title="Product">
          <ReviewItem
            label="Product"
            value="Laptop Lenovo ThinkPad T14"
          />

          <ReviewItem
            label="Category"
            value="Laptop"
          />

          <ReviewItem
            label="Brand"
            value="Lenovo"
          />

          <ReviewItem
            label="Measurement"
            value="Pcs"
          />
        </ReviewSection>

        <ReviewSection title="Initial Inspection">
          <ReviewItem
            label="Initial Condition"
            value="Good"
          />
        </ReviewSection>

        <ReviewSection title="RFID">
          <ReviewItem
            label="Tag ID"
            value="E28068940000501A"
            mono
          />
        </ReviewSection>

        <ReviewSection title="Item Information">
          <ReviewItem
            label="Quantity"
            value="5"
          />

          <ReviewItem
            label="Rack / Storage Position"
            value="Rack A-01"
          />
        </ReviewSection>
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>

        <Button>
          Save Receiving
        </Button>
      </div>
    </div>
  );
}

type ReviewSectionProps = {
  title: string;
  children: React.ReactNode;
};

function ReviewSection({
  title,
  children,
}: ReviewSectionProps) {
  return (
    <div className="rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground">
        {title}
      </h3>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

type ReviewItemProps = {
  label: string;
  value: string;
  mono?: boolean;
};

function ReviewItem({
  label,
  value,
  mono = false,
}: ReviewItemProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p
        className={[
          "mt-1 text-sm font-medium text-foreground",
          mono ? "font-mono" : "",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}