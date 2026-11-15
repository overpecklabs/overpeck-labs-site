import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProject } from "@/app/admin/actions";
import Composer from "@/components/admin/Composer";
import Deliverables from "@/components/admin/Deliverables";
import FilesPanel from "@/components/admin/FilesPanel";
import ProjectForm from "@/components/admin/ProjectForm";
import StatusStepper from "@/components/admin/StatusStepper";
import Timeline from "@/components/admin/Timeline";
import { ConfirmButton } from "@/components/admin/controls";
import { Badge, Card, DbError, Field, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { fmtDay, fmtMoney, nyLocalNow } from "@/lib/admin/format";
import { PROJECT_STATUS_LABEL, PROJECT_TYPE_LABEL } from "@/lib/admin/labels";
import type { Deliverable, Project } from "@/lib/admin/types";
import { loadFiles, loadTimeline } from "@/lib/admin/views";

export const metadata: Metadata = { title: "Project" };

type Row = Project & { clients: { id: string; business_name: string } | null };

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;

  const { data: project, error } = await supabase.from("projects").select("*, clients(id, business_name)").eq("id", id).maybeSingle<Row>();
  if (error?.code === "22P02") notFound();
  if (error) return <DbError error={error} />;
  if (!project) notFound();

  const [deliverables, timeline, clients, siblings] = await Promise.all([
    supabase
      .from("deliverables")
      .select("*")
      .eq("project_id", id)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true })
      .overrideTypes<Deliverable[], { merge: false }>(),
    loadTimeline(supabase, { projectId: id }),
    supabase.from("clients").select("id, business_name").order("business_name").overrideTypes<{ id: string; business_name: string }[], { merge: false }>(),
    supabase.from("projects").select("id, name").eq("client_id", project.client_id).order("created_at", { ascending: false }).overrideTypes<{ id: string; name: string }[], { merge: false }>(),
  ]);
  const firstErr = deliverables.error ?? timeline.error ?? clients.error ?? siblings.error;
  if (firstErr) return <DbError error={firstErr} />;

  const projectOptions = siblings.data ?? [];
  const files = await loadFiles(supabase, { clientId: project.client_id, projectId: id }, new Map(projectOptions.map((p) => [p.id, p.name])));
  if (files.error) return <DbError error={files.error} />;
  const clientName = project.clients?.business_name ?? "Client";
  const { clients: _omit, ...projectFields } = project;
  void _omit;

  return (
    <>
      <PageHeader
        back={{ href: `/admin/clients/${project.client_id}`, label: clientName }}
        title={project.name}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            <Link href={`/admin/clients/${project.client_id}`} className="font-semibold text-teal-ink hover:underline">
              {clientName}
            </Link>
            <span>·</span>
            <span>{PROJECT_TYPE_LABEL[project.type] ?? project.type}</span>
            <Badge value={project.status} label={PROJECT_STATUS_LABEL[project.status] ?? project.status} />
          </span>
        }
      />

      <Card title="Status" className="mb-6">
        <StatusStepper key={project.status} projectId={project.id} status={project.status} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Deliverables">
            <Deliverables projectId={project.id} items={deliverables.data ?? []} />
          </Card>

          <Card title="Log communication">
            <Composer clientId={project.client_id} projects={projectOptions} defaultProjectId={project.id} now={nyLocalNow()} />
          </Card>

          <Card title="Project communications">
            <Timeline items={timeline.items} />
          </Card>

          <Card title="Project files">
            <FilesPanel clientId={project.client_id} projects={projectOptions} defaultProjectId={project.id} files={files.files} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Summary">
            <dl className="grid grid-cols-2 gap-3">
              <Field label="Start">{fmtDay(project.start_date)}</Field>
              <Field label="Due">{fmtDay(project.due_date)}</Field>
              <Field label="Launch">{fmtDay(project.launch_date)}</Field>
              <Field label="Price">{fmtMoney(project.price)}</Field>
            </dl>
          </Card>
          <Card title="Edit project">
            <ProjectForm key={project.updated_at} project={projectFields} clients={clients.data ?? []} />
          </Card>
          <Card title="Danger zone">
            <ConfirmButton
              label="Delete project…"
              title={`Delete ${project.name}?`}
              message="This permanently deletes the project and its deliverables. It can't be undone."
              confirmLabel="Delete project"
              onConfirm={deleteProject.bind(null, project.id)}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
