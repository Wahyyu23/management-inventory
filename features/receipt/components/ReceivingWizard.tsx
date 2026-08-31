"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/storage/supabase";
import { ReceivingStepper } from "./ReceivingStepper";
import { ReceivingInfoStep } from "./steps/ReceivingInfoStep";
import { ProductStep } from "./steps/ProductStep";
import { InspectionStep } from "./steps/InspectionStep";
import { RfidStep } from "./steps/RfidStep";
import { ItemInformationStep } from "./steps/ItemInformationStep";
import { ReviewStep } from "./steps/ReviewStep";
import {
  receivingFormSchema,
  ReceivingFormValues,
} from "../schema/receiving.schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function ReceivingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [proofPhoto, setProofPhoto] = useState<File | null>(null);
  //const [urlPhoto, setUrlPhoto] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadPhotoError, setUploadPhotoError] = useState<string | null>(null);
  const form = useForm<ReceivingFormValues>({
    resolver: zodResolver(receivingFormSchema),

    defaultValues: {
      purchase_reference_number: "",
      warehouse_id: "",
      location_id: "",
      master_product_id: "",
      description: "",
      proof_photo_url: "",
    },

    shouldUnregister: false,

    mode: "onTouched",
  });

  const urlPhoto = form.watch("proof_photo_url");

  function handleNext() {
    setCurrentStep((step) => Math.min(step + 1, 6));
  }

  function handleBack() {
    setCurrentStep((step) => Math.max(step - 1, 1));
  }

  async function handlePhotoChange(file: File | null) {
    setProofPhoto(file);
    setUploadPhotoError(null);

    form.setValue("proof_photo_url", "", {
      shouldDirty: true,
      shouldValidate: false,
    });

    if (!file) {
      setIsUploadingPhoto(false);
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const filename = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("photos")
        .upload(filename, file);

      if (error) {
        throw error;
      }

      const { data } = supabase.storage.from("photos").getPublicUrl(filename);

      form.setValue("proof_photo_url", data.publicUrl, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (err) {
      console.error("Upload failed:", err);

      setUploadPhotoError(err instanceof Error ? err.message : "Upload Failed");

      form.setValue("proof_photo_url", "", {
        shouldDirty: true,
        shouldValidate: false,
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  return (
    <FormProvider {...form}>
      <div className="rounded-xl border border-border bg-card p-6">
        <ReceivingStepper currentStep={currentStep} />

        <div className="mt-8">
          {currentStep === 1 && <ReceivingInfoStep onNext={handleNext} />}

          {currentStep === 2 && (
            <ProductStep onBack={handleBack} onNext={handleNext} />
          )}
          {currentStep === 3 && (
            <InspectionStep
              onBack={handleBack}
              onNext={handleNext}
              proofPhoto={proofPhoto}
              onProofPhotoChange={handlePhotoChange}
              urlPhoto={urlPhoto}
              isUploadingPhoto={isUploadingPhoto}
              uploadPhotoError={uploadPhotoError}
            />
          )}
          {currentStep === 4 && (
            <RfidStep onBack={handleBack} onNext={handleNext} />
          )}
          {currentStep === 5 && (
            <ItemInformationStep onBack={handleBack} onNext={handleNext} />
          )}
          {currentStep === 6 && <ReviewStep onBack={handleBack} />}
        </div>
      </div>
    </FormProvider>
  );
}
