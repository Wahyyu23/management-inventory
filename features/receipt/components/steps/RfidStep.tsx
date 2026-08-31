"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  FiCheckCircle,
  FiRadio,
} from "react-icons/fi";

import {
  useFormContext,
  useWatch,
} from "react-hook-form";

import { Button } from "@/components/ui/button";

import type { ReceivingFormValues } from "../../schema/receiving.schema";

const RFID_PREFIX = "PSI-";

type RfidStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export function RfidStep({
  onNext,
  onBack,
}: RfidStepProps) {
  const {
    control,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } =
    useFormContext<ReceivingFormValues>();

  const tagCode = useWatch({
    control,
    name: "tag_code",
  });

  const keyboardBufferRef =
    useRef("");

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      ) {
        return;
      }

      if (event.key === "Escape") {
        keyboardBufferRef.current = "";
        return;
      }

      if (event.key === "Enter") {
        const scannedValue =
          keyboardBufferRef.current.trim();

        keyboardBufferRef.current = "";

        if (!scannedValue) {
          return;
        }

        event.preventDefault();

        if (
          !scannedValue.startsWith(
            RFID_PREFIX
          )
        ) {
          setError("tag_code", {
            type: "manual",
            message:
              "Invalid RFID tag. Expected PSI- prefix.",
          });

          return;
        }

        setValue(
          "tag_code",
          scannedValue,
          {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          }
        );

        clearErrors("tag_code");

        return;
      }

      if (event.key.length === 1) {
        keyboardBufferRef.current +=
          event.key;
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    clearErrors,
    setError,
    setValue,
  ]);

  async function handleNextStep() {
    const isValid =
      await trigger("tag_code");

    if (!isValid || !tagCode) {
      return;
    }

    onNext();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-section-title font-semibold text-foreground">
          RFID Tagging
        </h2>

        <p className="mt-1 text-small text-muted-foreground">
          Attach the RFID sticker and scan
          the tag using the RFID reader.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border p-6">
          <div>
            <h3 className="font-semibold text-foreground">
              RFID Reader
            </h3>

            <p className="mt-1 text-small text-muted-foreground">
              RFID input is captured
              automatically while this step
              is open.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              {tagCode ? (
                <FiCheckCircle className="size-7" />
              ) : (
                <FiRadio className="size-7" />
              )}
            </div>

            <h4 className="mt-4 font-medium text-foreground">
              {tagCode
                ? "RFID tag detected"
                : "Waiting for RFID tag"}
            </h4>

            <p className="mt-1 max-w-md text-small text-muted-foreground">
              {tagCode
                ? "The RFID tag has been captured. Scan another tag to replace it."
                : "Place the RFID tag near the reader. The RFID Agent will send the tag automatically."}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border p-6">
          <div>
            <h3 className="font-semibold text-foreground">
              Tag Information
            </h3>

            <p className="mt-1 text-small text-muted-foreground">
              RFID information detected by
              the reader.
            </p>
          </div>

          <div className="mt-5 rounded-lg bg-muted/40 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              TAG CODE
            </p>

            <p className="mt-1 font-mono text-sm text-foreground">
              {tagCode || "—"}
            </p>
          </div>

          {errors.tag_code && (
            <p className="mt-2 text-sm text-destructive">
              {errors.tag_code.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>

        <Button
          type="button"
          onClick={handleNextStep}

          disabled={
            !tagCode ||
            Boolean(errors.tag_code)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}