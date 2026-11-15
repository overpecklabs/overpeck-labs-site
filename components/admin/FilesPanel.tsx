"use client";

import { useRef, useState, useTransition } from "react";
import { deleteClientFile, recordClientFile } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/browser";
import { ConfirmButton, ActionError } from "./controls";
import { Empty } from "./ui";

const MAX = 50 * 1024 * 1024;

export type FileItem = {
  id: string;
  label: string;
  meta: string; // pre-formatted size · date · uploader
  projectName: string | null;
  viewUrl: string | null;
  downloadUrl: string | null;
};

function safeName(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+/, "")
    .slice(-120);
  return cleaned || "file";
}

/** Upload straight to the private client-files bucket with the admin's own session, then record the row. */
export default function FilesPanel({
  clientId,
  projects,
  defaultProjectId,
  files,
}: {
  clientId: string;
  projects: { id: string; name: string }[];
  defaultProjectId?: string;
  files: FileItem[];
}) {
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pending, start] = useTransition();
  const input = useRef<HTMLInputElement>(null);
  const [projectId, setProjectId] = useState(defaultProjectId ?? "");
  const [label, setLabel] = useState("");

  async function upload() {
    const file = input.current?.files?.[0];
    setErr(null);
    if (!file) return setErr("Choose a file first.");
    if (file.size > MAX) return setErr("Files must be 50 MB or smaller.");
    setBusy(true);
    const path = `clients/${clientId}/${projectId || "general"}/${crypto.randomUUID()}-${safeName(file.name)}`;
    const { error } = await createClient()
      .storage.from("client-files")
      .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
    if (error) {
      setBusy(false);
      const denied = /row-level security|unauthorized|403|401/i.test(error.message);
      return setErr(denied ? "Not authorized to upload files." : "Upload failed. Please try again.");
    }
    start(async () => {
      const r = await recordClientFile({
        client_id: clientId,
        project_id: projectId,
        storage_path: path,
        label: label.trim() || file.name,
        mime_type: file.type || "application/octet-stream",
        size_bytes: file.size,
      });
      setBusy(false);
      if (!r.ok) setErr(r.error);
      else {
        setLabel("");
        if (input.current) input.current.value = "";
      }
    });
  }

  const working = busy || pending;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-ink/20 bg-white/60 p-3 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-end">
          <div>
            <label className="adm-label" htmlFor="f-file">
              File (max 50 MB)
            </label>
            <input id="f-file" ref={input} type="file" className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white" />
          </div>
          <div>
            <label className="adm-label" htmlFor="f-label">
              Label
            </label>
            <input id="f-label" value={label} onChange={(e) => setLabel(e.target.value)} maxLength={300} className="adm-input" placeholder="Optional" />
          </div>
          <div>
            <label className="adm-label" htmlFor="f-project">
              Project
            </label>
            <select id="f-project" value={projectId} onChange={(e) => setProjectId(e.target.value)} className="adm-input">
              <option value="">General</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="adm-btn" onClick={upload} disabled={working}>
            {working ? "Uploading…" : "Upload"}
          </button>
        </div>
        <div className="mt-2">
          <ActionError error={err} />
        </div>
      </div>

      {files.length === 0 ? (
        <Empty>No files yet.</Empty>
      ) : (
        <ul className="divide-y divide-ink/[0.07] rounded-xl border border-ink/[0.07] bg-white/70">
          {files.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center gap-3 px-3 py-2.5 sm:px-4">
              <div className="min-w-0 basis-full sm:basis-0 sm:flex-1">
                <p className="truncate text-sm font-semibold">{f.label}</p>
                <p className="text-xs text-ink/55">
                  {f.projectName ? `${f.projectName} · ` : ""}
                  {f.meta}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {f.viewUrl && (
                  <a href={f.viewUrl} target="_blank" rel="noopener noreferrer" className="adm-btn-ghost !px-3 !py-1 text-xs">
                    Open
                  </a>
                )}
                {f.downloadUrl && (
                  <a href={f.downloadUrl} className="adm-btn-ghost !px-3 !py-1 text-xs">
                    Download
                  </a>
                )}
                <ConfirmButton
                  label="Delete"
                  className="adm-btn-ghost !px-3 !py-1 text-xs !text-mk-red"
                  title="Delete this file?"
                  message={`"${f.label}" will be removed from storage. This can't be undone.`}
                  onConfirm={() => deleteClientFile(f.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
