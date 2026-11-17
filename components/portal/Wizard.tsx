"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { saveStep, submitOnboarding } from "@/app/portal/actions";
import { FieldInput } from "./Fields";
import Uploader from "./Uploader";
import { Panel, ProgressBar } from "./Shell";
import { formatErrors, isVisible, missingRequired, stepIsComplete, computeProgress, type Values } from "@/lib/portal/schema";
import { stepRows } from "@/lib/portal/format";
import { getWizard } from "@/lib/portal/wizards";
import type { Answers, OnboardingStatus, PortalFile, PortalPlan, StepDef } from "@/lib/portal/types";
import { PHONE_DISPLAY } from "@/lib/services";

type SaveState = "idle" | "saving" | "saved" | "error" | "invalid";

export default function Wizard({
  plan,
  initialStep,
  initialAnswers,
  initialFiles,
  clientId,
  userEmail,
  status,
  editable,
  supportEmail,
}: {
  plan: PortalPlan;
  initialStep: string;
  initialAnswers: Answers;
  initialFiles: PortalFile[];
  clientId: string;
  userEmail: string;
  status: OnboardingStatus;
  editable: boolean;
  supportEmail: string;
}) {
  const wizard = useMemo(() => getWizard(plan)!, [plan]);
  const steps = wizard.steps;
  const [stepId, setStepId] = useState(initialStep);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [files, setFiles] = useState<PortalFile[]>(initialFiles);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<{ error: string; missing?: string[] } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const answersRef = useRef(answers);
  answersRef.current = answers;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const heading = useRef<HTMLHeadingElement>(null);

  const index = Math.max(0, steps.findIndex((s) => s.id === stepId));
  const step = steps[index];
  const readOnly = !editable || submitted;

  /** Saves one step's answers (in order, one at a time) and moves the resume pointer. Skips steps with invalid formats. */
  const persist = useCallback(
    (target: StepDef, resumeAt: string) => {
      if (target.review) return Promise.resolve();
      const values = (answersRef.current[target.id] ?? {}) as Values;
      if (Object.keys(formatErrors(target, values)).length) {
        setSaveState("invalid");
        return Promise.resolve();
      }
      setSaveState("saving");
      const run = queue.current.then(() => saveStep(target.id, values, resumeAt));
      queue.current = run.catch(() => undefined);
      return run.then(
        (r) => {
          if (r.ok) {
            setSaveState("saved");
            setSaveError(null);
          } else {
            setSaveState("error");
            setSaveError(r.error);
          }
        },
        () => {
          setSaveState("error");
          setSaveError("Couldn't save. Check your connection and try again.");
        },
      );
    },
    [],
  );

  const schedule = useCallback(
    (target: StepDef) => {
      if (timer.current) clearTimeout(timer.current);
      setSaveState("idle");
      timer.current = setTimeout(() => void persist(target, target.id), 800);
    },
    [persist],
  );

  // Flush a pending save if the page is hidden or closed.
  useEffect(() => {
    const flush = () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
        void persist(step, step.id);
      }
    };
    document.addEventListener("visibilitychange", flush);
    return () => {
      document.removeEventListener("visibilitychange", flush);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [persist, step]);

  function setValue(key: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [step.id]: { ...(prev[step.id] ?? {}), [key]: value } }));
    setErrors((e) => {
      if (!e[key]) return e;
      const { [key]: _drop, ...rest } = e;
      void _drop;
      return rest;
    });
    schedule(step);
  }

  async function go(target: string, { validate }: { validate: boolean }) {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (!readOnly && !step.review) {
      const found = formatErrors(step, (answers[step.id] ?? {}) as Values);
      if (validate && Object.keys(found).length) {
        setErrors(found);
        return;
      }
      void persist(step, target);
    }
    setErrors({});
    setStepId(target);
    window.history.replaceState(null, "", `/portal/wizard?step=${target}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => heading.current?.focus(), 0);
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    if (timer.current) clearTimeout(timer.current);
    await queue.current;
    const r = await submitOnboarding();
    setSubmitting(false);
    if (r.ok) {
      setSubmitted(true);
      window.scrollTo({ top: 0 });
    } else setSubmitError({ error: r.error, missing: r.missing });
  }

  const progress = computeProgress(wizard, answers, submitted ? "submitted" : status);
  const values = (answers[step.id] ?? {}) as Values;

  if (submitted) {
    return (
      <Panel>
        <h1 className="font-display text-2xl font-bold">We got everything. Thank you!</h1>
        <p className="mt-3 text-sm text-ink/80">We&apos;re looking over your answers now. We&apos;ll email you what happens next, and we&apos;ll reach out if anything is unclear.</p>
        <Link href="/portal" className="btn-primary mt-5">
          Back to your portal
        </Link>
      </Panel>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <Link href="/portal" className="text-sm font-semibold text-ink/60 hover:text-ink">
          ← Your portal
        </Link>
        <div className="mt-3">
          <ProgressBar percent={progress.percent} label={`${wizard.planName} onboarding · step ${index + 1} of ${steps.length}`} />
        </div>
        <ol className="mt-3 flex gap-1.5 overflow-x-auto pb-1" aria-label="Steps">
          {steps.map((s, i) => {
            const done = stepIsComplete(s, answers);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => void go(s.id, { validate: false })}
                  aria-current={i === index ? "step" : undefined}
                  title={s.title}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-full border px-2.5 text-xs font-bold ${
                    i === index ? "border-ink bg-ink text-white" : done ? "border-teal-ink/40 bg-note-teal text-teal-ink" : "border-ink/15 bg-white text-ink/60"
                  }`}
                >
                  {done && i !== index ? "✓" : i + 1}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {readOnly && (
        <p className="rounded-xl border border-ink/15 bg-note-blue/50 px-4 py-3 text-sm">
          Your answers are submitted, so they&apos;re read-only. To change something, call {PHONE_DISPLAY} and we can reopen it.
        </p>
      )}

      <Panel>
        <h1 ref={heading} tabIndex={-1} className="font-display text-2xl font-bold outline-none">
          {step.title}
        </h1>
        <p className="mt-1 text-sm text-ink/70">{step.description}</p>

        {step.review ? (
          <Review wizard={wizard.steps} answers={answers} files={files} onEdit={(id) => void go(id, { validate: false })} />
        ) : (
          <fieldset disabled={readOnly} className="mt-6 space-y-5 border-0 p-0">
            {step.fields.map((f) => {
              if (!isVisible(f, values)) return null;
              if (f.kind === "upload") {
                return (
                  <div key={f.key}>
                    <p className="adm-label !text-sm">{f.label}</p>
                    {f.help && <p className="mb-2 text-xs text-ink/60">{f.help}</p>}
                    <Uploader slot={f.slot} clientId={clientId} userEmail={userEmail} files={files} onFiles={setFiles} disabled={readOnly} />
                  </div>
                );
              }
              return (
                <FieldInput key={f.key} field={f} value={values[f.key]} onChange={(v) => setValue(f.key, v)} error={errors[f.key]} supportEmail={supportEmail} />
              );
            })}
          </fieldset>
        )}

        {!step.review && !readOnly && missingRequired(step, values).length > 0 && (
          <p className="mt-5 text-xs text-ink/55">Fields marked * are needed before you submit. You can move on and come back to them.</p>
        )}
      </Panel>

      {step.review && !readOnly && (
        <ReviewSubmit wizardSteps={wizard.steps} answers={answers} submitting={submitting} submitError={submitError} onSubmit={() => void submit()} onEdit={(id) => void go(id, { validate: false })} />
      )}

      <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-3 border-t border-ink/10 bg-board/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        <button type="button" className="adm-btn-ghost !py-2.5" disabled={index === 0} onClick={() => void go(steps[index - 1].id, { validate: false })}>
          ← Back
        </button>
        <SaveBadge state={saveState} error={saveError} readOnly={readOnly} />
        {index < steps.length - 1 ? (
          <button type="button" className="btn-primary !py-2.5" onClick={() => void go(steps[index + 1].id, { validate: true })}>
            Next →
          </button>
        ) : (
          <span className="w-20" />
        )}
      </div>
      {Object.keys(errors).length > 0 && (
        <p role="alert" className="text-sm font-semibold text-mk-red">
          Please fix the highlighted fields to continue.
        </p>
      )}
    </div>
  );
}

