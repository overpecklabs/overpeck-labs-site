"use client";

import { useRef, useState, useTransition } from "react";
import type { ActionResult } from "@/lib/admin/types";

/** Inline error text for an action result. */
export function ActionError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p role="alert" className="text-sm font-medium text-mk-red">
      {error}
    </p>
  );
}

/** A select that saves as soon as it changes. */
export function AutoSaveSelect({
  value,
  options,
  onSave,
  label,
  className = "adm-input !w-auto !py-1.5 text-sm font-semibold",
}: {
  value: string;
  options: { value: string; label: string }[];
  onSave: (v: string) => Promise<ActionResult>;
  label: string;
  className?: string;
}) {
  const [current, setCurrent] = useState(value);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <span className="inline-flex flex-col gap-1">
      <span className="inline-flex items-center gap-2">
        <select
          aria-label={label}
          className={className}
          value={current}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value;
            const prev = current;
            setCurrent(next);
            setErr(null);
            start(async () => {
              const r = await onSave(next);
              if (!r.ok) {
                setCurrent(prev);
                setErr(r.error);
              }
            });
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {pending && <span className="text-xs text-ink/50">Saving…</span>}
      </span>
      <ActionError error={err} />
    </span>
  );
}

/**
 * A button that asks for confirmation in a dialog before running a destructive action.
 * `alternative` adds a safer option (e.g. "Mark as past instead").
 */
export function ConfirmButton({
  label,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  alternative,
  className = "adm-btn-ghost !text-mk-red",
}: {
  label: React.ReactNode;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => Promise<ActionResult>;
  alternative?: { label: string; run: () => Promise<ActionResult> };
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      setErr(null);
      // A redirect() inside the action navigates away on its own.
      const r = await fn();
      if (r.ok) ref.current?.close();
      else setErr(r.error);
    });
  return (
    <>
      <button type="button" className={className} onClick={() => ref.current?.showModal()}>
        {label}
      </button>
      <dialog ref={ref} className="adm-dialog" onClose={() => setErr(null)}>
        <h2 className="font-display text-lg font-bold">{title}</h2>
        <div className="mt-2 text-sm text-ink/75">{message}</div>
        <div className="mt-3">
          <ActionError error={err} />
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" className="adm-btn-ghost" onClick={() => ref.current?.close()} disabled={pending}>
            Cancel
          </button>
          {alternative && (
            <button type="button" className="adm-btn" disabled={pending} onClick={() => run(alternative.run)}>
              {alternative.label}
            </button>
          )}
          <button type="button" className="adm-btn-danger" disabled={pending} onClick={() => run(onConfirm)}>
            {pending ? "Working…" : confirmLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}

/** Small button that runs one action and shows its error. */
export function ActionButton({
  children,
  run,
  className = "adm-btn-ghost",
  pendingLabel,
  title,
}: {
  children: React.ReactNode;
  run: () => Promise<ActionResult>;
  className?: string;
  pendingLabel?: string;
  title?: string;
}) {
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        title={title}
        className={className}
        disabled={pending}
        onClick={() =>
          start(async () => {
            setErr(null);
            const r = await run();
            if (!r.ok) setErr(r.error);
          })
        }
      >
        {pending && pendingLabel ? pendingLabel : children}
      </button>
      <ActionError error={err} />
    </span>
  );
}

/** Copies text to the clipboard and briefly shows "Copied!". */
export function CopyButton({ text, label = "Copy", className = "adm-btn-ghost !px-3 !py-1 text-xs" }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setFailed(false);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setFailed(true);
        }
      }}
      aria-live="polite"
    >
      {copied ? "Copied!" : failed ? "Copy failed" : label}
    </button>
  );
}
