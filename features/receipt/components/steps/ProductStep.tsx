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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const products = [
  "Laptop Lenovo ThinkPad T14",
  "Dell Monitor P2422H",
  "Logitech Mouse M331",
];

type ProductStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export function ProductStep({ onNext, onBack }: ProductStepProps) {
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

          <Combobox items={products}>
            <ComboboxInput placeholder="Search for a master product..." />

            <ComboboxContent>
              <ComboboxEmpty>No results found.</ComboboxEmpty>

              <ComboboxList>
                {(product) => (
                  <ComboboxItem key={product} value={product}>
                    {product}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>

        <div className="rounded-lg border border-dashed p-4">
          <p className="text-small text-muted-foreground">
            Can&apos;t find the master product?
          </p>

          <Dialog>
            <DialogTrigger>
              <Button variant="outline" className="mt-3">
                Add new
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Master Product</DialogTitle>
                <DialogDescription>
                  Register a new master product before continuing the receiving
                  process.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Field>
                  <FieldLabel>Product Name</FieldLabel>
                  <Input
                    placeholder="ex : ESP32, Power Supply Unit, etc"
                    className="placeholder:italic"
                  />
                </Field>

                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <Input
                    placeholder="ex : Microcontroller, Measurement Tools, etc"
                    className="placeholder:italic"
                  />
                </Field>

                <Field>
                  <FieldLabel>Brand</FieldLabel>
                  <Input
                    placeholder="ex : Espressif, Siemens, etc"
                    className="placeholder:italic"
                  />
                </Field>

                <Field>
                  <FieldLabel>Measurement</FieldLabel>
                  <Input
                    placeholder="ex : Meters, Pouch, Pcs, Boxes, etc"
                    className="placeholder:italic"
                  />
                </Field>

                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Input
                    placeholder="ex : This device is used to measure..."
                    className="placeholder:italic"
                  />
                </Field>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Add Product</Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 border-t pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>

        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