function SaveBadge({ state, error, readOnly }: { state: SaveState; error: string | null; readOnly: boolean }) {
  if (readOnly) return <span />;
  const text =
    state === "saving" ? "Saving…" : state === "saved" ? "Saved" : state === "error" ? (error ?? "Couldn't save") : state === "invalid" ? "Fix highlighted fields to save" : "";
  return (
    <span role="status" aria-live="polite" className={`min-w-0 truncate text-center text-xs font-semibold ${state === "error" || state === "invalid" ? "text-mk-red" : "text-ink/55"}`}>
      {text}
    </span>
  );
}

function Review({ wizard, answers, files, onEdit }: { wizard: StepDef[]; answers: Answers; files: PortalFile[]; onEdit: (id: string) => void }) {
  return (
    <div className="mt-6 space-y-4">
      {wizard
        .filter((s) => !s.review)
        .map((s) => {
          const rows = stepRows(s, answers);
          const missing = missingRequired(s, answers[s.id]);
          const logo = s.id === "brand" ? files.filter((f) => f.label === "Onboarding: logo").length : 0;
          const photos = s.id === "photos" ? files.filter((f) => f.label === "Onboarding: photo").length : 0;
          return (
            <section key={s.id} className="rounded-xl border border-ink/12 bg-white/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-base font-bold">{s.title}</h2>
                <button type="button" className="text-sm font-semibold text-teal-ink underline" onClick={() => onEdit(s.id)}>
                  Edit
                </button>
              </div>
              <dl className="mt-3 grid gap-2.5">
                {rows.map((r) => (
                  <div key={r.label}>
                    <dt className="text-xs font-semibold text-ink/55">{r.label}</dt>
                    <dd className={`whitespace-pre-line text-sm ${r.empty ? "text-ink/35" : ""}`}>{r.empty ? "Not answered" : r.value}</dd>
                  </div>
                ))}
                {s.id === "brand" && (
                  <div>
                    <dt className="text-xs font-semibold text-ink/55">Logo</dt>
                    <dd className={`text-sm ${logo ? "" : "text-ink/35"}`}>{logo ? "Uploaded" : "Not uploaded"}</dd>
                  </div>
                )}
                {s.id === "photos" && (
                  <div>
                    <dt className="text-xs font-semibold text-ink/55">Photos</dt>
                    <dd className={`text-sm ${photos ? "" : "text-ink/35"}`}>{photos ? `${photos} uploaded` : "None uploaded"}</dd>
                  </div>
                )}
              </dl>
              {missing.length > 0 && <p className="mt-3 text-xs font-semibold text-mk-red">Still needed: {missing.join("; ")}</p>}
            </section>
          );
        })}
    </div>
  );
}

