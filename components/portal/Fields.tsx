"use client";

import { useId } from "react";
import type { Field, RepeaterField, TextField, TextareaField } from "@/lib/portal/types";

type Values = Record<string, unknown>;

type Common = {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  /** Show a "needed before you submit" hint when a required field is still empty. */
  hintMissing?: boolean;
};

function Label({ field, htmlFor }: { field: Field; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="adm-label !text-sm">
      {field.label}
      {field.required && (
        <span className="ml-1 text-mk-red" aria-hidden title="Required to submit">
          *
        </span>
      )}
    </label>
  );
}

function Help({ id, field, error }: { id: string; field: Field; error?: string }) {
  return (
    <>
      {field.help && (
        <p id={id} className="mt-1 text-xs text-ink/60">
          {field.help}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-1 text-xs font-semibold text-mk-red">
          {error}
        </p>
      )}
    </>
  );
}

const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);

function Single({ field, value, onChange, error, nested }: Common & { field: TextField | TextareaField; nested?: boolean }) {
  const id = useId();
  const help = `${id}-h`;
  const common = {
    id,
    value: str(value),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    className: "adm-input",
    maxLength: field.max,
    placeholder: field.placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": field.help || error ? help : undefined,
  };
  return (
    <div>
      <Label field={field} htmlFor={id} />
      {field.kind === "textarea" ? (
        <textarea rows={field.rows ?? 3} {...common} />
      ) : (
        <input
          type={field.input ?? "text"}
          inputMode={field.input === "tel" ? "tel" : field.input === "email" ? "email" : field.input === "url" ? "url" : undefined}
          autoComplete={nested ? "off" : field.input === "tel" ? "tel" : field.input === "email" ? "email" : "off"}
          {...common}
        />
      )}
      <Help id={help} field={field} error={error} />
    </div>
  );
}

function Select({ field, value, onChange, error }: Common) {
  const id = useId();
  if (field.kind !== "select") return null;
  return (
    <div>
      <Label field={field} htmlFor={id} />
      <select id={id} className="adm-input" value={str(value)} onChange={(e) => onChange(e.target.value)} aria-invalid={error ? true : undefined}>
        <option value="">Choose…</option>
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Help id={`${id}-h`} field={field} error={error} />
    </div>
  );
}

