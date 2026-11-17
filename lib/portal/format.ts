import type { Answers, Field, StepDef } from "./types";
import { isVisible } from "./schema";

export type DisplayRow = { label: string; value: string; empty: boolean };

const optionLabel = (f: Extract<Field, { kind: "select" | "multi" }>, v: string) => f.options.find((o) => o.value === v)?.label ?? v;

/** A readable string for one answer. Lists of items become one numbered line per item. */
export function formatValue(f: Field, v: unknown): string {
  switch (f.kind) {
    case "text":
    case "textarea":
      return typeof v === "string" ? v.trim() : "";
    case "select":
      return typeof v === "string" && v ? optionLabel(f, v) : "";
    case "multi":
      return Array.isArray(v) ? v.map((x) => optionLabel(f, String(x))).join(", ") : "";
    case "toggle":
      return v === true ? "Yes" : v === false ? "No" : "";
    case "consent":
      return v === true ? "Agreed" : "";
    case "colors": {
      const c = v as { not_sure?: boolean; colors?: string[] } | undefined;
      if (!c) return "";
      return [c.colors?.length ? c.colors.join(", ") : "", c.not_sure ? "Not sure" : ""].filter(Boolean).join(" · ");
    }
    case "repeater":
      return Array.isArray(v)
        ? (v as Record<string, unknown>[])
            .map((item, i) => {
              const parts = f.fields.map((sf) => formatValue(sf, item?.[sf.key])).filter(Boolean);
              return `${i + 1}. ${parts.join(" · ")}`;
            })
            .join("\n")
        : "";
    default:
      return "";
  }
}

/** Every answerable field of a step with its formatted value (notes and upload slots are skipped). */
export function stepRows(step: StepDef, answers: Answers): DisplayRow[] {
  const values = answers[step.id] ?? {};
  return step.fields
    .filter((f) => f.kind !== "note" && f.kind !== "upload" && isVisible(f, values))
    .map((f) => {
      const value = formatValue(f, values[f.key]);
      return { label: f.label.length > 90 ? f.key : f.label, value, empty: value === "" };
    });
}
