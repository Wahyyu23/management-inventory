import {
  FiCheckCircle,
  FiRadio,
} from "react-icons/fi";

import { Button } from "@/components/ui/button";

type RfidStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export function RfidStep({
  onNext,
  onBack,
}: RfidStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-section-title font-semibold text-foreground">
          RFID Tagging
        </h2>

        <p className="mt-1 text-small text-muted-foreground">
          Attach the RFID sticker and read the tag using the RFID reader.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">
                RFID Reader
              </h3>

              <p className="mt-1 text-small text-muted-foreground">
                Use the connected RFID reader to detect the tag.
              </p>
            </div>

            <div className="flex items-center gap-2 text-small text-primary">
              <FiCheckCircle className="size-4" />

              <span>
                Reader Connected
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiRadio className="size-7" />
            </div>

            <h4 className="mt-4 font-medium text-foreground">
              Waiting for RFID tag
            </h4>

            <p className="mt-1 max-w-md text-small text-muted-foreground">
              Place the RFID tag near the reader, then start the reading process.
            </p>

            <Button className="mt-6">
              Read RFID Tag
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border p-6">
          <div>
            <h3 className="font-semibold text-foreground">
              Tag Information
            </h3>

            <p className="mt-1 text-small text-muted-foreground">
              RFID information detected by the reader.
            </p>
          </div>

          <div className="mt-5 rounded-lg bg-muted/40 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              TAG ID
            </p>

            <p className="mt-1 font-mono text-sm text-foreground">
              —
            </p>
          </div>
        </div>
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