function ReviewSubmit({
  wizardSteps,
  answers,
  submitting,
  submitError,
  onSubmit,
  onEdit,
}: {
  wizardSteps: StepDef[];
  answers: Answers;
  submitting: boolean;
  submitError: { error: string; missing?: string[] } | null;
  onSubmit: () => void;
  onEdit: (id: string) => void;
}) {
  const incomplete = wizardSteps.filter((s) => !s.review && missingRequired(s, answers[s.id]).length > 0);
  return (
    <Panel>
      {incomplete.length > 0 ? (
        <>
          <p className="text-sm font-semibold">A few required answers are still empty:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {incomplete.map((s) => (
              <li key={s.id}>
                {s.title}{" "}
                <button type="button" className="font-semibold text-teal-ink underline" onClick={() => onEdit(s.id)}>
                  Fix
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-sm text-ink/75">Everything required is filled in. Once you submit, your answers become read-only.</p>
      )}
      {submitError && (
        <p role="alert" className="mt-3 text-sm font-semibold text-mk-red">
          {submitError.error}
          {submitError.missing && ` ${submitError.missing.join("; ")}`}
        </p>
      )}
      <button type="button" className="btn-primary mt-4 w-full !py-3 sm:w-auto" disabled={incomplete.length > 0 || submitting} aria-busy={submitting} onClick={onSubmit}>
        {submitting ? "Submitting…" : "Submit my onboarding"}
      </button>
    </Panel>
  );
}
