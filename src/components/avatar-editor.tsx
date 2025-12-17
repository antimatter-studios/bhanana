"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-(--text-secondary)" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5.5 19.5c.8-3.1 3.2-5 6.5-5s5.7 1.9 6.5 5" strokeLinecap="round" />
  </svg>
);

type Props = {
  userId: string;
  value?: string | null;
  onChange?: (url: string | null) => void;
  label?: string;
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

  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create blob"));
    }, "image/jpeg", 0.9);
  });
}

async function getCroppedDataUrl(imageSrc: string, crop: CropArea) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
  return canvas.toDataURL("image/jpeg", 0.9);
}

export function AvatarEditor({ userId, value, onChange, label = "Avatar" }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.2);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedArea, setCroppedArea] = useState<CropArea | null>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null); // saved URL
  const [livePreview, setLivePreview] = useState<string | null>(value ?? null); // current crop preview
  const [status, setStatus] = useState<"idle" | "uploading" | "error" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Lock body scroll while overlay is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

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

  // Update live preview when crop or image changes
  useEffect(() => {
    let cancelled = false;
    const updatePreview = async () => {
      if (imageSrc && croppedArea) {
        try {
          const url = await getCroppedDataUrl(imageSrc, croppedArea);
          if (!cancelled) setLivePreview(url);
        } catch {
          // ignore
        }
      }
    };
    updatePreview();
    return () => {
      cancelled = true;
    };
  }, [imageSrc, croppedArea]);

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setPreview(null);
      setLivePreview(null);
      setStatus("idle");
      setError(null);
      setOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
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
      setLivePreview(data.url);
      setStatus("saved");
      setOpen(false);
      onChange?.(data.url);
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }, [croppedArea, imageSrc, onChange, userId]);

  const removeAvatar = useCallback(async () => {
    try {
      setStatus("uploading");
      setError(null);
      const form = new FormData();
      form.append("userId", userId);
      if (preview) form.append("avatarUrl", preview);
      const res = await fetch("/api/admin/avatar", { method: "DELETE", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed");
      }
      setPreview(null);
      setLivePreview(null);
      setImageSrc(null);
      setOpen(false);
      setStatus("saved");
      onChange?.(null);
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }, [onChange, preview, userId]);

  const hint = useMemo(() => {
    if (status === "uploading") return "Saving…";
    if (status === "saved") return "Saved.";
    if (error) return error;
    return "Upload a square image and adjust the crop.";
  }, [status, error]);

  return (
    <div className="space-y-3 rounded-2xl border border-(--border) bg-(--surface) p-4 shadow-sm ring-1 ring-(--border)">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
          <button
            type="button"
            onClick={triggerFileSelect}
            className="group rounded-full transition hover:-translate-y-0.5"
            aria-label="Change avatar"
          >
            <Avatar className="h-16 w-16 border border-(--border) transition group-hover:ring-2 group-hover:ring-(--accent)">
              {livePreview ? (
                <AvatarImage src={livePreview} alt={`${label} preview`} />
              ) : (
                <AvatarFallback>
                  <PersonIcon />
                </AvatarFallback>
              )}
            </Avatar>
          </button>
          {preview || livePreview ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeAvatar();
              }}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-(--border) bg-(--surface) text-(--text-secondary) shadow-sm transition hover:-translate-y-0.5 hover:bg-(--surface-soft)"
              aria-label="Remove avatar"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l8 8m0-8L4 12" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-(--text-secondary)">{hint}</p>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="relative flex h-[80vh] w-full max-w-5xl flex-col gap-4 overflow-hidden rounded-2xl border border-(--border) bg-(--surface) p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-foreground">Adjust avatar</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-(--border) px-3 py-1.5 text-xs font-semibold text-(--text-secondary) hover:bg-(--surface-soft)"
              >
                Close
              </button>
            </div>
            <div className="grid flex-1 gap-4 md:grid-cols-[1fr_260px]">
              <div className="relative overflow-hidden rounded-xl border border-(--border) bg-(--surface-soft)">
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
                  <div className="flex h-full items-center justify-center text-(--text-secondary)">Select an image to start</div>
                )}
              </div>
              <div className="flex flex-col gap-4">
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
                      {livePreview ? (
                        <AvatarImage src={livePreview} alt="Avatar preview" />
                      ) : (
                        <AvatarFallback>
                          <PersonIcon />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <button
                      type="button"
                      onClick={uploadCropped}
                      disabled={!imageSrc || status === "uploading"}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full bg-(--accent) px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-(--accent-strong)",
                        (!imageSrc || status === "uploading") && "opacity-60",
                      )}
                    >
                      {status === "uploading" ? "Saving…" : "Save avatar"}
                    </button>
                  </div>
                </div>
                <div className="mt-auto text-xs text-(--text-secondary)">
                  Drag the image to position. Zoom for a tighter crop. Save to update.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
