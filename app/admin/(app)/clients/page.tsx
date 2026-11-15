import type { Metadata } from "next";
import Link from "next/link";
import { Badge, DbError, Empty, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { fmtDate, telHref } from "@/lib/admin/format";
import { CLIENT_STATUS_LABEL } from "@/lib/admin/labels";
import { CLIENT_STATUSES, type Client, type ClientStatus } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Clients" };

type Row = Client & { projects: { count: number }[]; communications: { occurred_at: string }[] };
type SP = Promise<{ [k: string]: string | string[] | undefined }>;

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");
/** Strip characters that have meaning inside a PostgREST or() filter. */
const clean = (s: string) => s.replace(/[,()*%\\"'`:]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);

export default async function ClientsPage({ searchParams }: { searchParams: SP }) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const q = clean(one(sp.q));
  const status = (CLIENT_STATUSES as readonly string[]).includes(one(sp.status)) ? (one(sp.status) as ClientStatus) : "";
  const industry = one(sp.industry).slice(0, 100);
  const sort = ["name", "last"].includes(one(sp.sort)) ? one(sp.sort) : "newest";

  let query = supabase
    .from("clients")
    .select("*, projects(count), communications(occurred_at)")
    .order("occurred_at", { referencedTable: "communications", ascending: false })
    .limit(1, { referencedTable: "communications" })
    .limit(1000);
  if (status) query = query.eq("status", status);
  if (industry) query = query.eq("industry", industry);
  if (q) {
    const like = `%${q}%`;
    const digits = q.replace(/\D/g, "");
    const ors = [`business_name.ilike.${like}`, `contact_name.ilike.${like}`, `phone.ilike.${like}`, `email.ilike.${like}`, `town.ilike.${like}`];
    if (digits.length >= 3) ors.push(`phone_digits.ilike.%${digits}%`);
    query = query.or(ors.join(","));
  }
  query = sort === "name" ? query.order("business_name", { ascending: true }) : query.order("created_at", { ascending: false });

  const [{ data, error }, ind] = await Promise.all([
    query.overrideTypes<Row[], { merge: false }>(),
    supabase.from("clients").select("industry").not("industry", "is", null).overrideTypes<{ industry: string }[], { merge: false }>(),
  ]);
  if (error) return <DbError error={error} />;

  const rows = (data ?? []).map((c) => ({
    ...c,
    projectCount: c.projects?.[0]?.count ?? 0,
    lastContact: c.communications?.[0]?.occurred_at ?? null,
  }));
  if (sort === "last") rows.sort((a, b) => (b.lastContact ?? "").localeCompare(a.lastContact ?? ""));
  const industries = Array.from(new Set((ind.data ?? []).map((r) => r.industry).filter(Boolean))).sort();
  const filtered = !!(q || status || industry);

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle={`${rows.length} ${rows.length === 1 ? "client" : "clients"}${filtered ? " match" : ""}`}
        actions={
          <Link href="/admin/clients/new" className="adm-btn">
            + Add client
          </Link>
        }
      />

      <form method="get" className="adm-card mb-4 grid gap-3 p-3 sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-end sm:p-4">
        <div>
          <label className="adm-label" htmlFor="q">
            Search
          </label>
          <input id="q" name="q" type="search" defaultValue={q} className="adm-input" placeholder="Business, contact, phone, email, town" />
        </div>
        <div>
          <label className="adm-label" htmlFor="status">
            Status
          </label>
          <select id="status" name="status" defaultValue={status} className="adm-input">
            <option value="">All</option>
            {CLIENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {CLIENT_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="adm-label" htmlFor="industry">
            Industry
          </label>
          <select id="industry" name="industry" defaultValue={industry} className="adm-input">
            <option value="">All</option>
            {industries.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="adm-label" htmlFor="sort">
            Sort
          </label>
          <select id="sort" name="sort" defaultValue={sort} className="adm-input">
            <option value="newest">Newest</option>
            <option value="name">Name</option>
            <option value="last">Last contact</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="adm-btn">
            Apply
          </button>
          {filtered && (
            <Link href="/admin/clients" className="adm-btn-ghost">
              Clear
            </Link>
          )}
        </div>
      </form>

      {rows.length === 0 ? (
        <Empty>{filtered ? "No clients match these filters." : "No clients yet. Add your first one, or they'll appear here when leads come in."}</Empty>
      ) : (
        <>
          <div className="adm-card hidden overflow-x-auto md:block">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Contact</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th className="text-right">Projects</th>
                  <th>Last contact</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/admin/clients/${c.id}`} className="font-semibold hover:text-teal-ink hover:underline">
                        {c.business_name}
                      </Link>
                      {(c.industry || c.town) && <p className="text-xs text-ink/55">{[c.industry, c.town].filter(Boolean).join(" · ")}</p>}
                    </td>
                    <td>
                      {c.contact_name ?? <span className="text-ink/40">—</span>}
                      {c.email && <p className="text-xs text-ink/55">{c.email}</p>}
                    </td>
                    <td>{c.phone && telHref(c.phone) ? <a href={telHref(c.phone)!} className="whitespace-nowrap font-medium text-teal-ink hover:underline">{c.phone}</a> : <span className="text-ink/40">—</span>}</td>
                    <td>
                      <Badge value={c.status} label={CLIENT_STATUS_LABEL[c.status] ?? c.status} />
                    </td>
                    <td className="text-right tabular-nums">{c.projectCount}</td>
                    <td className="whitespace-nowrap text-ink/70">{c.lastContact ? fmtDate(c.lastContact) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-2 md:hidden">
            {rows.map((c) => (
              <li key={c.id} className="adm-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/admin/clients/${c.id}`} className="min-w-0 font-semibold">
                    <span className="block truncate">{c.business_name}</span>
                    {c.contact_name && <span className="block text-sm font-normal text-ink/65">{c.contact_name}</span>}
                  </Link>
                  <Badge value={c.status} label={CLIENT_STATUS_LABEL[c.status] ?? c.status} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/60">
                  {c.phone && telHref(c.phone) && (
                    <a href={telHref(c.phone)!} className="text-sm font-semibold text-teal-ink">
                      {c.phone}
                    </a>
                  )}
                  <span>
                    {c.projectCount} {c.projectCount === 1 ? "project" : "projects"}
                  </span>
                  <span>Last contact {c.lastContact ? fmtDate(c.lastContact) : "—"}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
