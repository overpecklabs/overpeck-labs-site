"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { createProjectAction, updateProjectAction } from "@/app/admin/actions";
import { PROJECT_STATUS_LABEL, PROJECT_TYPE_LABEL } from "@/lib/admin/labels";
import { PROJECT_STATUSES, PROJECT_TYPES, type Project } from "@/lib/admin/types";
import { ActionError } from "./controls";

type ClientOption = { id: string; business_name: string };

export default function ProjectForm({
  project,
  clients,
  defaultClientId,
  onDone,
}: {
  project?: Project;
  clients: ClientOption[];
  defaultClientId?: string;
  onDone?: () => void;
}) {
  const [state, action, pending] = useActionState(project ? updateProjectAction : createProjectAction, null);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (state?.ok) {
      setSaved(true);
      onDone?.();
      const t = setTimeout(() => setSaved(false), 2500);
      return () => clearTimeout(t);
    }
  }, [state, onDone]);
  const v = (k: keyof Project) => {
    const x = project?.[k];
    return x === null || x === undefined ? "" : String(x);
  };

  return (
    <form action={action} className="space-y-5">
      {project && <input type="hidden" name="id" value={project.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="adm-label" htmlFor="p-name">
            Project name *
          </label>
          <input id="p-name" name="name" required maxLength={200} defaultValue={v("name")} className="adm-input" placeholder="e.g. New website" />
        </div>
        <div className="sm:col-span-2">
          <label className="adm-label" htmlFor="p-client">
            Client *
          </label>
          <select id="p-client" name="client_id" required defaultValue={project?.client_id ?? defaultClientId ?? ""} className="adm-input">
            <option value="" disabled>
              Pick a client…
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.business_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="adm-label" htmlFor="p-type">
            Type
          </label>
          <select id="p-type" name="type" defaultValue={project?.type ?? "website"} className="adm-input">
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {PROJECT_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="adm-label" htmlFor="p-status">
            Status
          </label>
          <select id="p-status" name="status" defaultValue={project?.status ?? "discovery"} className="adm-input">
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PROJECT_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="adm-label" htmlFor="p-start">
            Start date
          </label>
          <input id="p-start" name="start_date" type="date" defaultValue={v("start_date")} className="adm-input" />
        </div>
        <div>
          <label className="adm-label" htmlFor="p-due">
            Due date
          </label>
          <input id="p-due" name="due_date" type="date" defaultValue={v("due_date")} className="adm-input" />
        </div>
        <div>
          <label className="adm-label" htmlFor="p-launch">
            Launch date
          </label>
          <input id="p-launch" name="launch_date" type="date" defaultValue={v("launch_date")} className="adm-input" />
        </div>
        <div>
          <label className="adm-label" htmlFor="p-price">
            Price (USD)
          </label>
          <input id="p-price" name="price" inputMode="decimal" defaultValue={v("price")} className="adm-input" placeholder="1500" />
        </div>
        <div className="sm:col-span-2">
          <label className="adm-label" htmlFor="p-notes">
            Notes
          </label>
          <textarea id="p-notes" name="notes" rows={4} defaultValue={v("notes")} className="adm-input" />
        </div>
      </div>
      <ActionError error={state && !state.ok ? state.error : null} />
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" className="adm-btn" disabled={pending}>
          {pending ? "Saving…" : project ? "Save project" : "Create project"}
        </button>
        {!project && (
          <Link href={defaultClientId ? `/admin/clients/${defaultClientId}` : "/admin/projects"} className="adm-btn-ghost">
            Cancel
          </Link>
        )}
        {saved && (
          <span role="status" className="text-sm font-semibold text-teal-ink">
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
