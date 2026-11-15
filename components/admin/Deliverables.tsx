"use client";

import { useState, useTransition } from "react";
import { createDeliverable, deleteDeliverable, moveDeliverable, setDeliverableStatus, updateDeliverable } from "@/app/admin/actions";
import { DELIVERABLE_STATUS_LABEL } from "@/lib/admin/labels";
import { fmtDay, todayNY } from "@/lib/admin/format";
import { DELIVERABLE_STATUSES, type Deliverable } from "@/lib/admin/types";
import { ActionError, ConfirmButton } from "./controls";
import { Empty, Progress } from "./ui";

function DeliverableFields({ d, idPrefix }: { d?: Deliverable; idPrefix: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="adm-label" htmlFor={`${idPrefix}-title`}>
          Title *
        </label>
        <input id={`${idPrefix}-title`} name="title" required maxLength={300} defaultValue={d?.title ?? ""} className="adm-input" />
      </div>
      <div>
        <label className="adm-label" htmlFor={`${idPrefix}-status`}>
          Status
        </label>
        <select id={`${idPrefix}-status`} name="status" defaultValue={d?.status ?? "todo"} className="adm-input">
          {DELIVERABLE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {DELIVERABLE_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="adm-label" htmlFor={`${idPrefix}-due`}>
          Due date
        </label>
        <input id={`${idPrefix}-due`} name="due_date" type="date" defaultValue={d?.due_date ?? ""} className="adm-input" />
      </div>
      <div className="sm:col-span-2">
        <label className="adm-label" htmlFor={`${idPrefix}-url`}>
          Link URL
        </label>
        <input id={`${idPrefix}-url`} name="url" type="url" maxLength={1000} defaultValue={d?.url ?? ""} className="adm-input" placeholder="https://" />
      </div>
      <div className="sm:col-span-2">
        <label className="adm-label" htmlFor={`${idPrefix}-desc`}>
          Description
        </label>
        <textarea id={`${idPrefix}-desc`} name="description" rows={2} defaultValue={d?.description ?? ""} className="adm-input" />
      </div>
    </div>
  );
}

function Row({ d, first, last }: { d: Deliverable; first: boolean; last: boolean }) {
  const [editing, setEditing] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, after?: () => void) =>
    start(async () => {
      setErr(null);
      const r = await fn();
      if (!r.ok) setErr(r.error ?? "Something went wrong.");
      else after?.();
    });
  const isDone = d.status === "done";
  const overdue = !isDone && d.due_date && d.due_date < todayNY();

  if (editing) {
    return (
      <li className="rounded-xl border border-teal-ink/30 bg-white p-3 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            run(() => updateDeliverable(d.id, fd), () => setEditing(false));
          }}
          className="space-y-3"
        >
          <DeliverableFields d={d} idPrefix={`d-${d.id}`} />
          <ActionError error={err} />
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="adm-btn" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </button>
            <button type="button" className="adm-btn-ghost" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <span className="ml-auto">
              <ConfirmButton
                label="Delete"
                title="Delete this deliverable?"
                message={`"${d.title}" will be removed from the checklist.`}
                onConfirm={() => deleteDeliverable(d.id)}
              />
            </span>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`flex flex-wrap items-start gap-3 rounded-xl border border-ink/[0.07] bg-white/70 p-3 sm:flex-nowrap sm:items-center ${pending ? "opacity-60" : ""}`}>
      <input
        type="checkbox"
        aria-label={isDone ? `Mark "${d.title}" not done` : `Mark "${d.title}" done`}
        checked={isDone}
        disabled={pending}
        onChange={() => run(() => setDeliverableStatus(d.id, isDone ? "todo" : "done"))}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#0f766e] sm:mt-0"
      />
      <div className="min-w-0 w-[calc(100%-2.75rem)] sm:w-auto sm:flex-1">
        <p className={`text-sm font-semibold ${isDone ? "text-ink/45 line-through" : ""}`}>{d.title}</p>
        <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-ink/55">
          {d.due_date && <span className={overdue ? "font-semibold text-mk-red" : ""}>{overdue ? "Overdue · " : "Due "}{fmtDay(d.due_date)}</span>}
          {d.url && (
            <a href={d.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-ink hover:underline">
              Link ↗
            </a>
          )}
          {d.description && <span className="truncate">{d.description}</span>}
        </p>
        <ActionError error={err} />
      </div>
      <select
        aria-label={`Status for ${d.title}`}
        value={d.status}
        disabled={pending}
        onChange={(e) => {
          const v = e.target.value;
          run(() => setDeliverableStatus(d.id, v));
        }}
        className="adm-input !w-auto !py-1 text-xs font-semibold ml-8 sm:ml-0"
      >
        {DELIVERABLE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {DELIVERABLE_STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <div className="flex shrink-0 items-center gap-1">
        <button type="button" className="adm-btn-ghost !px-2 !py-1 text-xs" aria-label="Move up" disabled={first || pending} onClick={() => run(() => moveDeliverable(d.id, "up"))}>
          ↑
        </button>
        <button type="button" className="adm-btn-ghost !px-2 !py-1 text-xs" aria-label="Move down" disabled={last || pending} onClick={() => run(() => moveDeliverable(d.id, "down"))}>
          ↓
        </button>
        <button type="button" className="adm-btn-ghost !px-3 !py-1 text-xs" onClick={() => setEditing(true)}>
          Edit
        </button>
      </div>
    </li>
  );
}

export default function Deliverables({ projectId, items }: { projectId: string; items: Deliverable[] }) {
  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const doneCount = items.filter((d) => d.status === "done").length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Progress done={doneCount} total={items.length} />
        {!adding && (
          <button type="button" className="adm-btn" onClick={() => setAdding(true)}>
            + Add deliverable
          </button>
        )}
      </div>
      {adding && (
        <form
          className="space-y-3 rounded-xl border border-teal-ink/30 bg-white p-3 sm:p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const f = e.currentTarget;
            const fd = new FormData(f);
            start(async () => {
              setErr(null);
              const r = await createDeliverable(projectId, fd);
              if (r.ok) {
                f.reset();
                setAdding(false);
              } else setErr(r.error);
            });
          }}
        >
          <DeliverableFields idPrefix="new-d" />
          <ActionError error={err} />
          <div className="flex gap-2">
            <button type="submit" className="adm-btn" disabled={pending}>
              {pending ? "Adding…" : "Add"}
            </button>
            <button type="button" className="adm-btn-ghost" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      {items.length === 0 && !adding ? (
        <Empty>No deliverables yet. Add the first one to build the checklist.</Empty>
      ) : (
        <ol className="space-y-2">
          {items.map((d, i) => (
            <Row key={`${d.id}-${d.updated_at}`} d={d} first={i === 0} last={i === items.length - 1} />
          ))}
        </ol>
      )}
    </div>
  );
}
