import { requireAdmin } from "@/lib/admin/auth";
import { loadClientOnboarding } from "@/lib/admin/onboarding";
import { stepRows } from "@/lib/portal/format";
import { getWizard } from "@/lib/portal/wizards";

export const dynamic = "force-dynamic";

/** Download the client's onboarding answers as JSON (admin only; runs as the signed-in admin, RLS enforced). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const { data: client } = await supabase.from("clients").select("id, business_name").eq("id", id).maybeSingle<{ id: string; business_name: string }>();
  if (!client) return new Response("Not found", { status: 404 });
  const { detail, error } = await loadClientOnboarding(supabase, id);
  if (error || !detail.onboarding) return new Response("No onboarding for this client", { status: 404 });

  const ob = detail.onboarding;
  const wizard = getWizard(ob.plan);
  const body = {
    client: { id: client.id, business_name: client.business_name },
    plan: ob.plan,
    status: ob.status,
    submitted_at: ob.submitted_at,
    completed_at: ob.completed_at,
    updated_at: ob.updated_at,
    answers: ob.answers,
    readable: wizard ? wizard.steps.filter((s) => !s.review).map((s) => ({ step: s.title, answers: stepRows(s, ob.answers).map((r) => ({ question: r.label, answer: r.value })) })) : [],
    files: detail.files.map((f) => ({ label: f.label, path: f.storage_path, mime_type: f.mime_type, size_bytes: f.size_bytes, uploaded_at: f.created_at })),
  };
  const safe = client.business_name.replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase() || "client";
  return new Response(JSON.stringify(body, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8", "content-disposition": `attachment; filename="${safe}-onboarding.json"`, "cache-control": "no-store" },
  });
}
