"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createClientAction, updateClientAction } from "@/app/admin/actions";
import { CLIENT_STATUS_LABEL } from "@/lib/admin/labels";
import { CLIENT_STATUSES, type Client } from "@/lib/admin/types";
import { ActionError } from "./controls";

export default function ClientForm({ client }: { client?: Client }) {
  const [state, action, pending] = useActionState(client ? updateClientAction : createClientAction, null);
  const v = (k: keyof Client) => (client?.[k] as string | null | undefined) ?? "";

  return (
    <form action={action} className="adm-card space-y-5 p-5 sm:p-6">
      {client && <input type="hidden" name="id" value={client.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="adm-label" htmlFor="business_name">
            Business name *
          </label>
          <input id="business_name" name="business_name" required maxLength={200} defaultValue={v("business_name")} className="adm-input" />
        </div>
        <div>
          <label className="adm-label" htmlFor="contact_name">
            Contact name
          </label>
          <input id="contact_name" name="contact_name" maxLength={200} defaultValue={v("contact_name")} className="adm-input" />
        </div>
        <div>
          <label className="adm-label" htmlFor="status">
            Status
          </label>
          <select id="status" name="status" defaultValue={client?.status ?? "lead"} className="adm-input">
            {CLIENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {CLIENT_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="adm-label" htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" maxLength={40} defaultValue={v("phone")} className="adm-input" />
        </div>
        <div>
          <label className="adm-label" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" maxLength={200} defaultValue={v("email")} className="adm-input" />
        </div>
        <div>
          <label className="adm-label" htmlFor="industry">
            Industry
          </label>
          <input id="industry" name="industry" maxLength={100} defaultValue={v("industry")} className="adm-input" placeholder="e.g. Plumbing" />
        </div>
        <div>
          <label className="adm-label" htmlFor="town">
            Town
          </label>
          <input id="town" name="town" maxLength={100} defaultValue={v("town")} className="adm-input" />
        </div>
        <div>
          <label className="adm-label" htmlFor="website">
            Website
          </label>
          <input id="website" name="website" maxLength={300} defaultValue={v("website")} className="adm-input" placeholder="example.com" />
        </div>
        <div>
          <label className="adm-label" htmlFor="google_profile">
            Google Business Profile
          </label>
          <input id="google_profile" name="google_profile" maxLength={500} defaultValue={v("google_profile")} className="adm-input" placeholder="Link to the profile" />
        </div>
        <div>
          <label className="adm-label" htmlFor="demo_slug">
            Demo slug
          </label>
          <input
            id="demo_slug"
            name="demo_slug"
            maxLength={80}
            defaultValue={v("demo_slug")}
            className="adm-input font-mono"
            placeholder="e.g. mains-and-drains"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Lowercase letters, numbers and hyphens"
            autoCapitalize="none"
            spellCheck={false}
            aria-describedby="demo_slug_hint"
          />
          <p id="demo_slug_hint" className="mt-1 text-xs text-ink/55">
            Their private demo at /demo/&lt;slug&gt;. Views are matched to this client by it.
          </p>
        </div>
        <div>
          <label className="adm-label" htmlFor="source">
            Source
          </label>
          <input id="source" name="source" maxLength={100} defaultValue={v("source")} className="adm-input" placeholder="e.g. referral, website, call" />
        </div>
        <div className="sm:col-span-2">
          <label className="adm-label" htmlFor="notes">
            Notes
          </label>
          <textarea id="notes" name="notes" rows={5} defaultValue={v("notes")} className="adm-input" />
        </div>
      </div>
      <ActionError error={state && !state.ok ? state.error : null} />
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="adm-btn" disabled={pending}>
          {pending ? "Saving…" : client ? "Save changes" : "Add client"}
        </button>
        <Link href={client ? `/admin/clients/${client.id}` : "/admin/clients"} className="adm-btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
