import type { Metadata } from "next";
import Link from "next/link";
import { Badge, DbError, Empty, PageHeader, Progress } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { fmtDay, fmtMoney, todayNY } from "@/lib/admin/format";
import { CLOSED_PROJECT_STATUSES, PROJECT_STATUS_LABEL, PROJECT_TYPE_LABEL } from "@/lib/admin/labels";
import { PROJECT_STATUSES, PROJECT_TYPES, type Project, type ProjectStatus, type ProjectType } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Projects" };

type Row = Project & { clients: { id: string; business_name: string } | null; deliverables: { status: string }[] };
type SP = Promise<{ [k: string]: string | string[] | undefined }>;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");

export default async function ProjectsPage({ searchParams }: { searchParams: SP }) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const status = (PROJECT_STATUSES as readonly string[]).includes(one(sp.status)) ? (one(sp.status) as ProjectStatus) : "";
  const type = (PROJECT_TYPES as readonly string[]).includes(one(sp.type)) ? (one(sp.type) as ProjectType) : "";
  const openOnly = one(sp.open) === "1" && !status;

  let q = supabase.from("projects").select("*, clients(id, business_name), deliverables(status)").order("due_date", { ascending: true, nullsFirst: false }).order("created_at", { ascending: false }).limit(1000);
  if (status) q = q.eq("status", status);
  if (type) q = q.eq("type", type);
  if (openOnly) q = q.not("status", "in", `(${CLOSED_PROJECT_STATUSES.join(",")})`);
  const { data, error } = await q.overrideTypes<Row[], { merge: false }>();
  if (error) return <DbError error={error} />;
  const rows = data ?? [];
  const today = todayNY();

  const chip = (href: string, label: string, on: boolean) => (
    <Link key={href} href={href} className="adm-chip" aria-current={on ? "true" : undefined}>
      {label}
    </Link>
  );
  const qs = (patch: Record<string, string>) => {
    const p = new URLSearchParams();
    const merged = { status, type, ...patch };
    Object.entries(merged).forEach(([k, v]) => v && p.set(k, v));
    const s = p.toString();
    return s ? `/admin/projects?${s}` : "/admin/projects";
  };

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle={`${rows.length} ${rows.length === 1 ? "project" : "projects"}${openOnly ? " open" : ""}`}
        actions={
          <Link href="/admin/projects/new" className="adm-btn">
            + New project
          </Link>
        }
      />

      <div className="adm-card mb-4 space-y-3 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-12 text-xs font-semibold uppercase tracking-wide text-ink/50">Status</span>
          {chip(qs({ status: "", open: "" }), "All", !status && !openOnly)}
          {chip(`/admin/projects?open=1${type ? `&type=${type}` : ""}`, "Open", openOnly)}
          {PROJECT_STATUSES.map((s) => chip(qs({ status: s }), PROJECT_STATUS_LABEL[s], status === s))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-12 text-xs font-semibold uppercase tracking-wide text-ink/50">Type</span>
          {chip(qs({ type: "" }), "All", !type)}
          {PROJECT_TYPES.map((t) => chip(qs({ type: t }), PROJECT_TYPE_LABEL[t], type === t))}
        </div>
      </div>

      {rows.length === 0 ? (
        <Empty>{status || type || openOnly ? "No projects match these filters." : "No projects yet. Create one from a client's page."}</Empty>
      ) : (
        <>
          <div className="adm-card hidden overflow-x-auto md:block">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Due</th>
                  <th className="text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const done = p.deliverables.filter((d) => d.status === "done").length;
                  const late = p.due_date && p.due_date < today && !CLOSED_PROJECT_STATUSES.includes(p.status);
                  return (
                    <tr key={p.id}>
                      <td>
                        <Link href={`/admin/projects/${p.id}`} className="font-semibold hover:text-teal-ink hover:underline">
                          {p.name}
                        </Link>
                      </td>
                      <td>{p.clients ? <Link href={`/admin/clients/${p.clients.id}`} className="hover:underline">{p.clients.business_name}</Link> : "—"}</td>
                      <td>{PROJECT_TYPE_LABEL[p.type] ?? p.type}</td>
                      <td>
                        <Badge value={p.status} label={PROJECT_STATUS_LABEL[p.status] ?? p.status} />
                      </td>
                      <td>
                        <Progress done={done} total={p.deliverables.length} />
                      </td>
                      <td className={`whitespace-nowrap ${late ? "font-semibold text-mk-red" : "text-ink/70"}`}>{fmtDay(p.due_date)}</td>
                      <td className="text-right tabular-nums">{fmtMoney(p.price)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <ul className="space-y-2 md:hidden">
            {rows.map((p) => {
              const done = p.deliverables.filter((d) => d.status === "done").length;
              return (
                <li key={p.id} className="adm-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/admin/projects/${p.id}`} className="min-w-0">
                      <span className="block truncate font-semibold">{p.name}</span>
                      <span className="block text-sm text-ink/65">{p.clients?.business_name ?? "—"}</span>
                    </Link>
                    <Badge value={p.status} label={PROJECT_STATUS_LABEL[p.status] ?? p.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/60">
                    <span>{PROJECT_TYPE_LABEL[p.type] ?? p.type}</span>
                    <Progress done={done} total={p.deliverables.length} />
                    <span>Due {fmtDay(p.due_date)}</span>
                    <span>{fmtMoney(p.price)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
