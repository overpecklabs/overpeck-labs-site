import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteClient, setClientStatus, setDeliverableStatus } from "@/app/admin/actions";
import Composer from "@/components/admin/Composer";
import DemoPromptButton from "@/components/admin/DemoPromptButton";
import DemoViews from "@/components/admin/DemoViews";
import FilesPanel from "@/components/admin/FilesPanel";
import IntakeDetail from "@/components/admin/IntakeDetail";
import Timeline from "@/components/admin/Timeline";
import { ActionButton, AutoSaveSelect, ConfirmButton } from "@/components/admin/controls";
import { Badge, Card, DbError, Empty, Field, PageHeader, Progress } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { externalHref, fmtDateTime, fmtDay, fmtDuration, nyLocalNow, telHref, todayNY } from "@/lib/admin/format";
import { CLIENT_STATUS_LABEL, DELIVERABLE_STATUS_LABEL, PROJECT_STATUS_LABEL, PROJECT_TYPE_LABEL } from "@/lib/admin/labels";
import { CLIENT_STATUSES, type CallLog, type Client, type ContactMessage, type Deliverable, type MockupRequest, type Project } from "@/lib/admin/types";
import { loadDemoViews, loadFiles, loadTimeline, signLogos } from "@/lib/admin/views";

export const metadata: Metadata = { title: "Client" };

