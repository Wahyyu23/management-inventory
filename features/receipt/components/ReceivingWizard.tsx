"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { supabase } from "@/lib/storage/supabase";
import { useAuth } from "@/contexts/authContext";

import { ReceivingStepper } from "./ReceivingStepper";
import { ReceivingInfoStep } from "./steps/ReceivingInfoStep";
import { ProductStep } from "./steps/ProductStep";
import { InspectionStep } from "./steps/InspectionStep";
import { RfidStep } from "./steps/RfidStep";
import { ItemInformationStep } from "./steps/ItemInformationStep";
import { ReviewStep } from "./steps/ReviewStep";

import {
  receivingFormSchema,
  type ReceivingFormValues,
} from "../schema/receiving.schema";

import { createReceiving } from "../services/receiving.services";

import type { ReceivingInput } from "../types/receiving.types";

export function ReceivingWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  const [proofPhoto, setProofPhoto] = useState<File | null>(null);

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [uploadPhotoError, setUploadPhotoError] = useState<string | null>(null);

  const [isSavingReceiving, setIsSavingReceiving] = useState(false);

  const [saveReceivingError, setSaveReceivingError] = useState<string | null>(
    null,
  );

  const [savedTransactionId, setSavedTransactionId] = useState<string | null>(
    null,
  );

  const { user } = useAuth();

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
        .from("management-inventory-photo")
        .upload(filename, file);

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from("management-inventory-photo")
        .getPublicUrl(filename);

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

  async function handleSaveReceiving(values: ReceivingFormValues) {
    setSaveReceivingError(null);
    setSavedTransactionId(null);
    if (!user) {
      setSaveReceivingError("Authenticated user is not available.");

      return;
    }

    const input: ReceivingInput = {
      warehouse_id: values.warehouse_id,
      location_id: values.location_id,
      user_id: user.id,
      purchase_reference_number: values.purchase_reference_number,
      proof_photo_url: values.proof_photo_url,
      tag_code: values.tag_code,
      master_product_id: values.master_product_id,
      qty: values.qty,
      condition: values.condition,
      description: values.description,
      child_unit_qty: values.child_unit_qty,
    };

    setIsSavingReceiving(true);

    try {
      const response = await createReceiving(input);

      setSavedTransactionId(response.data.id);
    } catch (error) {
      setSaveReceivingError(
        error instanceof Error
          ? error.message
          : "Failed to save receiving transaction.",
      );
    } finally {
      setIsSavingReceiving(false);
    }
  }

  function handleSave() {
    void form.handleSubmit(handleSaveReceiving)();
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
            <ItemInformationStep onBack={handleBack} onNext={handleNext} />
          )}
          {currentStep === 5 && (
            <RfidStep onBack={handleBack} onNext={handleNext} />
          )}

          {currentStep === 6 && (
            <ReviewStep
              onBack={handleBack}
              onSave={handleSave}
              isSaving={isSavingReceiving}
              saveError={saveReceivingError}
              savedTransactionId={savedTransactionId}
            />
          )}
        </div>
      </div>
    </FormProvider>
  );
}
