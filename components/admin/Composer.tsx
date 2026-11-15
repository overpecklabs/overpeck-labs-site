"use client";

import { useRef, useState, useTransition } from "react";
import { logCommunication } from "@/app/admin/actions";
import type { Channel } from "@/lib/admin/types";
import { ActionError } from "./controls";

const MODES: { channel: Channel; label: string; summary: string }[] = [
  { channel: "note", label: "Add note", summary: "Note" },
  { channel: "sms", label: "Log text", summary: "Text" },
  { channel: "email", label: "Log email", summary: "Email" },
  { channel: "meeting", label: "Log meeting", summary: "Meeting" },
  { channel: "call", label: "Log call", summary: "Call" },
];

/** Quick-log composer for notes, texts, emails, meetings and manual calls. */
export default function Composer({
  clientId,
  projects,
  defaultProjectId,
  now,
}: {
  clientId: string;
  projects: { id: string; name: string }[];
  defaultProjectId?: string;
  /** Current New York wall time for the datetime-local default (computed on the server). */
  now: string;
}) {
  const [mode, setMode] = useState<Channel>("note");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();
  const form = useRef<HTMLFormElement>(null);
  const current = MODES.find((m) => m.channel === mode)!;

  return (
    <div>
      <div role="tablist" aria-label="Entry type" className="mb-4 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.channel}
            type="button"
            role="tab"
            aria-selected={mode === m.channel}
            aria-pressed={mode === m.channel}
            className="adm-chip"
            onClick={() => {
              setMode(m.channel);
              setOk(false);
              setErr(null);
            }}
          >
            {m.label}
          </button>
        ))}
      </div>
      <form
        ref={form}
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          setErr(null);
          setOk(false);
          start(async () => {
            const r = await logCommunication(fd);
            if (r.ok) {
              setOk(true);
              const f = form.current;
              if (f) {
                (f.elements.namedItem("summary") as HTMLInputElement).value = "";
                (f.elements.namedItem("body") as HTMLTextAreaElement).value = "";
              }
            } else setErr(r.error);
          });
        }}
      >
        <input type="hidden" name="client_id" value={clientId} />
        <input type="hidden" name="channel" value={mode} />
        <div className="grid gap-3 sm:grid-cols-3">
          {mode !== "note" ? (
            <div>
              <label className="adm-label" htmlFor="c-direction">
                Direction
              </label>
              <select id="c-direction" name="direction" defaultValue="out" className="adm-input">
                <option value="out">Outgoing</option>
                <option value="in">Incoming</option>
              </select>
            </div>
          ) : (
            <input type="hidden" name="direction" value="" />
          )}
          <div>
            <label className="adm-label" htmlFor="c-project">
              Project (optional)
            </label>
            <select id="c-project" name="project_id" defaultValue={defaultProjectId ?? ""} className="adm-input">
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="adm-label" htmlFor="c-when">
              When (New York time)
            </label>
            <input id="c-when" name="occurred_at" type="datetime-local" defaultValue={now} className="adm-input" />
          </div>
        </div>
        <div>
          <label className="adm-label" htmlFor="c-summary">
            Summary
          </label>
          <input id="c-summary" name="summary" maxLength={500} className="adm-input" placeholder={`${current.summary} summary`} />
        </div>
        <div>
          <label className="adm-label" htmlFor="c-body">
            Details
          </label>
          <textarea id="c-body" name="body" rows={3} className="adm-input" />
        </div>
        <ActionError error={err} />
        <div className="flex items-center gap-3">
          <button type="submit" className="adm-btn" disabled={pending}>
            {pending ? "Saving…" : current.label}
          </button>
          {ok && (
            <span role="status" className="text-sm font-semibold text-teal-ink">
              Logged
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
