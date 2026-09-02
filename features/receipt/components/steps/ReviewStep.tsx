import { Button } from "@/components/ui/button";
import { ReceivingFormValues } from "../../schema/receiving.schema";
import { useFormContext, useWatch } from "react-hook-form";
import { useWarehouses } from "../../hooks/useWarehouses";
import { useLocations } from "../../hooks/useLocations";
import { useMasterProducts } from "../../hooks/useMasterProduct";

type ReviewStepProps = {
  onBack: () => void;
};

export function ReviewStep({ onBack }: ReviewStepProps) {
  const { control } = useFormContext<ReceivingFormValues>();

  const [
    purchaseReferenceNumber,
    warehouseId,
    locationId,
    masterProductId,
    condition,
    description,
    proofPhotoUrl,
    tagCode,
    qty,
    childUnitQty,
  ] = useWatch({
    control,
    name: [
      "purchase_reference_number",
      "warehouse_id",
      "location_id",
      "master_product_id",
      "condition",
      "description",
      "proof_photo_url",
      "tag_code",
      "qty",
      "child_unit_qty",
    ],
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
  } = useLocations(warehouseId);

  const {
    masterProduct,
    isLoading: isLoadingMasterProducts,
    isError: isErrorMasterProducts,
  } = useMasterProducts();

  const selectedWarehouse = warehousesOptions.find(
    (warehouse) => warehouse.value === warehouseId,
  );

  const selectedLocations = locationsOptions.find(
    (location) => location.value === locationId,
  );

  const selectedProduct = masterProduct.find(
    (product) => product.id === masterProductId,
  );

  const isPackageMeasurement =
    selectedProduct?.measurement === "box" ||
    selectedProduct?.measurement === "pack";

  const conditionLabel =
    condition === "good" ? "Good" : condition === "damaged" ? "Damaged" : "-";

  const isLloadingReferenceData =
    isLoadingWarehouses || isLoadingLocations || isLoadingMasterProducts;

  const hasReferenceDataError =
    isErrorWarehouses || isErrorLocations || isErrorMasterProducts;

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

      {hasReferenceDataError && (
        <div className="rounded-lg border border-destructive p-4">
          <p className="text-sm text-destructive">
            Failed to load some reference information.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <ReviewSection title="Receiving Information">
          <ReviewItem
            label="Purchase Reference"
            value={purchaseReferenceNumber || "-"}
          />

          <ReviewItem
            label="Warehouse"
            value={selectedWarehouse?.label || "-"}
          />

          <ReviewItem
            label="Location / Zone"
            value={selectedLocations?.label || "-"}
          />
        </ReviewSection>

        <ReviewSection title="Product">
          <ReviewItem
            label="Product"
            value={
              isLoadingMasterProducts
                ? "Loading..."
                : (selectedProduct?.name ?? "-")
            }
          />

          <ReviewItem
            label="Category"
            value={
              isLoadingMasterProducts
                ? "Loading..."
                : (selectedProduct?.category ?? "-")
            }
          />

          <ReviewItem
            label="Brand"
            value={
              isLoadingMasterProducts
                ? "Loading..."
                : (selectedProduct?.brand ?? "-")
            }
          />

          <ReviewItem
            label="Measurement"
            value={selectedProduct?.measurement? selectedProduct.measurement.charAt(0).toUpperCase() + selectedProduct.measurement.slice(1) : "-"}
          />
        </ReviewSection>

        <ReviewSection title="Initial Inspection">
          <ReviewItem label="Initial Condition" value={conditionLabel} />

          <ReviewItem
            label={condition === "damaged" ? "Damage Description" : "Notes"}
            value={description || "—"}
          />

          <div className="md:col-span-2">
            <p className="text-xs text-muted-foreground">Proof Photo</p>

            {proofPhotoUrl ? (
              <div className="mt-2 overflow-hidden rounded-lg border border-border">
                <img
                  src={proofPhotoUrl}
                  alt="Proof photo"
                  className="max-h-56 w-full object-contain"
                />
              </div>
            ) : (
              <p className="mt-1 text-sm font-medium text-foreground">—</p>
            )}
          </div>
        </ReviewSection>

        <ReviewSection title="RFID">
          <ReviewItem label="Tag Code" value={tagCode || "-"} mono />
        </ReviewSection>

        <ReviewSection title="Item Information">
          <ReviewItem
            label="Quantity"
            value={typeof qty === "number" ? String(qty) : "-"}
          />

          {isPackageMeasurement && (
            <ReviewItem
              label="Child Unit Quantity"
              value={
                typeof childUnitQty === "number" ? String(childUnitQty) : "-"
              }
            />
          )}
        </ReviewSection>
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <Button 
        variant="outline"
        type="button" 
        onClick={onBack}
        >
          Back
        </Button>

        <Button
        type="button"
        disabled={isLloadingReferenceData || hasReferenceDataError}
        
        >Save Receiving</Button>
      </div>
    </div>
  );
}

type ReviewSectionProps = {
  title: string;
  children: React.ReactNode;
};

function ReviewSection({ title, children }: ReviewSectionProps) {
  return (
    <div className="rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>

      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

type ReviewItemProps = {
  label: string;
  value: string;
  mono?: boolean;
};

function ReviewItem({ label, value, mono = false }: ReviewItemProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>

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
