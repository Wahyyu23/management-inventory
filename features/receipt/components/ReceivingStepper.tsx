const steps = [
  "Receiving Information",
  "Product",
  "Inspection",
  "RFID Tagging",
  "Item Info",
  "Review",
];

type ReceivingStepperProps = {
  currentStep: number;
};

export function ReceivingStepper({ currentStep }: ReceivingStepperProps) {
  return (
    <div className="flex w-full items-center">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={[
                  "flex size-9 items-center justify-center rounded-full border text-sm font-medium",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCompleted
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground",
                ].join(" ")}
              >
                {stepNumber}
              </div>

              <span
                className={[
                  "whitespace-nowrap text-xs",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="mx-3 h-px flex-1 bg-border" />
            )}
          </div>
        );
      })}
    </div>
  );
}
