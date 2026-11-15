import { fmtDateTime } from "@/lib/admin/format";
import type { MockupRequest } from "@/lib/admin/types";

const HIDDEN = new Set(["id", "client_id"]);
const ORDER = ["created_at", "status", "business_name", "contact_name", "phone", "email", "industry", "town", "timeline", "goals", "extras", "style", "brand_colors", "logo_url", "source_page", "retell_call_id"];

function humanize(k: string): string {
  const s = k.replace(/_/g, " ").replace(/\burl\b/i, "URL").replace(/\bid\b/i, "ID");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function isEmpty(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string") return v.trim() === "";
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v as object).length === 0;
  return false;
}

function Value({ k, v }: { k: string; v: unknown }) {
  if (Array.isArray(v)) {
    return (
      <span className="flex flex-wrap gap-1">
        {v.map((x, i) => (
          <span key={i} className="rounded-full bg-note-teal px-2 py-0.5 text-xs font-semibold">
            {typeof x === "string" ? x : JSON.stringify(x)}
          </span>
        ))}
      </span>
    );
  }
  if (typeof v === "object" && v !== null) {
    return (
      <details>
        <summary className="cursor-pointer text-xs font-semibold text-teal-ink">Show</summary>
        <pre className="mt-1 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-board p-2 text-xs">{JSON.stringify(v, null, 2)}</pre>
      </details>
    );
  }
  if (typeof v === "boolean") return <>{v ? "Yes" : "No"}</>;
  const s = String(v);
  if (/_at$/.test(k) || /timestamp/.test(k)) return <>{fmtDateTime(s)}</>;
  if (/^https?:\/\//.test(s))
    return (
      <a href={s} target="_blank" rel="noopener noreferrer" className="break-all font-semibold text-teal-ink hover:underline">
        {s}
      </a>
    );
  return <span className="whitespace-pre-line">{s}</span>;
}

/** Every non-empty answer on a mockup request, with a signed logo preview. */
export default function IntakeDetail({ row, logoUrl }: { row: MockupRequest; logoUrl?: string | null }) {
  const keys = Object.keys(row).filter((k) => !HIDDEN.has(k) && !isEmpty(row[k]));
  keys.sort((a, b) => {
    const ia = ORDER.indexOf(a);
    const ib = ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {keys.map((k) => (
        <div key={k} className={`min-w-0 ${k === "raw" || (typeof row[k] === "string" && (row[k] as string).length > 120) ? "sm:col-span-2" : ""}`}>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{humanize(k)}</dt>
          <dd className="mt-0.5 break-words text-sm">
            {k === "logo_url" ? (
              logoUrl ? (
                <a href={logoUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt="Uploaded logo" className="max-h-24 max-w-[12rem] rounded-lg border border-ink/10 bg-white object-contain p-1" />
                </a>
              ) : (
                <span className="text-ink/50">Logo uploaded (preview unavailable)</span>
              )
            ) : (
              <Value k={k} v={row[k]} />
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
