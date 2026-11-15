"use client";

import { useState, useTransition } from "react";
import { setProjectStatus } from "@/app/admin/actions";
import { PIPELINE, PROJECT_STATUS_LABEL } from "@/lib/admin/labels";
import type { ProjectStatus } from "@/lib/admin/types";
import { ActionError } from "./controls";

/** Step control across the pipeline, plus On hold. Each change also logs a note (server side). */
export default function StatusStepper({ projectId, status }: { projectId: string; status: ProjectStatus }) {
  const [current, setCurrent] = useState<ProjectStatus>(status);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const idx = PIPELINE.indexOf(current);

  const change = (s: ProjectStatus) => {
    if (s === current || pending) return;
    const prev = current;
    setCurrent(s);
    setErr(null);
    start(async () => {
      const r = await setProjectStatus(projectId, s);
      if (!r.ok) {
        setCurrent(prev);
        setErr(r.error);
      }
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-start gap-2">
        <ol className="flex min-w-0 flex-1 flex-wrap gap-1.5" aria-label="Project status">
          {PIPELINE.map((s, i) => {
            const reached = idx >= 0 && i <= idx;
            const isCurrent = s === current;
            return (
              <li key={s}>
                <button
                  type="button"
                  aria-current={isCurrent ? "step" : undefined}
                  disabled={pending}
                  onClick={() => change(s)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    isCurrent
                      ? "border-ink bg-ink text-white"
                      : reached
                        ? "border-teal-ink/30 bg-note-teal text-ink"
                        : "border-ink/15 bg-white text-ink/65 hover:border-ink/35"
                  }`}
                >
                  <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${isCurrent ? "bg-teal text-ink" : reached ? "bg-teal-ink text-white" : "bg-ink/10"}`}>
                    {reached && !isCurrent ? "✓" : i + 1}
                  </span>
                  {PROJECT_STATUS_LABEL[s]}
                </button>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          disabled={pending}
          aria-pressed={current === "on_hold"}
          onClick={() => change("on_hold")}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold sm:text-sm ${current === "on_hold" ? "border-mk-red bg-mk-red text-white" : "border-ink/15 bg-white text-ink/70 hover:border-ink/35"}`}
        >
          On hold
        </button>
      </div>
      <div className="mt-2 min-h-5 text-xs text-ink/55">{pending ? "Saving…" : <ActionError error={err} />}</div>
    </div>
  );
}
