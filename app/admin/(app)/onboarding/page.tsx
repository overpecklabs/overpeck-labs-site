import type { Metadata } from "next";
import Link from "next/link";
import { Badge, DbError, Empty, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { fmtDate, fmtRelative } from "@/lib/admin/format";
import { loadOnboardingList, type OnboardingListRow } from "@/lib/admin/onboarding";
import { STATUS_LABEL } from "@/lib/portal/types";

export const metadata: Metadata = { title: "Onboarding" };

const FILTERS = [
  { key: "all", label: "All" },
  { key: "attention", label: "Needs attention" },
  { key: "submitted", label: "Submitted" },
  { key: "in_progress", label: "In progress" },
  { key: "not_started", label: "Not started" },
  { key: "complete", label: "Complete" },
  { key: "canceled", label: "Canceled" },
] as const;
const SORTS = [
  { key: "attention", label: "Needs attention first" },
  { key: "activity", label: "Last activity" },
  { key: "name", label: "Business name" },
  { key: "progress", label: "Progress" },
] as const;

const matches = (r: OnboardingListRow, filter: string) => {
  switch (filter) {
    case "attention":
      return r.attention !== null;
    case "submitted":
    case "complete":
    case "not_started":
      return r.status === filter;
    case "in_progress":
      return r.status === "in_progress" || r.status === "reopened";
    case "canceled":
      return r.payment === "canceled";
    default:
      return true;
  }
};

const rank = (r: OnboardingListRow) => (r.attention === "submitted" ? 0 : r.attention === "invite_expired" ? 1 : 2);
const time = (v: string | null) => (v ? new Date(v).getTime() : 0);

export default async function OnboardingListPage({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const filter = FILTERS.some((f) => f.key === sp.filter) ? (sp.filter as string) : "all";
  const sort = SORTS.some((s) => s.key === sp.sort) ? (sp.sort as string) : "attention";

  const { rows, error } = await loadOnboardingList(supabase);
  if (error) return <DbError error={error} />;

  const shown = rows.filter((r) => matches(r, filter)).sort((a, b) => {
    if (sort === "name") return a.business.localeCompare(b.business);
    if (sort === "progress") return b.percent - a.percent;
    if (sort === "activity") return time(b.lastActivity) - time(a.lastActivity);
    return rank(a) - rank(b) || time(b.lastActivity) - time(a.lastActivity) || time(b.paidAt) - time(a.paidAt);
  });
  const href = (f: string, s: string) => `/admin/onboarding?filter=${f}&sort=${s}`;
  const needs = rows.filter((r) => r.attention).length;

  return (
    <>
      <PageHeader title="Onboarding" subtitle={`${rows.length} paying client${rows.length === 1 ? "" : "s"}${needs ? ` · ${needs} need attention` : ""}`} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <Link key={f.key} href={href(f.key, sort)} className="adm-chip" aria-current={filter === f.key ? "true" : undefined}>
            {f.label}
          </Link>
        ))}
        <span className="ml-auto flex items-center gap-1.5 text-xs text-ink/60">
          Sort:
          {SORTS.map((s) => (
            <Link key={s.key} href={href(filter, s.key)} className="adm-chip" aria-current={sort === s.key ? "true" : undefined}>
              {s.label}
            </Link>
          ))}
        </span>
      </div>

      {shown.length === 0 ? (
        <Empty>No clients match this filter.</Empty>
      ) : (
        <div className="adm-card overflow-x-auto">
          <table className="adm-table min-w-[56rem]">
            <thead>
              <tr>
                <th>Business</th>
                <th>Plan</th>
                <th>Payment</th>
                <th>Onboarding</th>
                <th>Progress</th>
                <th>Last activity</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.clientId}>
                  <td>
                    <Link href={`/admin/clients/${r.clientId}?tab=onboarding`} className="font-semibold hover:underline">
                      {r.business}
                    </Link>
                    <div className="text-xs text-ink/50">{r.email}</div>
                  </td>
                  <td>{r.plan ? r.plan.charAt(0).toUpperCase() + r.plan.slice(1) : r.planRaw}</td>
                  <td>
                    <Badge value={r.payment} label={r.payment === "active" ? "Active" : "Canceled"} />
                    <div className="mt-0.5 text-xs text-ink/50">Paid {fmtDate(r.paidAt)}</div>
                  </td>
                  <td>
                    <div className="flex flex-col items-start gap-1">
                      <Badge value={r.status} label={STATUS_LABEL[r.status]} />
                      {r.attention === "submitted" && <span className="text-xs font-semibold text-mk-red">Needs review</span>}
                      {r.attention === "invite_expired" && <Badge value="invite_expired" label="Invite expired" />}
                    </div>
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold tabular-nums">
                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-ink/10">
                        <span className="block h-full rounded-full bg-teal-ink" style={{ width: `${r.percent}%` }} />
                      </span>
                      {r.percent}%
                    </span>
                  </td>
                  <td className="text-sm text-ink/70">{r.lastActivity ? fmtRelative(r.lastActivity) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
