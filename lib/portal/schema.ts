import { z } from "zod";
import type { Answers, Field, OnboardingStatus, RepeaterField, StepDef, WizardDef } from "./types";

// zod schemas generated from the step specs.
//   stepFormatSchema: only checks the shape and format of what's filled in. Used on Next and when saving (autosave).
//   stepCompleteSchema: the same, plus every required field. Used for the review step and for Submit.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEX = /^#[0-9a-fA-F]{6}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

function textShape(f: Extract<Field, { kind: "text" | "textarea" }>) {
  const max = f.max ?? 500;
  let s = z.string().trim().max(max, `Keep it under ${max} characters`).default("");
  if (f.kind === "text" && f.input === "email") s = s.refine((v) => v === "" || EMAIL.test(v), "Enter a valid email address");
  if (f.kind === "text" && f.input === "url") s = s.refine((v) => v === "" || /^https?:\/\/\S+\.\S+/i.test(v) || /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(v), "Enter a valid web address");
  if (f.kind === "text" && f.input === "tel") s = s.refine((v) => v === "" || v.replace(/\D/g, "").length >= 7, "Enter a valid phone number");
  if (f.kind === "text" && f.input === "time") s = s.refine((v) => v === "" || TIME.test(v), "Use a valid time");
  return s;
}

function fieldShape(f: Field): z.ZodType | null {
  switch (f.kind) {
    case "text":
    case "textarea":
      return textShape(f);
    case "select": {
      const allowed = new Set(f.options.map((o) => o.value));
      return z.string().max(60).refine((v) => v === "" || allowed.has(v), "Pick one of the choices").default("");
    }
    case "multi": {
      const allowed = new Set(f.options.map((o) => o.value));
      return z.array(z.string().max(60)).max(f.options.length).refine((a) => a.every((v) => allowed.has(v)), "Pick from the choices").default([]);
    }
    case "toggle":
    case "consent":
      return z.boolean().default(false);
    case "colors":
      return z.object({ not_sure: z.boolean().default(false), colors: z.array(z.string().regex(HEX, "Use a color like #0f766e")).max(4).default([]) }).default({ not_sure: false, colors: [] });
    case "repeater":
      return z.array(z.object(objectShape(f.fields))).max(f.max, `Up to ${f.max} entries`).default([]);
    case "upload":
    case "note":
      return null;
  }
}

function objectShape(fields: Field[]): Record<string, z.ZodType> {
  const shape: Record<string, z.ZodType> = {};
  for (const f of fields) {
    const s = fieldShape(f);
    if (s) shape[f.key] = s;
  }
  return shape;
}

export type Values = Record<string, unknown>;

export function isVisible(f: Field, values: Values): boolean {
  return !f.showIf || values[f.showIf.key] === f.showIf.equals;
}

/** True when the field has no answer. Toggles always count as answered. */
export function isEmpty(f: Field, v: unknown): boolean {
  switch (f.kind) {
    case "text":
    case "textarea":
    case "select":
      return typeof v !== "string" || v.trim() === "";
    case "multi":
    case "repeater":
      return !Array.isArray(v) || v.length === 0;
    case "consent":
      return v !== true;
    case "colors": {
      const c = v as { not_sure?: boolean; colors?: unknown[] } | undefined;
      return !c || (!c.not_sure && !(c.colors && c.colors.length > 0));
    }
    default:
      return false;
  }
}

/** Labels of the required fields still empty for a step (including inside list items). */
export function missingRequired(step: StepDef, values: Values | undefined): string[] {
  const out: string[] = [];
  const v = values ?? {};
  for (const f of step.fields) {
    if (!isVisible(f, v)) continue;
    if (f.required && isEmpty(f, v[f.key])) {
      out.push(f.label);
      continue;
    }
    if (f.kind === "repeater" && Array.isArray(v[f.key])) {
      const items = v[f.key] as Values[];
      items.forEach((item, i) => {
        for (const sub of (f as RepeaterField).fields) {
          if (sub.required && isEmpty(sub, item?.[sub.key])) out.push(`${f.itemLabel} ${i + 1}: ${sub.label}`);
        }
      });
    }
  }
  return out;
}

export function stepFormatSchema(step: StepDef) {
  return z.object(objectShape(step.fields));
}

export function stepCompleteSchema(step: StepDef) {
  return stepFormatSchema(step).superRefine((vals, ctx) => {
    for (const label of missingRequired(step, vals)) ctx.addIssue({ code: "custom", message: `${label} is required`, path: [label] });
  });
}

/** First format error per field key, for inline messages. Empty object when the step's answers are well formed. */
export function formatErrors(step: StepDef, values: Values): Record<string, string> {
  const r = stepFormatSchema(step).safeParse(values);
  if (r.success) return {};
  const out: Record<string, string> = {};
  for (const issue of r.error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** Defaults-filled, trimmed, unknown-keys-stripped values (what gets saved). */
export function cleanStep(step: StepDef, values: Values): { ok: true; data: Values } | { ok: false; error: string } {
  const r = stepFormatSchema(step).safeParse(values);
  return r.success ? { ok: true, data: r.data as Values } : { ok: false, error: r.error.issues[0]?.message ?? "Please check your answers." };
}

export type StepState = "complete" | "partial" | "empty";

export function stepIsComplete(step: StepDef, answers: Answers): boolean {
  if (step.review) return false;
  const saved = answers[step.id];
  if (!saved) return false;
  return stepCompleteSchema(step).safeParse(saved).success;
}

export type Progress = { done: number; total: number; percent: number };

/** Share of the data-entry steps (everything except the review step) that are saved and complete. */
export function computeProgress(wizard: WizardDef, answers: Answers, status: OnboardingStatus): Progress {
  const steps = wizard.steps.filter((s) => !s.review);
  const done = steps.filter((s) => stepIsComplete(s, answers)).length;
  const complete = status === "submitted" || status === "complete";
  return { done: complete ? steps.length : done, total: steps.length, percent: complete ? 100 : Math.round((done / Math.max(1, steps.length)) * 100) };
}
