import type { Metadata } from "next";
import Link from "next/link";
import { setDeliverableStatus } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/controls";
import { Badge, Card, ChannelIcon, DbError, Empty, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { referrerLabel } from "@/components/admin/DemoViews";
import { fmtDateTime, fmtDay, fmtRelative, todayNY } from "@/lib/admin/format";
import { loadDemoActivity } from "@/lib/admin/views";
import { CHANNEL_LABEL, CLOSED_PROJECT_STATUSES, PROJECT_STATUS_LABEL, STAGE_COLUMN, TONE, normalizeStage } from "@/lib/admin/labels";
import { CLIENT_STATUSES, PROJECT_STATUSES, type ClientStage, type Communication, type ContactMessage, type Deliverable, type MockupRequest, type ProjectStatus } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Dashboard" };

type DueRow = Deliverable & { projects: { id: string; name: string; clients: { id: string; business_name: string } | null } | null };
type CommRow = Pick<Communication, "id" | "channel" | "direction" | "summary" | "body" | "occurred_at" | "client_id"> & { clients: { id: string; business_name: string } | null };

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const today = todayNY();
  const in7 = todayNY(7);
  const weekEnd = todayNY(6);
  const since = new Date(Date.now() - 14 * 86400000).toISOString();

  const [clientRows, projects, due, comms, mockups, messages, demo] = await Promise.all([
    supabase.from("clients").select("status").limit(20000).overrideTypes<{ status: string }[], { merge: false }>(),
    supabase.from("projects").select("status").overrideTypes<{ status: ProjectStatus }[], { merge: false }>(),
    supabase
      .from("deliverables")
      .select("*, projects(id, name, clients(id, business_name))")
      .neq("status", "done")
      .not("due_date", "is", null)
      .lte("due_date", in7)
      .order("due_date", { ascending: true })
      .limit(100)
      .overrideTypes<DueRow[], { merge: false }>(),
    supabase
      .from("communications")
      .select("id, channel, direction, summary, body, occurred_at, client_id, clients(id, business_name)")
      .order("occurred_at", { ascending: false })
      .limit(15)
      .overrideTypes<CommRow[], { merge: false }>(),
    supabase
      .from("mockup_requests")
      .select("id, client_id, business_name, contact_name, phone, industry, town, timeline, source_page, retell_call_id, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10)
      .overrideTypes<MockupRequest[], { merge: false }>(),
    supabase
      .from("contact_messages")
      .select("id, client_id, name, business_name, phone, services, message, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10)
      .overrideTypes<ContactMessage[], { merge: false }>(),
    loadDemoActivity(supabase),
  ]);

  const err = [clientRows, projects, due, comms, mockups, messages].find((r) => r.error)?.error;
  if (err) return <DbError error={err} />;

  const byStatus = new Map<ProjectStatus, number>();
  (projects.data ?? []).forEach((p) => byStatus.set(p.status, (byStatus.get(p.status) ?? 0) + 1));
  const openProjects = (projects.data ?? []).filter((p) => !CLOSED_PROJECT_STATUSES.includes(p.status)).length;
  const maxCount = Math.max(1, ...Array.from(byStatus.values()));

  const dueRows = due.data ?? [];
  const overdue = dueRows.filter((d) => d.due_date! < today);
  const upcoming = dueRows.filter((d) => d.due_date! >= today);
  const dueThisWeek = upcoming.filter((d) => d.due_date! <= weekEnd).length;

  const stageCounts = new Map<ClientStage, number>();
  (clientRows.data ?? []).forEach((c) => {
    const s = normalizeStage(c.status);
    stageCounts.set(s, (stageCounts.get(s) ?? 0) + 1);
  });

  const stats = [
    { label: "Open projects", value: openProjects, href: "/admin/projects?open=1", tone: "bg-note-teal" },
    { label: "Due this week", value: dueThisWeek, href: "#due", tone: "bg-white" },
    { label: "Overdue", value: overdue.length, href: "#due", tone: overdue.length ? "bg-mk-red/10" : "bg-white" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle={`Today is ${fmtDay(today)} (New York time)`} />

      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {CLIENT_STATUSES.map((s) => (
          <Link key={s} href={`/admin/clients?status=${s}`} className={`adm-card ${TONE[s] ?? "bg-white"} p-4 transition hover:-translate-y-0.5`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/60">{STAGE_COLUMN[s]}</p>
            <p className="mt-1 font-display text-3xl font-bold tabular-nums">{stageCounts.get(s) ?? 0}</p>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`adm-card ${s.tone} p-4 transition hover:-translate-y-0.5`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/60">{s.label}</p>
            <p className={`mt-1 font-display text-3xl font-bold tabular-nums ${s.label === "Overdue" && s.value ? "text-mk-red" : ""}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      <Card title="Projects by status" className="mt-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {PROJECT_STATUSES.map((s) => {
            const n = byStatus.get(s) ?? 0;
            return (
              <Link key={s} href={`/admin/projects?status=${s}`} className="group rounded-xl border border-ink/[0.08] bg-white p-3 hover:border-ink/30">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-ink/70">{PROJECT_STATUS_LABEL[s]}</span>
                  <span className="font-display text-xl font-bold tabular-nums">{n}</span>
                </div>
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
                  <span className="block h-full rounded-full bg-teal-ink" style={{ width: `${(n / maxCount) * 100}%` }} />
                </span>
              </Link>
            );
          })}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div id="due" className="scroll-mt-20">
          <Card title="Deliverables: overdue and due in the next 7 days">
            {dueRows.length === 0 ? (
              <Empty>Nothing due this week. Nice.</Empty>
            ) : (
              <ul className="space-y-2">
                {[...overdue, ...upcoming].map((d) => {
                  const late = d.due_date! < today;
                  return (
                    <li key={d.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-ink/[0.07] bg-white/70 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{d.title}</p>
                        <p className="text-xs text-ink/60">
                          {d.projects ? (
                            <Link href={`/admin/projects/${d.projects.id}`} className="font-semibold hover:underline">
                              {d.projects.name}
                            </Link>
                          ) : (
                            "Project"
                          )}
                          {d.projects?.clients && (
                            <>
                              {" · "}
                              <Link href={`/admin/clients/${d.projects.clients.id}`} className="hover:underline">
                                {d.projects.clients.business_name}
                              </Link>
                            </>
                          )}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold ${late ? "text-mk-red" : "text-ink/65"}`}>
                        {late ? "Overdue · " : "Due "}
                        {fmtDay(d.due_date)}
                      </span>
                      <ActionButton run={setDeliverableStatus.bind(null, d.id, "done")} className="adm-btn !px-3 !py-1 text-xs" pendingLabel="Saving…">
                        ✓ Mark done
                      </ActionButton>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        <Card title="Recent communications">
          {(comms.data ?? []).length === 0 ? (
            <Empty>No communications yet.</Empty>
          ) : (
            <ul className="divide-y divide-ink/[0.07]">
              {(comms.data ?? []).map((c) => (
                <li key={c.id} className="flex items-start gap-3 py-2.5">
                  <ChannelIcon channel={c.channel} />
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap gap-x-2 text-xs text-ink/60">
                      <span className="font-semibold text-ink">{CHANNEL_LABEL[c.channel]}</span>
                      {c.direction && <span>{c.direction === "in" ? "Incoming" : "Outgoing"}</span>}
                      {c.clients && (
                        <Link href={`/admin/clients/${c.clients.id}`} className="font-semibold text-teal-ink hover:underline">
                          {c.clients.business_name}
                        </Link>
                      )}
                    </p>
                    <p className="truncate text-sm">{c.summary || c.body || <span className="text-ink/45">No summary</span>}</p>
                  </div>
                  <time className="shrink-0 text-xs text-ink/55">{fmtDateTime(c.occurred_at)}</time>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card
        title="Demo activity"
        className="mt-6"
        actions={
          demo.hot.length ? (
            <p className="flex flex-wrap items-center gap-1.5 text-xs">
              {demo.hot.map((h) => (
                <Link key={h.id} href={`/admin/clients/${h.id}`} className="inline-flex items-center gap-1 rounded-full bg-mk-red/10 px-2 py-0.5 font-semibold text-mk-red hover:underline">
                  🔥 {h.name} · {h.views}
                </Link>
              ))}
            </p>
          ) : null
        }
      >
        {demo.error ? (
          <p role="alert" className="text-sm text-mk-red">
            Couldn&apos;t load demo views.
          </p>
        ) : demo.recent.length === 0 ? (
          <Empty>No demo views yet.</Empty>
        ) : (
          <ul className="divide-y divide-ink/[0.07]">
            {demo.recent.map((v, i) => (
              <li key={`${v.viewed_at}-${i}`} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 py-2">
                <span className="min-w-0 flex-1 truncate text-sm">
                  {v.client_id ? (
                    <Link href={`/admin/clients/${v.client_id}`} className="font-semibold text-teal-ink hover:underline">
                      {v.clientName ?? "Unknown client"}
                    </Link>
                  ) : (
                    <span className="font-semibold">{v.slug}</span>
                  )}
                  {v.hot && <span className="ml-2 rounded-full bg-mk-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Hot</span>}
                  <span className="ml-2 text-xs text-ink/55">
                    {v.device ?? "unknown"} · {referrerLabel(v.referrer)}
                  </span>
                </span>
                <time className="shrink-0 text-xs text-ink/55" dateTime={v.viewed_at} title={fmtDateTime(v.viewed_at)}>
                  {fmtRelative(v.viewed_at)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="New mockup requests (14 days)">
          {(mockups.data ?? []).length === 0 ? (
            <Empty>No new mockup requests.</Empty>
          ) : (
            <ul className="divide-y divide-ink/[0.07]">
              {(mockups.data ?? []).map((m) => (
                <IntakeRow
                  key={m.id}
                  href={m.client_id ? `/admin/clients/${m.client_id}#intake` : null}
                  title={m.business_name || m.contact_name || "Mockup request"}
                  sub={[m.contact_name, m.industry, m.town, m.timeline].filter(Boolean).join(" · ")}
                  tag={m.retell_call_id ? "Phone (Mindy)" : "Web form"}
                  when={fmtDateTime(m.created_at)}
                />
              ))}
            </ul>
          )}
        </Card>
        <Card title="New contact messages (14 days)">
          {(messages.data ?? []).length === 0 ? (
            <Empty>No new contact messages.</Empty>
          ) : (
            <ul className="divide-y divide-ink/[0.07]">
              {(messages.data ?? []).map((m) => (
                <IntakeRow
                  key={m.id}
                  href={m.client_id ? `/admin/clients/${m.client_id}#intake` : null}
                  title={m.business_name || m.name || "Contact message"}
                  sub={m.message ?? (m.services ?? []).join(", ")}
                  tag={(m.services ?? []).slice(0, 2).join(", ") || "Contact form"}
                  when={fmtDateTime(m.created_at)}
                />
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function IntakeRow({ href, title, sub, tag, when }: { href: string | null; title: string; sub: string; tag: string; when: string }) {
  const inner = (
    <>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        {sub && <p className="truncate text-xs text-ink/60">{sub}</p>}
      </div>
      <div className="shrink-0 text-right">
        <Badge value="lead" label={tag} />
        <p className="mt-1 text-xs text-ink/55">{when}</p>
      </div>
    </>
  );
  return <li className="py-2.5">{href ? <Link href={href} className="flex items-center gap-3 hover:opacity-80">{inner}</Link> : <div className="flex items-center gap-3">{inner}</div>}</li>;
}