function Multi({ field, value, onChange, error }: Common) {
  const id = useId();
  if (field.kind !== "multi") return null;
  const picked = arr(value);
  return (
    <fieldset aria-describedby={`${id}-h`}>
      <legend className="adm-label !text-sm">
        {field.label}
        {field.required && (
          <span className="ml-1 text-mk-red" aria-hidden>
            *
          </span>
        )}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {field.options.map((o) => {
          const on = picked.includes(o.value);
          return (
            <label key={o.value} className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-sm ${on ? "border-teal-ink bg-note-teal/50" : "border-ink/15 bg-white"}`}>
              <input
                type="checkbox"
                className="h-4 w-4 accent-teal-ink"
                checked={on}
                onChange={() => onChange(on ? picked.filter((p) => p !== o.value) : [...picked, o.value])}
              />
              {o.label}
            </label>
          );
        })}
      </div>
      <Help id={`${id}-h`} field={field} error={error} />
    </fieldset>
  );
}

function Toggle({ field, value, onChange }: Common) {
  const id = useId();
  const on = value === true;
  return (
    <div>
      <p id={id} className="adm-label !text-sm">
        {field.label}
      </p>
      <div role="group" aria-labelledby={id} className="inline-flex overflow-hidden rounded-full border border-ink/20">
        {([true, false] as const).map((opt) => (
          <button
            key={String(opt)}
            type="button"
            aria-pressed={on === opt}
            onClick={() => onChange(opt)}
            className={`min-h-11 min-w-20 px-5 text-sm font-semibold ${on === opt ? "bg-ink text-white" : "bg-white text-ink/70"}`}
          >
            {opt ? "Yes" : "No"}
          </button>
        ))}
      </div>
      <Help id={`${id}-h`} field={field} />
    </div>
  );
}

function Consent({ field, value, onChange, error }: Common) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink/15 bg-white p-3 text-sm">
        <input id={id} type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-teal-ink" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
        <span>
          {field.label}
          {field.required && (
            <span className="ml-1 text-mk-red" aria-hidden>
              *
            </span>
          )}
        </span>
      </label>
      <Help id={`${id}-h`} field={field} error={error} />
    </div>
  );
}

function Colors({ field, value, onChange, error }: Common) {
  const id = useId();
  const v = (value ?? {}) as { not_sure?: boolean; colors?: string[] };
  const colors = Array.isArray(v.colors) ? v.colors : [];
  const set = (next: { not_sure?: boolean; colors?: string[] }) => onChange({ not_sure: next.not_sure ?? v.not_sure ?? false, colors: next.colors ?? colors });
  return (
    <div>
      <p id={id} className="adm-label !text-sm">
        {field.label}
      </p>
      <div className="flex flex-wrap items-center gap-3" role="group" aria-labelledby={id}>
        {colors.map((c, i) => (
          <span key={`${c}-${i}`} className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white py-1 pl-1 pr-3 text-xs">
            <input
              type="color"
              aria-label={`Color ${i + 1}`}
              value={c}
              onChange={(e) => set({ colors: colors.map((x, j) => (j === i ? e.target.value : x)) })}
              className="h-8 w-8 cursor-pointer rounded-full border-0 bg-transparent p-0"
            />
            <span className="font-mono">{c}</span>
            <button type="button" aria-label={`Remove color ${i + 1}`} onClick={() => set({ colors: colors.filter((_, j) => j !== i) })} className="text-ink/50 hover:text-ink">
              ✕
            </button>
          </span>
        ))}
        {colors.length < 4 && (
          <button type="button" className="adm-btn-ghost !px-3 !py-1.5 text-sm" onClick={() => set({ colors: [...colors, "#0f766e"], not_sure: false })}>
            + Add a color
          </button>
        )}
      </div>
      <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-2.5 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-teal-ink" checked={v.not_sure === true} onChange={(e) => set({ not_sure: e.target.checked })} />
        I&apos;m not sure, you pick
      </label>
      <Help id={`${id}-h`} field={field} error={error} />
    </div>
  );
}

function Repeater({ field, value, onChange, error }: Common & { field: RepeaterField }) {
  const id = useId();
  const items = (Array.isArray(value) ? value : []) as Values[];
  const update = (i: number, key: string, v: unknown) => onChange(items.map((it, j) => (j === i ? { ...it, [key]: v } : it)));
  return (
    <fieldset>
      <legend className="adm-label !text-sm">
        {field.label}
        {field.required && (
          <span className="ml-1 text-mk-red" aria-hidden>
            *
          </span>
        )}
      </legend>
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="rounded-xl border border-ink/12 bg-white/70 p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-ink/50">
                {field.itemLabel} {i + 1}
              </span>
              <button type="button" className="text-xs font-semibold text-mk-red hover:underline" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                Remove
              </button>
            </div>
            <div className="grid gap-3">
              {field.fields.map((sub) => (
                <Single key={sub.key} field={sub} value={item[sub.key]} onChange={(v) => update(i, sub.key, v)} nested />
              ))}
            </div>
          </li>
        ))}
      </ol>
      {items.length < field.max && (
        <button type="button" className="adm-btn-ghost mt-3" onClick={() => onChange([...items, {}])}>
          + {field.addLabel}
        </button>
      )}
      <Help id={`${id}-h`} field={field} error={error} />
    </fieldset>
  );
}

/** Renders one field from its spec. Upload slots are handled by the wizard, not here. */
export function FieldInput(props: Common & { supportEmail?: string }) {
  const { field } = props;
  switch (field.kind) {
    case "text":
    case "textarea":
      return <Single {...props} field={field} />;
    case "select":
      return <Select {...props} />;
    case "multi":
      return <Multi {...props} />;
    case "toggle":
      return <Toggle {...props} />;
    case "consent":
      return <Consent {...props} />;
    case "colors":
      return <Colors {...props} />;
    case "repeater":
      return <Repeater {...props} field={field} />;
    case "note":
      return (
        <div className="rounded-xl border border-ink/10 bg-note-yellow/40 p-3 text-sm text-ink/85">
          <p className="font-semibold">{field.label}</p>
          <p className="mt-1">{field.text.replaceAll("{{support_email}}", props.supportEmail ?? "our support address")}</p>
        </div>
      );
    default:
      return null;
  }
}
