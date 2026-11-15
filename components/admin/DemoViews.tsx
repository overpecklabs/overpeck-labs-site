import { CopyButton } from "./controls";
import { Card, Empty } from "./ui";
import { fmtDateTime, fmtRelative } from "@/lib/admin/format";
import { SITE_URL } from "@/lib/site";
import type { DemoViewStats } from "@/lib/admin/views";

export function referrerLabel(ref: string | null): string {
  if (!ref) return "Direct / unknown";
  try {
    return new URL(ref).hostname.replace(/^www\./, "") || ref;
  } catch {
    return ref.slice(0, 60);
  }
}

const DEVICE: Record<string, string> = { mobile: "📱 Mobile", tablet: "Tablet", desktop: "🖥 Desktop" };

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-ink/[0.07] bg-white/70 px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/50">{label}</p>
      <p className="mt-0.5 font-display text-xl font-bold leading-tight">{value}</p>
      {sub && <p className="text-xs text-ink/55">{sub}</p>}
    </div>
  );
}

/** Demo link (copy / open without counting) and the client's demo view stats. */
export default function DemoViews({ slug, stats }: { slug: string | null; stats: DemoViewStats | null }) {
  const publicUrl = slug ? `${SITE_URL}/demo/${slug}` : null;
  const last = stats?.recent[0]?.viewed_at ?? null;
  return (
    <Card title="Demo views">
      {publicUrl ? (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl bg-ink/[0.04] px-3 py-2">
          <span className="min-w-0 flex-1 break-all font-mono text-xs">{publicUrl.replace(/^https?:\/\//, "")}</span>
          <CopyButton text={publicUrl} />
          {/* ?preview=1 so our own visits aren't counted */}
          <a href={`/demo/${slug}?preview=1`} target="_blank" rel="noopener noreferrer" className="adm-btn-ghost !px-3 !py-1 text-xs">
            Open ↗
          </a>
        </div>
      ) : (
        <p className="mb-4 text-sm text-ink/60">No demo slug yet. Set one in Edit, or click “Generate demo prompt” to create it.</p>
      )}

      {!stats ? null : stats.error ? (
        <p role="alert" className="text-sm text-mk-red">
          Couldn&apos;t load demo views.
        </p>
      ) : stats.total === 0 ? (
        <Empty>No views yet.</Empty>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Total views" value={stats.total} />
            <Stat label="Unique sessions" value={stats.sessions} sub={stats.capped ? "from latest 2,000" : undefined} />
            <Stat label="Last viewed" value={<span className="text-base">{fmtRelative(last)}</span>} sub={fmtDateTime(last)} />
            <Stat label="Last 7 days" value={stats.last7} />
          </div>
          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink/50">Recent views</h3>
          <ul className="mt-2 divide-y divide-ink/[0.07] text-sm">
            {stats.recent.map((v, i) => (
              <li key={`${v.viewed_at}-${i}`} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 py-1.5">
                <span className="tabular-nums">{fmtDateTime(v.viewed_at)}</span>
                <span className="text-xs text-ink/60">
                  {DEVICE[v.device ?? ""] ?? "Unknown device"} · <span title={v.referrer ?? undefined}>{referrerLabel(v.referrer)}</span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
