import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png"];

function validatePhoto(file: File): string | null {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return "Only JPEG and PNG images are allowed.";
  }

  if (file.size > MAX_PHOTO_SIZE) {
    return "Image size must be less than 5MB.";
  }

  return null;
}

export function ProofPhotoField() {
  const [proofPhoto, setProofPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!previewUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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

    const objectUrl = URL.createObjectURL(file);

    setPhotoError(null);
    setProofPhoto(file);
    setPreviewUrl(objectUrl);
  }

  function handleRemovePhoto() {
    setProofPhoto(null);
    setPreviewUrl(null);
    setPhotoError(null);
    resetFileInput();
  }

  return (
    <Field className="h-full">
      <FieldLabel>Proof Photo</FieldLabel>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg, image/png"
        onChange={handlePhotoChange}
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
                {proofPhoto?.name}
              </p>

              {proofPhoto && (
                <p className="text-xs text-muted-foreground">
                  {(proofPhoto.size / 1024 / 1024).toFixed(2)} MB
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
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {photoError && <p className="text-sm text-destructive">{photoError}</p>}
    </Field>
  );
}