type ProjectRow = Project & { deliverables: Deliverable[] };

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;

  const { data: client, error } = await supabase.from("clients").select("*").eq("id", id).maybeSingle<Client>();
  if (error?.code === "22P02") notFound();
  if (error) return <DbError error={error} />;
  if (!client) notFound();

  const [projects, mockups, calls, messages, timeline] = await Promise.all([
    supabase.from("projects").select("*, deliverables(*)").eq("client_id", id).order("created_at", { ascending: false }).overrideTypes<ProjectRow[], { merge: false }>(),
    supabase.from("mockup_requests").select("*").eq("client_id", id).order("created_at", { ascending: false }).overrideTypes<MockupRequest[], { merge: false }>(),
    supabase
      .from("call_logs")
      .select("id, call_id, direction, start_timestamp, duration_seconds, call_summary, retell_call_url, created_at")
      .eq("client_id", id)
      .order("created_at", { ascending: false })
      .overrideTypes<Pick<CallLog, "id" | "call_id" | "direction" | "start_timestamp" | "duration_seconds" | "call_summary" | "retell_call_url" | "created_at">[], { merge: false }>(),
    supabase.from("contact_messages").select("*").eq("client_id", id).order("created_at", { ascending: false }).overrideTypes<ContactMessage[], { merge: false }>(),
    loadTimeline(supabase, { clientId: id }),
  ]);
  const firstErr = projects.error ?? mockups.error ?? calls.error ?? messages.error ?? timeline.error;
  if (firstErr) return <DbError error={firstErr} />;

  const projectRows = projects.data ?? [];
  const projectNames = new Map(projectRows.map((p) => [p.id, p.name]));
  const projectOptions = projectRows.map((p) => ({ id: p.id, name: p.name }));
  const [files, logos, demoStats] = await Promise.all([
    loadFiles(supabase, { clientId: id }, projectNames),
    signLogos(supabase, (mockups.data ?? []).map((m) => m.logo_url ?? "")),
    loadDemoViews(supabase, { clientId: id, slug: client.demo_slug }),
  ]);

  const today = todayNY();
  const openDeliverables = projectRows
    .flatMap((p) => p.deliverables.filter((d) => d.status !== "done").map((d) => ({ ...d, projectName: p.name })))
    .sort((a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999"));

  const tel = telHref(client.phone);
  const site = externalHref(client.website);
  const gbp = externalHref(client.google_profile);

  return (
    <>
      <PageHeader
        back={{ href: "/admin/clients", label: "Clients" }}
        title={client.business_name}
        subtitle={[client.contact_name, client.industry, client.town].filter(Boolean).join(" · ") || undefined}
        actions={
          <>
            <AutoSaveSelect
              key={client.status}
              label="Client status"
              value={client.status}
              options={CLIENT_STATUSES.map((s) => ({ value: s, label: CLIENT_STATUS_LABEL[s] }))}
              onSave={setClientStatus.bind(null, client.id)}
            />
            <Link href={`/admin/clients/${client.id}/edit`} className="adm-btn-ghost">
              Edit
            </Link>
          </>
        }
      />

      <div className="-mt-2 mb-6 flex flex-wrap gap-2">
        {tel && (
          <a href={tel} className="adm-btn">
            Call {client.phone}
          </a>
        )}
        {client.email && (
          <a href={`mailto:${client.email}`} className="adm-btn-ghost">
            Email
          </a>
        )}
        {site && (
          <a href={site} target="_blank" rel="noopener noreferrer" className="adm-btn-ghost">
            Website ↗
          </a>
        )}
        {gbp && (
          <a href={gbp} target="_blank" rel="noopener noreferrer" className="adm-btn-ghost">
            Google profile ↗
          </a>
        )}
        <DemoPromptButton clientId={client.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card
            title={`Projects (${projectRows.length})`}
            actions={
              <Link href={`/admin/projects/new?client=${client.id}`} className="adm-btn !py-1.5">
                + New project
              </Link>
            }
          >
            {projectRows.length === 0 ? (
              <Empty>No projects yet.</Empty>
            ) : (
              <ul className="space-y-2">
                {projectRows.map((p) => {
                  const done = p.deliverables.filter((d) => d.status === "done").length;
                  return (
                    <li key={p.id}>
                      <Link href={`/admin/projects/${p.id}`} className="flex flex-wrap items-center gap-3 rounded-xl border border-ink/[0.07] bg-white/70 p-3 hover:border-ink/25">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-xs text-ink/55">
                            {PROJECT_TYPE_LABEL[p.type] ?? p.type}
                            {p.due_date && ` · Due ${fmtDay(p.due_date)}`}
                          </p>
                        </div>
                        <Progress done={done} total={p.deliverables.length} />
                        <Badge value={p.status} label={PROJECT_STATUS_LABEL[p.status] ?? p.status} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card title={`Open deliverables (${openDeliverables.length})`}>
            {openDeliverables.length === 0 ? (
              <Empty>No open deliverables.</Empty>
            ) : (
              <ul className="space-y-2">
                {openDeliverables.map((d) => {
                  const late = d.due_date && d.due_date < today;
                  return (
                    <li key={d.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-ink/[0.07] bg-white/70 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{d.title}</p>
                        <p className="text-xs text-ink/55">
                          <Link href={`/admin/projects/${d.project_id}`} className="hover:underline">
                            {d.projectName}
                          </Link>
                          {" · "}
                          {DELIVERABLE_STATUS_LABEL[d.status]}
                          {d.due_date && <span className={late ? "font-semibold text-mk-red" : ""}>{` · ${late ? "Overdue" : "Due"} ${fmtDay(d.due_date)}`}</span>}
                        </p>
                      </div>
                      <ActionButton run={setDeliverableStatus.bind(null, d.id, "done")} className="adm-btn-ghost !px-3 !py-1 text-xs" pendingLabel="Saving…">
                        ✓ Done
                      </ActionButton>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card title="Log communication">
            <Composer clientId={client.id} projects={projectOptions} now={nyLocalNow()} />
          </Card>

          <Card title="Communications">
            <Timeline items={timeline.items} />
          </Card>

          <Card title="Files">
            <FilesPanel clientId={client.id} projects={projectOptions} files={files.files} />
          </Card>
        </div>

        <div className="space-y-6">
          <DemoViews slug={client.demo_slug} stats={demoStats} />

          <Card title="Info">
            <dl className="grid gap-3">
              <Field label="Contact">{client.contact_name}</Field>
              <Field label="Phone">{tel ? <a href={tel} className="font-semibold text-teal-ink hover:underline">{client.phone}</a> : client.phone}</Field>
              <Field label="Email">{client.email ? <a href={`mailto:${client.email}`} className="font-semibold text-teal-ink hover:underline">{client.email}</a> : null}</Field>
              <Field label="Industry">{client.industry}</Field>
              <Field label="Town">{client.town}</Field>
              <Field label="Website">{site ? <a href={site} target="_blank" rel="noopener noreferrer" className="break-all text-teal-ink hover:underline">{client.website}</a> : null}</Field>
              <Field label="Google profile">{gbp ? <a href={gbp} target="_blank" rel="noopener noreferrer" className="break-all text-teal-ink hover:underline">Open profile ↗</a> : null}</Field>
              <Field label="Status">
                <Badge value={client.status} label={CLIENT_STATUS_LABEL[client.status] ?? client.status} />
              </Field>
              <Field label="Demo slug">{client.demo_slug ? <span className="font-mono text-xs">{client.demo_slug}</span> : null}</Field>
              <Field label="Source">{client.source}</Field>
              <Field label="Added">{fmtDateTime(client.created_at)}</Field>
              <Field label="Updated">{fmtDateTime(client.updated_at)}</Field>
              <Field label="Notes">{client.notes ? <span className="whitespace-pre-line">{client.notes}</span> : null}</Field>
            </dl>
          </Card>

          <div id="intake" className="scroll-mt-20">
            <Card title={`Mockup requests (${(mockups.data ?? []).length})`}>
              {(mockups.data ?? []).length === 0 ? (
                <Empty>No mockup requests.</Empty>
              ) : (
                <ul className="space-y-2">
                  {(mockups.data ?? []).map((m, i) => (
                    <li key={m.id}>
                      <details open={i === 0} className="rounded-xl border border-ink/[0.07] bg-white/70 p-3">
                        <summary className="cursor-pointer text-sm font-semibold">
                          {fmtDateTime(m.created_at)} · {m.retell_call_id ? "Phone intake (Mindy)" : "Web form"}
                        </summary>
                        <div className="mt-3">
                          <IntakeDetail row={m} logoUrl={m.logo_url ? logos.get(m.logo_url) : null} />
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {(messages.data ?? []).length > 0 && (
            <Card title={`Contact messages (${(messages.data ?? []).length})`}>
              <ul className="space-y-2">
                {(messages.data ?? []).map((m) => (
                  <li key={m.id} className="rounded-xl border border-ink/[0.07] bg-white/70 p-3 text-sm">
                    <p className="text-xs text-ink/55">{fmtDateTime(m.created_at)}</p>
                    {(m.services ?? []).length > 0 && <p className="mt-1 text-xs font-semibold">{(m.services ?? []).join(", ")}</p>}
                    {m.message && <p className="mt-1 whitespace-pre-line">{m.message}</p>}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card title={`Calls (${(calls.data ?? []).length})`}>
            {(calls.data ?? []).length === 0 ? (
              <Empty>No calls.</Empty>
            ) : (
              <ul className="space-y-2">
                {(calls.data ?? []).map((c) => (
                  <li key={c.id} className="rounded-xl border border-ink/[0.07] bg-white/70 p-3 text-sm">
                    <p className="flex flex-wrap gap-x-2 text-xs text-ink/60">
                      <span className="font-semibold text-ink">{fmtDateTime(c.start_timestamp ?? c.created_at)}</span>
                      {c.direction && <span className="capitalize">{c.direction}</span>}
                      <span>{fmtDuration(c.duration_seconds)}</span>
                    </p>
                    {c.call_summary && <p className="mt-1">{c.call_summary}</p>}
                    {c.retell_call_url && (
                      <a href={c.retell_call_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-semibold text-teal-ink hover:underline">
                        View in Retell ↗
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Danger zone">
            <p className="mb-3 text-sm text-ink/65">Done working together? Set the status to Past to keep the history.</p>
            <ConfirmButton
              label="Delete client…"
              title={`Delete ${client.business_name}?`}
              message={
                <>
                  <p>
                    This permanently deletes the client <strong>and all of their projects, deliverables, communications and files</strong>. It can&apos;t be undone.
                  </p>
                  <p className="mt-2">Usually it&apos;s better to set the status to <strong>Past</strong> instead.</p>
                </>
              }
              confirmLabel="Delete everything"
              onConfirm={deleteClient.bind(null, client.id)}
              alternative={client.status !== "past" ? { label: "Mark as Past instead", run: setClientStatus.bind(null, client.id, "past") } : undefined}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
