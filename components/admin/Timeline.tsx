"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CHANNEL_LABEL } from "@/lib/admin/labels";
import type { Channel } from "@/lib/admin/types";
import { ChannelIcon, Empty } from "./ui";

export type TimelineItem = {
  id: string;
  channel: Channel;
  direction: "in" | "out" | null;
  summary: string | null;
  body: string | null;
  when: string; // pre-formatted (America/New_York)
  createdBy: string | null;
  project?: { id: string; name: string } | null;
  client?: { id: string; name: string } | null;
  call?: {
    retellUrl: string | null;
    recordingUrl: string | null;
    transcript: string | null;
    duration: string;
    nextStep: string | null;
    messageForMark: string | null;
    sentiment: string | null;
  } | null;
};

const DIR = { in: "Incoming", out: "Outgoing" } as const;

export default function Timeline({ items, showClient = false }: { items: TimelineItem[]; showClient?: boolean }) {
  const [filter, setFilter] = useState<Channel | "all">("all");
  const present = useMemo(() => Array.from(new Set(items.map((i) => i.channel))), [items]);
  const shown = filter === "all" ? items : items.filter((i) => i.channel === filter);

  if (!items.length) return <Empty>No communications yet.</Empty>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by channel">
        <button type="button" className="adm-chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          All <span className="opacity-60">{items.length}</span>
        </button>
        {present.map((c) => (
          <button key={c} type="button" className="adm-chip" aria-pressed={filter === c} onClick={() => setFilter(c)}>
            {CHANNEL_LABEL[c]} <span className="opacity-60">{items.filter((i) => i.channel === c).length}</span>
          </button>
        ))}
      </div>
      <ol className="space-y-3">
        {shown.map((i) => (
          <li key={i.id} className="flex gap-3 rounded-xl border border-ink/[0.07] bg-white/70 p-3 sm:p-4">
            <ChannelIcon channel={i.channel} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink/60">
                <span className="font-semibold text-ink">{CHANNEL_LABEL[i.channel]}</span>
                {i.direction && <span>· {DIR[i.direction]}</span>}
                <span>· {i.when}</span>
                {i.call?.duration && i.call.duration !== "—" && <span>· {i.call.duration}</span>}
                {showClient && i.client && (
                  <Link href={`/admin/clients/${i.client.id}`} className="font-semibold text-teal-ink hover:underline">
                    · {i.client.name}
                  </Link>
                )}
                {i.project && (
                  <Link href={`/admin/projects/${i.project.id}`} className="rounded-full bg-ink/5 px-2 py-0.5 font-semibold text-ink/70 hover:bg-ink/10">
                    {i.project.name}
                  </Link>
                )}
              </div>
              {i.summary && <p className="mt-1 whitespace-pre-line text-sm font-medium">{i.summary}</p>}
              {i.body && <p className="mt-1 whitespace-pre-line text-sm text-ink/75">{i.body}</p>}
              {i.call && (
                <div className="mt-2 space-y-2 text-sm">
                  {i.call.nextStep && (
                    <p>
                      <span className="font-semibold">Next step:</span> {i.call.nextStep}
                    </p>
                  )}
                  {i.call.messageForMark && (
                    <p>
                      <span className="font-semibold">Message:</span> {i.call.messageForMark}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {i.call.retellUrl && (
                      <a href={i.call.retellUrl} target="_blank" rel="noopener noreferrer" className="adm-btn-ghost !px-3 !py-1 text-xs">
                        View in Retell ↗
                      </a>
                    )}
                    {i.call.recordingUrl && (
                      <a href={i.call.recordingUrl} target="_blank" rel="noopener noreferrer" className="adm-btn-ghost !px-3 !py-1 text-xs">
                        Recording ↗
                      </a>
                    )}
                    {i.call.sentiment && <span className="adm-chip !py-1 text-xs">Sentiment: {i.call.sentiment}</span>}
                  </div>
                  {i.call.transcript && (
                    <details className="rounded-lg border border-ink/10 bg-board/60 p-2">
                      <summary className="cursor-pointer text-xs font-semibold">Transcript</summary>
                      <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap font-sans text-xs leading-relaxed text-ink/80">{i.call.transcript}</pre>
                    </details>
                  )}
                </div>
              )}
              {i.createdBy && <p className="mt-1 text-[11px] text-ink/45">by {i.createdBy}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
