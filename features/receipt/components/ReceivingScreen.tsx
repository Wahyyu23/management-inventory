import { ReceivingWizard } from "./ReceivingWizard";

export function ReceivingScreen() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-page-title font-semibold tracking-tight text-foreground">
          Receiving
        </h1>

        <p className="mt-1 text-small text-muted-foreground">
          Process incoming inventory and register RFID-tagged items.
        </p>
      </div>

      <ReceivingWizard />
    </div>
  );
}
