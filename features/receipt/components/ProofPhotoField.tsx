"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png"];

type ProofPhotoFieldProps = {
  value: File | null;

  onChange: (file: File | null) => void;

  error?: string | null;

  isUploading: boolean;
  isUploaded: boolean;
  uploadError?: string | null;
  onRetry: () => void;
};

function validatePhoto(file: File): string | null {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return "Only JPEG and PNG images are allowed.";
  }

  if (file.size > MAX_PHOTO_SIZE) {
    return "Image size must be less than 5MB.";
  }

  return null;
}

export function ProofPhotoField({
  value,
  onChange,
  error,
  isUploading,
  isUploaded,
  uploadError,
  onRetry,
}: ProofPhotoFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [photoError, setPhotoError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      }
    };

    reader.onerror = () => {
      setPreviewUrl(null);

      setPhotoError("Failed to preview the selected image.");
    };

    reader.readAsDataURL(value);

    return () => {
      if (reader.readyState === FileReader.LOADING) {
        reader.abort();
      }
    };
  }, [value]);

  function resetFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleChoosePhoto() {
    resetFileInput();

    fileInputRef.current?.click();
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validatePhoto(file);

    if (validationError) {
      setPhotoError(validationError);

      resetFileInput();

      return;
    }

    setPhotoError(null);
    onChange(file);
  }

  function handleRemovePhoto() {
    setPhotoError(null);
    setPreviewUrl(null);

    resetFileInput();

    onChange(null);
  }

  const displayedError = photoError ?? error;

  return (
    <Field className="h-full">
      <FieldLabel>Proof Photo</FieldLabel>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handlePhotoChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-8 text-center">
          <div className="space-y-2">
            <p className="font-medium text-foreground">Upload proof photo</p>

            <p className="text-sm text-muted-foreground">
              JPG or PNG, maximum 5 MB
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            disabled={isUploading}
            onClick={handleChoosePhoto}
          >
            Choose Photo
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-border">
            <img
              src={previewUrl}
              alt="Proof photo preview"
              className="h-[180px] w-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {value?.name}
              </p>

              {value && (
                <p className="text-xs text-muted-foreground">
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleChoosePhoto}
              >
                Replace
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemovePhoto}
                disabled={isUploading}
              >
                Remove
              </Button>
            </div>
          </div>

          {isUploading && (
            <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

              <span>Uploading photo...</span>
            </div>
          )}

          {!isUploading && isUploaded && !uploadError && (
            <div className="rounded-md border border-border px-3 py-2 text-sm">
              <span className="font-medium">✓ Photo uploaded successfully</span>
            </div>
          )}


          {!isUploading &&
            uploadError && (
              <div className="space-y-3 rounded-md border border-destructive px-3 py-3">
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Failed to upload photo
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {uploadError}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={
                    onRetry
                  }
                >
                  Retry Upload
                </Button>   
              </div>
            )}
        </div>
      )}
   

      {displayedError && (
        <p className="text-sm text-destructive">{displayedError}</p>
      )}
    </Field>
  );
}
