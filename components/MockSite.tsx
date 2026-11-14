import { FONTS, type Industry } from "@/lib/industries";

const ICONS: Record<string, string> = {
  wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z",
  fan: "M12 12c0-3 1-7 4-7s3 4 0 6l-4 1zm0 0c3 0 7 1 7 4s-4 3-6 0l-1-4zm0 0c0 3-1 7-4 7s-3-4 0-6l4-1zm0 0c-3 0-7-1-7-4s4-3 6 0l1 4z",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  roof: "M2 12l10-8 10 8M5 10v10h14V10M10 20v-5h4v5",
  leaf: "M5 21c0-9 6-15 16-16-1 10-7 16-16 16zM5 21l8-8",
  sparkle: "M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8zM19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z",
  car: "M3 13l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5v5h-3v-2H6v2H3zM3 13h18M7 16h.01M17 16h.01",
  scissors: "M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.1 7.9L20 20M8.1 16.1L20 4",
  fork: "M7 2v8a2 2 0 0 0 2 2v10M11 2v8a2 2 0 0 1-2 2M17 2c-2 2-2 6 0 8v12",
  tooth: "M12 5c-2-2-6-2-7 1-1 3 0 6 1 9 .5 2 1 5 2.5 5s1.5-4 3.5-4 2 4 3.5 4 2-3 2.5-5c1-3 2-6 1-9-1-3-5-3-7-1z",
  hammer: "M15 12l-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9M17.6 6.4l-3-3L11 7l3 3 1-1 3 3 3-3-3-3z",
  house: "M3 10l9-7 9 7v11h-6v-6H9v6H3z",
};

function Art({ d, className = "relative", icon = true, iconLeft = "50%" }: { d: Industry; className?: string; icon?: boolean; iconLeft?: string }) {
  return (
    <div className={`overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${d.c.g1}, ${d.c.g2})` }}>
      <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full opacity-30" style={{ background: d.c.bg }} />
      <div className="absolute -bottom-10 -left-4 h-28 w-28 rounded-full opacity-20" style={{ background: d.c.fg }} />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 opacity-25" style={{ background: `repeating-linear-gradient(90deg, ${d.c.bg} 0 2px, transparent 2px 14px)` }} />
      {icon && (
      <svg style={{ left: iconLeft }} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={ICONS[d.icon]} />
      </svg>
      )}
    </div>
  );
}

const Stars = ({ d }: { d: Industry }) => (
  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] font-semibold" style={{ background: d.c.fg + "14", color: d.c.fg }}>
    <span style={{ color: "#f5b301" }}>★★★★★</span> Sample reviews
  </span>
);

const Cta = ({ d }: { d: Industry }) => (
  <span className="inline-block rounded-md px-2.5 py-1.5 text-[9.5px] font-bold shadow-sm" style={{ background: d.c.accent, color: d.c.onAccent }}>
    {d.cta}
  </span>
);

/** A mini homepage inside a browser frame. Decorative: hidden from screen readers via the parent label. */
export default function MockSite({ d }: { d: Industry }) {
  const h = { fontFamily: FONTS[d.heading], textTransform: d.upper ? ("uppercase" as const) : undefined, letterSpacing: d.upper ? "0.02em" : undefined };
  return (
    <div className="mock-card w-[300px] shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:w-[340px]" role="img" aria-label={`Sample homepage design for ${d.name}, a fictional ${d.industry.toLowerCase()} business`}>
      {/* browser chrome */}
      <div className="flex h-7 items-center gap-1.5 bg-[#1b1e2b] px-3">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex min-w-0 items-center gap-1.5 rounded-t-md bg-[#2a2e3f] px-2 py-0.5 text-[9px] text-white/70">
          <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: d.c.accent }} />
          <span className="truncate">{d.name}</span>
        </span>
        <span className="ml-auto max-w-[96px] truncate whitespace-nowrap rounded bg-white/10 px-1.5 text-[8px] uppercase tracking-wider text-white/50">{d.industry}</span>
      </div>

      <div className="flex h-[236px] flex-col" style={{ background: d.c.bg, color: d.c.fg, fontFamily: FONTS[d.body] }}>
        {/* site nav */}
        <div className="flex items-center justify-between px-3.5 py-2">
          <div className="flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-md text-[10px] font-black" style={{ background: d.c.accent, color: d.c.onAccent }}>
              {d.name[0]}
            </span>
            <span className="text-[11px] font-bold" style={h}>
              {d.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1 w-5 rounded-full opacity-40" style={{ background: d.c.fg }} />
            ))}
            <span className="rounded-full border px-1.5 py-0.5 text-[8px] font-bold" style={{ borderColor: d.c.accent, color: d.c.accent }}>
              Call
            </span>
          </div>
        </div>

        {d.layout === "split" && (
          <div className="grid flex-1 grid-cols-[1.15fr_1fr] gap-3 px-3.5 pb-2">
            <div className="flex flex-col justify-center gap-2">
              <div className="text-[17px] font-bold leading-[1.1]" style={h}>
                {d.headline}
              </div>
              <div className="text-[9px] leading-snug" style={{ color: d.c.muted }}>
                {d.sub}
              </div>
              <div>
                <Cta d={d} />
              </div>
              <Stars d={d} />
            </div>
            <Art d={d} className="relative rounded-lg" />
          </div>
        )}

        {d.layout === "bleed" && (
          <div className="relative mx-3.5 mb-2 flex-1 overflow-hidden rounded-lg">
            <Art d={d} className="absolute inset-0" iconLeft="80%" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${d.c.bg}f2 0%, ${d.c.bg}cc 45%, transparent 80%)` }} />
            <div className="absolute right-2 top-2">
              <Stars d={d} />
            </div>
            <div className="relative flex h-full max-w-[62%] flex-col justify-center gap-2 p-3">
              <div className="text-[18px] font-bold leading-[1.05]" style={h}>
                {d.headline}
              </div>
              <div className="text-[9px] leading-snug" style={{ color: d.c.muted }}>
                {d.sub}
              </div>
              <div>
                <Cta d={d} />
              </div>
            </div>
          </div>
        )}

        {d.layout === "center" && (
          <div className="flex flex-1 flex-col items-center gap-1.5 px-4 pb-2 text-center">
            <Stars d={d} />
            <div className="text-[17px] font-bold leading-[1.1]" style={h}>
              {d.headline}
            </div>
            <div className="text-[9px]" style={{ color: d.c.muted }}>
              {d.sub}
            </div>
            <Cta d={d} />
            <div className="mt-auto grid w-full grid-cols-3 gap-1.5">
              {d.chips.map((c, i) => (
                <div key={c} className="overflow-hidden rounded-md" style={{ background: d.c.fg + "0d" }}>
                  <Art d={d} icon={false} className="relative h-5"/>
                  <div className="truncate px-1 py-0.5 text-[8px] font-semibold">{c}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {d.layout !== "center" && (
          <div className="flex gap-1.5 border-t px-3.5 py-1.5" style={{ borderColor: d.c.fg + "1a" }}>
            {d.chips.map((c) => (
              <span key={c} className="rounded-full px-2 py-0.5 text-[8px] font-semibold" style={{ background: d.c.accent + "1f", color: d.c.fg }}>
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
