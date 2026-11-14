import Annotation from "./Annotation";

/** Copy card for a 3D chapter: a pinned paper card with one optional marker note. */
export default function ChapterCopy({
  kicker,
  title,
  points,
  note,
  annotation,
  compactMobile,
  children,
}: {
  kicker: string;
  title: React.ReactNode;
  points?: string[];
  note?: string;
  annotation?: string;
  /** phones: show only kicker + title (room for a big set-piece below) */
  compactMobile?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="paper tilt-l relative max-w-md rounded-md p-5 sm:p-8">
      <span className="tape" />
      {annotation && (
        <Annotation color="#d93f44" showFrom="sm" className="absolute -right-3 -top-8 rotate-[4deg]" size="text-lg">
          {annotation}
        </Annotation>
      )}
      <p className="text-xs font-semibold uppercase tracking-widest text-teal-ink">{kicker}</p>
      <h2 className="font-display mt-2 text-[1.7rem] font-bold leading-tight text-ink sm:mt-3 sm:text-4xl">{title}</h2>
      {points && (
        <ul className={`mt-4 space-y-2 text-sm text-ink/85 sm:mt-5 sm:space-y-2.5 sm:text-base ${compactMobile ? "hidden sm:block" : ""}`}>
          {points.map((p) => (
            <li key={p} className="flex gap-3">
              <svg width="14" height="14" viewBox="0 0 24 24" className="mt-1 shrink-0" fill="none" stroke="#1f6feb" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 13 l5 5 L20 6" />
              </svg>
              {p}
            </li>
          ))}
        </ul>
      )}
      {children}
      {note && <p className={`mt-4 text-xs text-ink/75 sm:mt-5 ${compactMobile ? "hidden sm:block" : ""}`}>{note}</p>}
    </div>
  );
}
