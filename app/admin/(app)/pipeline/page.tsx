import type { Metadata } from "next";
import PipelineBoard, { type PipelineCard } from "@/components/admin/PipelineBoard";
import { DbError, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { CLOSED_PROJECT_STATUSES, normalizeStage } from "@/lib/admin/labels";
import type { Client, ProjectStatus } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Pipeline" };

type Row = Pick<Client, "id" | "business_name" | "industry" | "town" | "phone" | "status" | "board_position" | "status_changed_at" | "created_at"> & {
  projects: { status: ProjectStatus }[];
  communications: { occurred_at: string }[];
};

export default async function PipelinePage() {
  const { supabase } = await requireAdmin();
  const since7 = new Date(Date.now() - 7 * 86400000).toISOString();

  const [clients, views] = await Promise.all([
    supabase
      .from("clients")
      .select("id, business_name, industry, town, phone, status, board_position, status_changed_at, created_at, projects(status), communications(occurred_at)")
      .order("occurred_at", { referencedTable: "communications", ascending: false })
      .limit(1, { referencedTable: "communications" })
      .limit(5000)
      .overrideTypes<Row[], { merge: false }>(),
    supabase.from("demo_views").select("client_id, viewed_at").gte("viewed_at", since7).not("client_id", "is", null).limit(20000).overrideTypes<{ client_id: string; viewed_at: string }[], { merge: false }>(),
  ]);
  if (clients.error) return <DbError error={clients.error} />;

  // Demo views are optional context: if they can't be read, the board still works.
  const now = Date.now();
  const cutoff48 = now - 48 * 3600000;
  const v7 = new Map<string, number>();
  const v48 = new Map<string, number>();
  for (const v of views.data ?? []) {
    v7.set(v.client_id, (v7.get(v.client_id) ?? 0) + 1);
    if (new Date(v.viewed_at).getTime() >= cutoff48) v48.set(v.client_id, (v48.get(v.client_id) ?? 0) + 1);
  }

  const cards: PipelineCard[] = (clients.data ?? []).map((c) => ({
    id: c.id,
    name: c.business_name,
    industry: c.industry,
    town: c.town,
    phone: c.phone,
    stage: normalizeStage(c.status),
    position: c.board_position ?? 0,
    createdAt: c.created_at,
    lastContact: c.communications[0]?.occurred_at ?? null,
    views7: v7.get(c.id) ?? 0,
    hot: (v48.get(c.id) ?? 0) >= 3,
    openProjects: c.projects.filter((p) => !CLOSED_PROJECT_STATUSES.includes(p.status)).length,
    daysInStage: Math.max(0, Math.floor((now - new Date(c.status_changed_at ?? c.created_at).getTime()) / 86400000)),
  }));

  return (
    <>
      <PageHeader title="Pipeline" subtitle="Drag cards between stages. Click a card to open the client." />
      <PipelineBoard cards={cards} viewsError={!!views.error} />
    </>
  );
}
