"use client";

import { useEffect, useRef, useState } from "react";
import { FONTS, type Industry, type PeekItem } from "@/lib/industries";

const ICONS: Record<string, string> = {
  drop: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  drain: "M4 10h16M6 10v3a6 6 0 0 0 12 0v-3M9 14h.01M12 15h.01M15 14h.01",
  flame: "M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 2 1 3 3 3 3s1-3 0-7z",
  fan: "M12 12c0-3 1-7 4-7s3 4 0 6l-4 1zm0 0c3 0 7 1 7 4s-4 3-6 0l-1-4zm0 0c0 3-1 7-4 7s-3-4 0-6l4-1zm0 0c-3 0-7-1-7-4s4-3 6 0l1 4z",
  snow: "M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7",
  wind: "M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  panel: "M5 3h14v18H5zM9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z",
  plug: "M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5",
  roof: "M2 12l10-8 10 8M5 10v10h14V10M10 20v-5h4v5",
  hammer: "M15 12l-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9M17.6 6.4l-3-3L11 7l3 3 1-1 3 3 3-3-3-3z",
  gutter: "M3 6h18v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM17 11v8a2 2 0 0 1-2 2h-1",
  leaf: "M5 21c0-9 6-15 16-16-1 10-7 16-16 16zM5 21l8-8",
  sparkle: "M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8zM19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1",
  oil: "M3 14l4-5h7l3 3h3l1 3H3zM7 9V6h4M19 17v2",
  brake: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  clipboard: "M9 3h6v3H9zM6 5h12v16H6zM9 13l2 2 4-4",
  tooth: "M12 5c-2-2-6-2-7 1-1 3 0 6 1 9 .5 2 1 5 2.5 5s1.5-4 3.5-4 2 4 3.5 4 2-3 2.5-5c1-3 2-6 1-9-1-3-5-3-7-1z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  check: "M5 12l4 4 10-10",
};

const Icon = ({ name, size = 12, color, stroke = 2 }: { name: string; size?: number; color: string; stroke?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
    <path d={ICONS[name] ?? ICONS.check} />
  </svg>
);

/** Lazy photo that falls back to CSS art if it fails, so there's never a broken-image icon. */
function Photo({ src, fallback, pos, className = "" }: { src: string; fallback: string; pos?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    // catches errors that happened before hydration
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);
  return (
    <div className={`overflow-hidden ${className}`} style={{ background: fallback }}>
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
          style={{ objectPosition: pos ?? "center" }}
        />
      )}
    </div>
  );
}

