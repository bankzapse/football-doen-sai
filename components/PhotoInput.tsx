"use client";

import { useRef, useState } from "react";

/** ย่อรูปในเบราว์เซอร์ก่อนอัปโหลด (กันไฟล์ใหญ่เกินลิมิต + ประหยัดพื้นที่) */
async function resizeImage(file: File, maxDim = 1280, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  let { width, height } = bitmap;
  if (width > maxDim || height > maxDim) {
    const scale = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}

export default function PhotoInput({ name = "photo_file" }: { name?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    setBusy(true);
    try {
      const resized = await resizeImage(file);
      const dt = new DataTransfer();
      dt.items.add(resized);
      if (ref.current) ref.current.files = dt.files;
      setPreview(URL.createObjectURL(resized));
    } catch {
      setPreview(URL.createObjectURL(file));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input ref={ref} type="file" name={name} accept="image/*" onChange={onChange} />
      {busy ? <span className="hint">กำลังย่อรูป…</span> : null}
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="ตัวอย่างรูป"
          style={{ marginTop: 8, maxHeight: 100, width: "auto", borderRadius: 8, display: "block" }}
        />
      ) : null}
    </div>
  );
}
