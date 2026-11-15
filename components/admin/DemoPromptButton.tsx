"use client";

import { useRef, useState } from "react";
import { generateDemoPrompt, logDemoPromptCopied } from "@/app/admin/actions";
import { ActionError } from "./controls";

/** Opens a modal with a ready-to-paste Claude Code prompt for this client's demo homepage. */
export default function DemoPromptButton({ clientId }: { clientId: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState<{ slug: string; prompt: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const logged = useRef(false);

  async function open() {
    dialog.current?.showModal();
    setErr(null);
    setCopied(false);
    setLoading(true);
    logged.current = false;
    try {
      const r = await generateDemoPrompt(clientId);
      if (r.ok) setState({ slug: r.slug, prompt: r.prompt });
      else setErr(r.error);
    } catch {
      setErr("Couldn't build the prompt. Please try again.");
    }
    setLoading(false);
  }

  async function copy() {
    if (!state) return;
    try {
      await navigator.clipboard.writeText(state.prompt);
    } catch {
      // Fallback for browsers without clipboard permission: select the text for a manual copy.
      area.current?.select();
      if (!document.execCommand("copy")) return setErr("Copy didn't work. Select the text and copy it manually.");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (!logged.current) {
      logged.current = true;
      const r = await logDemoPromptCopied(clientId);
      if (!r.ok) setErr(r.error);
    }
  }

  return (
    <>
      <button type="button" className="adm-btn-ghost" onClick={open}>
        Generate demo prompt
      </button>
      <dialog ref={dialog} className="adm-dialog !max-w-[min(48rem,calc(100vw-2rem))] w-full" aria-labelledby={`dp-title-${clientId}`}>
        <h2 id={`dp-title-${clientId}`} className="font-display text-lg font-bold">
          Demo prompt
        </h2>
        {state && (
          <p className="mt-1 text-sm text-ink/70">
            Slug: <code className="rounded bg-ink/5 px-1.5 py-0.5 font-semibold text-ink">{state.slug}</code> → /demo/{state.slug}
          </p>
        )}
        <div className="mt-3">
          {loading ? (
            <div className="adm-skeleton h-72" aria-label="Building prompt" />
          ) : state ? (
            <>
              <label htmlFor={`dp-text-${clientId}`} className="sr-only">
                Claude Code prompt
              </label>
              <textarea
                id={`dp-text-${clientId}`}
                ref={area}
                readOnly
                value={state.prompt}
                onFocus={(e) => e.currentTarget.select()}
                className="adm-input h-[min(60vh,28rem)] resize-y font-mono !text-xs leading-relaxed"
              />
            </>
          ) : null}
          <div className="mt-2">
            <ActionError error={err} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          <span className="mr-auto text-sm font-semibold text-teal-ink" aria-live="polite">
            {copied ? "Copied!" : ""}
          </span>
          <button type="button" className="adm-btn-ghost" onClick={() => dialog.current?.close()}>
            Close
          </button>
          <button type="button" className="adm-btn" onClick={copy} disabled={!state || loading}>
            {copied ? "Copied!" : "Copy prompt"}
          </button>
        </div>
      </dialog>
    </>
  );
}
