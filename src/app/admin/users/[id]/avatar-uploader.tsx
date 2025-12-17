"use client";

import { useCallback, useMemo, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  userId: string;
  initialAvatar?: string | null;
};

type CropArea = { x: number; y: number; width: number; height: number };

async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function getCroppedBlob(imageSrc: string, crop: CropArea) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create blob"));
    }, "image/jpeg", 0.9);
  });
}

export function AvatarUploader({ userId, initialAvatar }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.2);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedArea, setCroppedArea] = useState<CropArea | null>(null);
  const [preview, setPreview] = useState<string | null>(initialAvatar ?? null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback(
    (_area: Area, cropped: Area) => {
      setCroppedArea({
        x: cropped.x,
        y: cropped.y,
        width: cropped.width,
        height: cropped.height,
      });
    },
    [],
  );

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setPreview(null);
      setStatus("idle");
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const uploadCropped = useCallback(async () => {
    if (!imageSrc || !croppedArea) return;
    try {
      setStatus("uploading");
      setError(null);
      const blob = await getCroppedBlob(imageSrc, croppedArea);
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      const form = new FormData();
      form.append("file", file);
      form.append("userId", userId);
      const res = await fetch("/api/admin/avatar", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }
      const data = (await res.json()) as { url: string };
      setPreview(data.url);
      setStatus("saved");
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }, [croppedArea, imageSrc, userId]);

  const hint = useMemo(() => {
    if (status === "uploading") return "Uploading avatar…";
    if (status === "saved") return "Avatar saved.";
    if (error) return error;
    return "Upload a square image and adjust the crop.";
  }, [status, error]);

  return (
    <div className="space-y-4 rounded-2xl border border-(--border) bg-(--surface) p-4 shadow-sm ring-1 ring-(--border)">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Avatar</p>
          <p className="text-xs text-(--text-secondary)">{hint}</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-(--border) px-3 py-1.5 text-xs font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-(--surface-soft)">
          Upload
          <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-(--border) bg-(--surface-soft)">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-(--text-secondary)">
              Select an image to start
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-(--text-secondary)">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-(--text-secondary)">Preview</p>
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16 border border-(--border)">
                {preview ? (
                  <AvatarImage src={preview} alt="Avatar preview" />
                ) : (
                  <AvatarFallback>None</AvatarFallback>
                )}
              </Avatar>
              <button
                type="button"
                onClick={uploadCropped}
                disabled={!imageSrc || status === "uploading"}
                className="inline-flex items-center gap-2 rounded-full bg-(--accent) px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-(--accent-strong) disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "uploading" ? "Saving…" : "Save avatar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
