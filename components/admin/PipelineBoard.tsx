"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createClientInStage, moveClient } from "@/app/admin/actions";
import { fmtDate, telHref } from "@/lib/admin/format";
import { STAGE_COLUMN, STAGE_HINT, STAGE_COLLAPSED } from "@/lib/admin/labels";
import { CLIENT_STATUSES, type ClientStage } from "@/lib/admin/types";
import { ActionError } from "./controls";

export type PipelineCard = {
  id: string;
  name: string;
  industry: string | null;
  town: string | null;
  phone: string | null;
  stage: ClientStage;
  position: number;
  createdAt: string;
  lastContact: string | null;
  views7: number;
  hot: boolean;
  openProjects: number;
  daysInStage: number;
};

type Columns = Record<ClientStage, PipelineCard[]>;
const COL = "col:";

function group(cards: PipelineCard[]): Columns {
  const cols = Object.fromEntries(CLIENT_STATUSES.map((s) => [s, [] as PipelineCard[]])) as Columns;
  for (const c of cards) cols[c.stage].push(c);
  for (const s of CLIENT_STATUSES) cols[s].sort((a, b) => a.position - b.position || b.createdAt.localeCompare(a.createdAt));
  return cols;
}

/** Position for the card at index i of the (already reordered) list: midway between its neighbours. */
function placeAt(list: PipelineCard[], i: number): { position: number; renumber?: { id: string; position: number }[] } {
  const prev = list[i - 1]?.position;
  const next = list[i + 1]?.position;
  if (prev === undefined && next === undefined) return { position: 0 };
  if (prev === undefined) return { position: (next as number) - 1024 };
  if (next === undefined) return { position: prev + 1024 };
  if (next - prev > 1e-6) return { position: (prev + next) / 2 };
  // Neighbours share a position (e.g. everything still at the default 0): re-space the whole column.
  const renumber = list.map((c, j) => ({ id: c.id, position: (j + 1) * 1024 }));
  return { position: (i + 1) * 1024, renumber };
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desktop;
}

/* ---------- card ---------- */