function Peek({ d }: { d: Industry }) {
  const { peek, c } = d;
  const cols = peek.items.length === 2 ? "grid-cols-2" : "grid-cols-3";
  return (
    <div className="flex-1 px-3 pb-2.5 pt-1.5">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[9px] font-bold" style={{ fontFamily: FONTS[d.heading], textTransform: d.upper ? "uppercase" : undefined, letterSpacing: d.tracking }}>
          {peek.title}
        </span>
        {peek.note && (
          <span className="rounded px-1 text-[6.5px] font-semibold uppercase tracking-wider" style={{ background: c.soft, color: c.muted }}>
            {peek.note}
          </span>
        )}
      </div>
      <div className={`grid gap-1.5 ${cols}`}>
        {peek.items.map((it: PeekItem, i) => {
          if (peek.kind === "thumbs")
            return (
              <div key={it.label} className="overflow-hidden rounded-md" style={{ background: c.soft }}>
                <Photo src={it.img!} pos={it.pos} fallback={d.hero.fallback} className="h-[34px]" />
                <div className="truncate px-1.5 pt-0.5 text-[7px] font-semibold">{it.label}</div>
                {it.sub ? (
                  <div className="truncate px-1.5 pb-0.5 text-[6.5px]" style={{ color: c.muted }}>
                    {it.sub}
                  </div>
                ) : (
                  <div className="h-0.5" />
                )}
              </div>
            );
          if (peek.kind === "steps")
            return (
              <div key={it.label} className="flex items-center gap-1 rounded-md p-1.5" style={{ background: c.soft }}>
                <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full text-[7px] font-bold" style={{ background: c.accent, color: c.onAccent }}>
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[7px] font-bold">{it.label}</span>
                  <span className="block truncate text-[6px]" style={{ color: c.muted }}>
                    {it.sub}
                  </span>
                </span>
              </div>
            );
          if (peek.kind === "services")
            return (
              <div key={it.label} className="rounded-md border p-1.5" style={{ borderColor: c.accent + "55", background: c.soft }}>
                <div className="truncate text-[7.5px] font-bold">{it.label}</div>
                <div className="truncate text-[6.5px]" style={{ color: c.accent }}>
                  {it.sub}
                </div>
              </div>
            );
          return (
            <div key={it.label} className="flex items-center gap-1.5 rounded-md px-1.5 py-2" style={{ background: c.soft }}>
              <Icon name={it.icon ?? "check"} color={c.accent} size={13} />
              <span className="truncate text-[7.5px] font-semibold">{it.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** A mini homepage inside a browser frame, for a FICTIONAL business. */
export default function MockSite({ d }: { d: Industry }) {
  const { c, hero } = d;
  const head = { fontFamily: FONTS[d.heading], textTransform: d.upper ? ("uppercase" as const) : undefined, letterSpacing: d.tracking };
  const center = hero.align === "center";

  return (
    <div
      className="mock-card @container w-[300px] shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:w-[340px]"
      role="img"
      aria-label={`Sample homepage design for ${d.name}, a fictional ${d.industry.toLowerCase()} business`}
    >
      {/* browser chrome: business name only, never a URL */}
      <div className="flex h-7 items-center gap-1.5 bg-[#1b1e2b] px-3">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex min-w-0 items-center gap-1.5 rounded-t-md bg-[#2a2e3f] px-2 py-0.5 text-[9px] text-white/70">
          <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: c.accent }} />
          <span className="truncate">{d.name}</span>
        </span>
        <span className="ml-auto max-w-[96px] truncate whitespace-nowrap rounded bg-white/10 px-1.5 text-[8px] uppercase tracking-wider text-white/50">{d.industry}</span>
      </div>

      <div className="flex h-[290px] flex-col" style={{ background: c.bg, color: c.fg, fontFamily: FONTS[d.body] }}>
        {/* utility bar */}
        <div className="flex h-[17px] shrink-0 items-center justify-between gap-2 px-3 text-[7px] font-semibold" style={{ background: c.bar, color: c.barFg }}>
          <span className="truncate">{d.utility.left}</span>
          <span className="shrink-0 truncate">{d.utility.right}</span>
        </div>

        {/* header */}
        <div className="flex h-[32px] shrink-0 items-center gap-2 px-3">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md text-[7.5px] font-black" style={{ background: c.accent, color: c.onAccent, fontFamily: FONTS[d.heading] }}>
            {d.mark.icon ? <Icon name={d.mark.icon} color={c.onAccent} size={12} stroke={2.2} /> : d.mark.text}
          </span>
          <span className="min-w-0 truncate text-[10.5px] font-bold leading-none" style={head}>
            {d.name}
          </span>
          <span className="ml-auto hidden items-center gap-2 @[330px]:flex" aria-hidden>
            {d.nav.slice(0, d.name.length > 17 ? 2 : 3).map((n) => (
              <span key={n} className="whitespace-nowrap text-[7.5px] font-medium" style={{ color: c.muted }}>
                {n}
              </span>
            ))}
          </span>
          <span className="ml-auto shrink-0 whitespace-nowrap rounded px-2 py-1 text-[7.5px] font-bold @[330px]:ml-1" style={{ background: c.accent, color: c.onAccent }}>
            {d.navCta}
          </span>
        </div>

        {/* photographic hero */}
        <div className="relative h-[126px] shrink-0 overflow-hidden">
          <Photo src={hero.img} fallback={hero.fallback} className="absolute inset-0" />
          <div className="absolute inset-0" style={{ background: hero.overlay }} />
          <div className={`relative flex h-full flex-col justify-center gap-1.5 px-3 ${center ? "items-center text-center" : "max-w-[72%]"}`} style={{ color: c.heroFg }}>
            <div className="text-[15px] font-bold leading-[1.06]" style={head}>
              {hero.headline}
            </div>
            <div className="text-[8px] leading-snug opacity-85">{hero.sub}</div>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              <span className="rounded px-2.5 py-1.5 text-[8.5px] font-bold shadow-md" style={{ background: c.accent, color: c.onAccent }}>
                {hero.cta}
              </span>
              {hero.cta2 && (
                <span className="rounded border px-2.5 py-[5px] text-[8.5px] font-bold" style={{ borderColor: c.heroFg, color: c.heroFg }}>
                  {hero.cta2}
                </span>
              )}
            </div>
            {hero.pills && (
              <div className="flex gap-1">
                {hero.pills.map((p) => (
                  <span key={p} className="rounded-full border px-2 py-0.5 text-[7px] font-semibold" style={{ borderColor: c.accent, color: c.fg, background: "#ffffffcc" }}>
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* trust strip */}
        <div className="flex shrink-0 items-center gap-1 overflow-hidden whitespace-nowrap border-b px-3 py-1.5 [mask-image:linear-gradient(90deg,#000_85%,transparent)]" style={{ borderColor: c.fg + "14" }}>
          {d.trust.map((t) => (
            <span key={t} className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[6.8px] font-semibold" style={{ background: c.soft }}>
              {t === "Sample reviews" ? <span style={{ color: "#f5b301" }}>★★★★★</span> : <Icon name="check" color={c.accent} size={8} stroke={3} />}
              {t}
            </span>
          ))}
        </div>

        <Peek d={d} />
      </div>
    </div>
  );
}
