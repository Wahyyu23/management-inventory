"use client";

import { useState } from "react";

import { ReceivingStepper } from "./ReceivingStepper";
import { ReceivingInfoStep } from "./steps/ReceivingInfoStep";
import { ProductStep } from "./steps/ProductStep";
import { InspectionStep } from "./steps/InspectionStep";
import { RfidStep } from "./steps/RfidStep";
import { ItemInformationStep } from "./steps/ItemInformationStep";
import { ReviewStep } from "./steps/ReviewStep";

export function ReceivingWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  function handleNext() {
    setCurrentStep((step) => Math.min(step + 1, 6));
  }

  function handleBack() {
    setCurrentStep((step) => Math.max(step - 1, 1));
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <ReceivingStepper currentStep={currentStep} />

      <div className="mt-8">
        {currentStep === 1 && <ReceivingInfoStep onNext={handleNext} />}

        {currentStep === 2 && (
          <ProductStep onBack={handleBack} onNext={handleNext} />
        )}
        {currentStep === 3 && (
          <InspectionStep onBack={handleBack} onNext={handleNext} />
        )}
        {currentStep === 4 && (
          <RfidStep onBack={handleBack} onNext={handleNext} />
        )}
        {currentStep === 5 && (
          <ItemInformationStep onBack={handleBack} onNext={handleNext} />
        )}
        {currentStep === 6 && (
          <ReviewStep onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