function CardBody({ c, onMove, dragging }: { c: PipelineCard; onMove?: (stage: ClientStage) => void; dragging?: boolean }) {
  const tel = telHref(c.phone);
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  return (
    <div className={`rounded-xl border bg-white p-3 text-left shadow-sm transition ${dragging ? "rotate-1 border-teal-ink shadow-lg" : "border-ink/10 hover:border-ink/25"}`}>
      <div className="flex items-start justify-between gap-2">
        <Link href={`/admin/clients/${c.id}`} className="min-w-0 font-semibold leading-snug text-ink hover:underline" onPointerDown={stop}>
          {c.name}
        </Link>
        {c.hot && <span className="shrink-0 rounded-full bg-mk-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Hot</span>}
      </div>
      {(c.industry || c.town) && <p className="mt-0.5 truncate text-xs text-ink/60">{[c.industry, c.town].filter(Boolean).join(" · ")}</p>}
      {tel && (
        <a href={tel} onPointerDown={stop} onClick={stop} className="mt-1 inline-block text-xs font-semibold text-teal-ink hover:underline">
          {c.phone}
        </a>
      )}
      <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-ink/60">
        <div>
          <dt className="sr-only">Last contact</dt>
          <dd title="Latest communication">💬 {c.lastContact ? fmtDate(c.lastContact) : "No contact yet"}</dd>
        </div>
        <div>
          <dt className="sr-only">Days in stage</dt>
          <dd title="Days in this stage">⏱ {c.daysInStage}d in stage</dd>
        </div>
        <div>
          <dt className="sr-only">Demo views, last 7 days</dt>
          <dd title="Demo views in the last 7 days">👁 {c.views7} view{c.views7 === 1 ? "" : "s"} (7d)</dd>
        </div>
        <div>
          <dt className="sr-only">Open projects</dt>
          <dd title="Open projects">
            📁 {c.openProjects} open project{c.openProjects === 1 ? "" : "s"}
          </dd>
        </div>
      </dl>
      {onMove && (
        <div className="mt-2 md:hidden" onClick={stop}>
          <label className="sr-only" htmlFor={`mv-${c.id}`}>
            Move {c.name} to…
          </label>
          <select
            id={`mv-${c.id}`}
            value=""
            onChange={(e) => e.target.value && onMove(e.target.value as ClientStage)}
            className="adm-input !py-1.5 text-xs font-semibold"
          >
            <option value="">Move to…</option>
            {CLIENT_STATUSES.filter((s) => s !== c.stage).map((s) => (
              <option key={s} value={s}>
                {STAGE_COLUMN[s]}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

function SortableCard({ c, canDrag, onMove, suppressClick }: { c: PipelineCard; canDrag: boolean; onMove: (stage: ClientStage) => void; suppressClick: React.RefObject<boolean> }) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: c.id, disabled: !canDrag });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`list-none ${isDragging ? "opacity-30" : ""} ${canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
      {...(canDrag ? attributes : {})}
      {...(canDrag ? listeners : {})}
      aria-roledescription={canDrag ? "Draggable client card" : undefined}
      onClick={(e) => {
        if (suppressClick.current || (e.target as HTMLElement).closest("a,select,button")) return;
        router.push(`/admin/clients/${c.id}`);
      }}
    >
      <CardBody c={c} onMove={onMove} />
    </li>
  );
}

/* ---------- column ---------- */

function Column({
  stage,
  cards,
  total,
  canDrag,
  collapsed,
  onToggle,
  onAdd,
  onMove,
  suppressClick,
}: {
  stage: ClientStage;
  cards: PipelineCard[];
  total: number;
  canDrag: boolean;
  collapsed: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onMove: (c: PipelineCard, stage: ClientStage) => void;
  suppressClick: React.RefObject<boolean>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: COL + stage });
  const hint = STAGE_HINT[stage];
  if (collapsed) {
    return (
      <section ref={setNodeRef} aria-label={`${STAGE_COLUMN[stage]} (collapsed)`} className={`flex w-[85vw] shrink-0 snap-start flex-col items-center gap-2 rounded-2xl border border-ink/10 bg-ink/[0.03] p-2 md:w-14 ${isOver ? "ring-2 ring-teal-ink" : ""}`}>
        <button type="button" onClick={onToggle} aria-expanded={false} className="flex w-full items-center justify-between gap-2 rounded-xl px-2 py-2 text-sm font-bold md:h-full md:flex-col md:justify-start" title={hint}>
          <span className="md:[writing-mode:vertical-rl]">{STAGE_COLUMN[stage]}</span>
          <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs tabular-nums">{total}</span>
          <span className="text-xs font-semibold text-teal-ink md:hidden">Show</span>
        </button>
      </section>
    );
  }
  return (
    <section aria-label={STAGE_COLUMN[stage]} className="flex w-[85vw] shrink-0 snap-start flex-col rounded-2xl border border-ink/10 bg-ink/[0.03] md:w-auto md:min-w-[15rem] md:flex-1">
      <header className="flex items-center justify-between gap-2 px-3 pb-2 pt-3">
        <h2 className="group relative flex items-center gap-2 text-sm font-bold">
          <span tabIndex={hint ? 0 : undefined} className={hint ? "cursor-help underline decoration-dotted decoration-ink/30 underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-ink" : undefined} aria-describedby={hint ? `hint-${stage}` : undefined}>
            {STAGE_COLUMN[stage]}
          </span>
          <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs tabular-nums">{total}</span>
          {hint && (
            <span id={`hint-${stage}`} role="tooltip" className="pointer-events-none absolute left-0 top-full z-20 mt-1 w-56 rounded-lg bg-ink px-2.5 py-1.5 text-xs font-normal text-white opacity-0 shadow-lg transition group-focus-within:opacity-100 group-hover:opacity-100">
              {hint}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-1">
          {STAGE_COLLAPSED.includes(stage) && (
            <button type="button" onClick={onToggle} aria-expanded className="rounded-full px-2 py-1 text-xs font-semibold text-ink/60 hover:bg-ink/5">
              Hide
            </button>
          )}
          <button type="button" onClick={onAdd} className="rounded-full px-2 py-1 text-xs font-bold text-teal-ink hover:bg-teal/10">
            + Add
          </button>
        </div>
      </header>
      <SortableContext id={stage} items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <ol ref={setNodeRef} className={`flex min-h-24 flex-1 flex-col gap-2 rounded-b-2xl px-2 pb-3 transition ${isOver ? "bg-teal/10" : ""}`}>
          {cards.map((c) => (
            <SortableCard key={c.id} c={c} canDrag={canDrag} onMove={(s) => onMove(c, s)} suppressClick={suppressClick} />
          ))}
          {cards.length === 0 && <li className="list-none rounded-xl border border-dashed border-ink/15 px-3 py-6 text-center text-xs text-ink/45">{total ? "No matches" : "No clients"}</li>}
        </ol>
      </SortableContext>
    </section>
  );
}

/* ---------- board ---------- */

export default function PipelineBoard({ cards, viewsError }: { cards: PipelineCard[]; viewsError: boolean }) {
  const [cols, setCols] = useState<Columns>(() => group(cards));
  useEffect(() => setCols(group(cards)), [cards]); // server truth after each revalidation
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);
  const [adding, setAdding] = useState<ClientStage | null>(null);
  const snapshot = useRef<Columns | null>(null);
  const suppressClick = useRef(false);
  const desktop = useIsDesktop();
  const query = q.trim().toLowerCase();
  const canDrag = desktop && !query;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const visible = useMemo(() => {
    if (!query) return cols;
    const match = (c: PipelineCard) => [c.name, c.town, c.industry].some((v) => v?.toLowerCase().includes(query));
    return Object.fromEntries(CLIENT_STATUSES.map((s) => [s, cols[s].filter(match)])) as Columns;
  }, [cols, query]);

  const findStage = (id: string, from: Columns = cols): ClientStage | null => {
    if (id.startsWith(COL)) return id.slice(COL.length) as ClientStage;
    return CLIENT_STATUSES.find((s) => from[s].some((c) => c.id === id)) ?? null;
  };

  const persist = async (card: PipelineCard, stage: ClientStage, list: PipelineCard[], index: number, before: Columns) => {
    const { position, renumber } = placeAt(list, index);
    // Optimistic: apply the new order/positions locally right away.
    setCols((prev) => {
      const next = { ...prev, [stage]: list.map((c, j) => (renumber ? { ...c, position: renumber[j].position } : c.id === card.id ? { ...c, position } : c)).map((c) => (c.id === card.id ? { ...c, stage } : c)) };
      return next;
    });
    const r = await moveClient({ id: card.id, stage, position, renumber });
    if (!r.ok) {
      setCols(before);
      setToast({ msg: r.error || "Couldn't move the card.", error: true });
    } else if (card.stage !== stage) {
      setToast({ msg: `${card.name} → ${STAGE_COLUMN[stage]}` });
    }
  };

  const onDragStart = (e: DragStartEvent) => {
    snapshot.current = cols;
    setActiveId(String(e.active.id));
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const from = findStage(String(active.id));
    const to = findStage(String(over.id));
    if (!from || !to || from === to) return;
    setCols((prev) => {
      const card = prev[from].find((c) => c.id === active.id);
      if (!card) return prev;
      const target = prev[to];
      const overIndex = target.findIndex((c) => c.id === over.id);
      const at = overIndex >= 0 ? overIndex : target.length;
      return { ...prev, [from]: prev[from].filter((c) => c.id !== active.id), [to]: [...target.slice(0, at), card, ...target.slice(at)] };
    });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    suppressClick.current = true;
    setTimeout(() => (suppressClick.current = false), 0);
    const before = snapshot.current ?? cols;
    snapshot.current = null;
    if (!over) return setCols(before);
    const id = String(active.id);
    const stage = findStage(id);
    const original = CLIENT_STATUSES.map((s) => before[s].find((c) => c.id === id)).find(Boolean);
    if (!stage || !original) return setCols(before);

    let list = cols[stage];
    const oldIndex = list.findIndex((c) => c.id === id);
    const overIndex = String(over.id).startsWith(COL) ? list.length - 1 : list.findIndex((c) => c.id === over.id);
    const newIndex = overIndex >= 0 ? overIndex : oldIndex;
    if (oldIndex !== newIndex) list = arrayMove(list, oldIndex, newIndex);

    const unchanged = original.stage === stage && before[stage].findIndex((c) => c.id === id) === newIndex;
    if (unchanged) return setCols(before);
    void persist(original, stage, list, newIndex, before);
  };

  const moveTo = (card: PipelineCard, stage: ClientStage) => {
    const before = cols;
    const removed = { ...cols, [card.stage]: cols[card.stage].filter((c) => c.id !== card.id) };
    const list = [...removed[stage], { ...card, stage }];
    setCols(removed);
    void persist(card, stage, list, list.length - 1, before);
  };

  const active = activeId ? CLIENT_STATUSES.flatMap((s) => cols[s]).find((c) => c.id === activeId) ?? null : null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label htmlFor="pipe-q" className="sr-only">
          Search pipeline
        </label>
        <input id="pipe-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, town or industry" className="adm-input max-w-sm" />
        {query && desktop && <p className="text-xs text-ink/55">Clear the search to drag cards.</p>}
        {viewsError && <p className="text-xs text-mk-red">Demo views couldn&apos;t be loaded.</p>}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd} onDragCancel={() => {
        if (snapshot.current) setCols(snapshot.current);
        snapshot.current = null;
        setActiveId(null);
      }}>
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:snap-none md:px-0">
          {CLIENT_STATUSES.map((s) => {
            const collapsed = STAGE_COLLAPSED.includes(s) && !open[s] && !query;
            return (
              <Column
                key={s}
                stage={s}
                cards={visible[s]}
                total={cols[s].length}
                canDrag={canDrag}
                collapsed={collapsed}
                onToggle={() => setOpen((o) => ({ ...o, [s]: !o[s] }))}
                onAdd={() => setAdding(s)}
                onMove={moveTo}
                suppressClick={suppressClick}
              />
            );
          })}
        </div>
        <DragOverlay>{active ? <CardBody c={active} dragging /> : null}</DragOverlay>
      </DndContext>

      {adding && <QuickAdd stage={adding} onClose={() => setAdding(null)} onAdded={(name) => setToast({ msg: `Added ${name} to ${STAGE_COLUMN[adding]}` })} />}

      {toast && (
        <div role={toast.error ? "alert" : "status"} className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg ${toast.error ? "bg-mk-red text-white" : "bg-ink text-white"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ---------- quick add ---------- */

function QuickAdd({ stage, onClose, onAdded }: { stage: ClientStage; onClose: () => void; onAdded: (name: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`qa-${name}`} className="adm-label">
        {label}
      </label>
      <input id={`qa-${name}`} name={name} className="adm-input" {...props} />
    </div>
  );
  return (
    <dialog ref={ref} className="adm-dialog w-full" onClose={onClose} aria-labelledby="qa-title">
      <h2 id="qa-title" className="font-display text-lg font-bold">
        Add to {STAGE_COLUMN[stage]}
      </h2>
      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const name = String(fd.get("business_name") ?? "");
          start(async () => {
            setErr(null);
            const r = await createClientInStage(stage, fd);
            if (r.ok) {
              onAdded(name);
              ref.current?.close();
            } else setErr(r.error);
          });
        }}
      >
        {field("business_name", "Business name *", { required: true, maxLength: 200, autoFocus: true })}
        <div className="grid gap-3 sm:grid-cols-2">
          {field("phone", "Phone", { type: "tel", maxLength: 40 })}
          {field("email", "Email", { type: "email", maxLength: 200 })}
          {field("industry", "Industry", { maxLength: 100 })}
          {field("town", "Town", { maxLength: 100 })}
        </div>
        <ActionError error={err} />
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="adm-btn-ghost" onClick={() => ref.current?.close()} disabled={pending}>
            Cancel
          </button>
          <button type="submit" className="adm-btn" disabled={pending}>
            {pending ? "Adding…" : "Add client"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
