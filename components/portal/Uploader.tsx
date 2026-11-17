"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { UPLOAD_LIMITS, type PortalFile } from "@/lib/portal/types";

const LABEL = { logo: "Onboarding: logo", photos: "Onboarding: photo" } as const;

function safeName(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+/, "")
    .slice(-100);
  return cleaned || "file";
}

const mb = (n: number) => `${Math.round(n / 1024 / 1024)} MB`;

/**
 * Uploads straight to the private client-files bucket with the client's own session (RLS limits them to
 * clients/{their id}/onboarding/), records a client_files row, and shows 1-hour signed URLs. Never public URLs.
 */
export default function Uploader({
  slot,
  clientId,
  userEmail,
  files,
  onFiles,
  disabled,
}: {
  slot: "logo" | "photos";
  clientId: string;
  userEmail: string;
  files: PortalFile[];
  onFiles: (next: PortalFile[] | ((prev: PortalFile[]) => PortalFile[])) => void;
  disabled: boolean;
}) {
  const label = LABEL[slot];
  const mine = files.filter((f) => f.label === label);
  const limit = slot === "logo" ? UPLOAD_LIMITS.logoBytes : UPLOAD_LIMITS.photoBytes;
  const capacity = slot === "logo" ? 1 - mine.length : UPLOAD_LIMITS.maxPhotos - mine.length;
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [over, setOver] = useState(false);

  async function uploadOne(file: File): Promise<string | null> {
    const type = file.type || "application/octet-stream";
    if (slot === "photos" && !type.startsWith("image/")) return `${file.name}: photos must be images.`;
    if (slot === "logo" && !(type.startsWith("image/") || type === "application/pdf")) return `${file.name}: use an image or PDF.`;
    if (file.size > limit) return `${file.name}: over ${mb(limit)}.`;
    const supabase = createClient();
    const path = `clients/${clientId}/onboarding/${slot}/${crypto.randomUUID()}-${safeName(file.name)}`;
    const up = await supabase.storage.from("client-files").upload(path, file, { contentType: type, upsert: false });
    if (up.error) return `${file.name}: upload failed. Please try again.`;
    const ins = await supabase
      .from("client_files")
      .insert({ client_id: clientId, storage_path: path, label, mime_type: type, size_bytes: file.size, uploaded_by: userEmail.toLowerCase() });
    const back = ins.error
      ? null
      : await supabase
          .from("client_files")
          .select("id, storage_path, label, mime_type, size_bytes, created_at")
          .eq("storage_path", path);
    const row = (back?.data as Omit<PortalFile, "url">[] | null | undefined)?.[0];
    if (!row) {
      await supabase.storage.from("client-files").remove([path]);
      return `${file.name}: couldn't be saved. Please try again.`;
    }
    const signed = await supabase.storage.from("client-files").createSignedUrl(path, 3600);
    onFiles((prev) => [...prev, { ...row, url: signed.data?.signedUrl ?? null }]);
    return null;
  }

  async function addFiles(list: FileList | File[]) {
    const picked = Array.from(list);
    setErrors([]);
    if (!picked.length) return;
    const allowed = picked.slice(0, Math.max(0, capacity));
    const problems: string[] = [];
    if (picked.length > allowed.length) problems.push(slot === "logo" ? "Remove the current logo to upload a new one." : `Up to ${UPLOAD_LIMITS.maxPhotos} photos.`);
    setBusy((b) => b + allowed.length);
    // A few at a time, so a big batch doesn't swamp a phone connection.
    const queue = [...allowed];
    const worker = async () => {
      for (let f = queue.shift(); f; f = queue.shift()) {
        const problem = await uploadOne(f);
        if (problem) problems.push(problem);
        setBusy((b) => b - 1);
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    setErrors(problems);
    if (input.current) input.current.value = "";
  }

  async function remove(f: PortalFile) {
    setErrors([]);
    const supabase = createClient();
    const { error } = await supabase.storage.from("client-files").remove([f.storage_path]);
    if (error) return setErrors(["Couldn't remove that file. Please try again."]);
    const { error: rowErr } = await supabase.from("client_files").delete().eq("id", f.id);
    if (rowErr) return setErrors(["Couldn't remove that file. Please try again."]);
    onFiles((prev) => prev.filter((p) => p.id !== f.id));
  }

  return (
    <div>
      {!disabled && capacity > 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            void addFiles(e.dataTransfer.files);
          }}
          className={`rounded-xl border-2 border-dashed p-5 text-center ${over ? "border-teal-ink bg-note-teal/50" : "border-ink/20 bg-white/60"}`}
        >
          <p className="text-sm text-ink/75">{slot === "logo" ? "Drag your logo here, or" : "Drag photos here, or"}</p>
          <button type="button" className="adm-btn mt-2" onClick={() => input.current?.click()}>
            {slot === "logo" ? "Choose a logo" : "Choose photos"}
          </button>
          <input
            ref={input}
            type="file"
            className="sr-only"
            tabIndex={-1}
            aria-label={slot === "logo" ? "Choose a logo file" : "Choose photo files"}
            multiple={slot === "photos"}
            accept={slot === "logo" ? "image/*,application/pdf" : "image/*"}
            onChange={(e) => e.target.files && void addFiles(e.target.files)}
          />
          {slot === "photos" && <p className="mt-2 text-xs text-ink/50">{mine.length} of {UPLOAD_LIMITS.maxPhotos} uploaded</p>}
        </div>
      )}
      {busy > 0 && (
        <p role="status" className="mt-2 text-sm text-ink/70">
          Uploading {busy} file{busy === 1 ? "" : "s"}…
        </p>
      )}
      {errors.length > 0 && (
        <ul role="alert" className="mt-2 space-y-1 text-sm font-medium text-mk-red">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      {mine.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {mine.map((f) => (
            <li key={f.id} className="overflow-hidden rounded-xl border border-ink/12 bg-white">
              {f.url && f.mime_type?.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.url} alt="" className="aspect-square w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-ink/5 text-xs font-semibold text-ink/60">PDF</div>
              )}
              <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                <span className="truncate text-xs text-ink/60">{f.storage_path.split("/").pop()?.replace(/^[0-9a-f-]{36}-/, "")}</span>
                {!disabled && (
                  <button type="button" className="shrink-0 text-xs font-semibold text-mk-red hover:underline" onClick={() => void remove(f)}>
                    Remove
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
