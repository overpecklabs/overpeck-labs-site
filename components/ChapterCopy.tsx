import Link from "next/link";
import Annotation from "./Annotation";

/** Chapter copy: an editorial numbered heading ("01. Get Found"), short copy, one optional marker note. */
export default function ChapterCopy({
  num,
  label,
  kicker,
  title,
  points,
  note,
  annotation,
  compactMobile,
  href,
  children,
}: {
  /** "01" */
  num?: string;
  /** "Get Found" */
  label?: string;
  kicker: string;
  title: React.ReactNode;
  points?: string[];
  note?: string;
  annotation?: string;
  /** phones: show only kicker + title (room for a big set-piece below) */
  compactMobile?: boolean;
  /** "Learn more" link to the service page */
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative max-w-md rounded-md bg-board/70 p-1 sm:bg-transparent">
      {annotation && (
        <Annotation color="#d93f44" showFrom="sm" className="absolute -top-7 right-0 rotate-[4deg]" size="text-lg">
          {annotation}
        </Annotation>
      )}
      <p className="text-xs font-semibold uppercase tracking-widest text-teal-ink">{kicker}</p>
      <h2 className="mt-2 text-ink">
        {num && label && (
          <span className="block font-[family-name:var(--font-playfair)] text-[2.6rem] font-bold leading-none tracking-tight sm:text-6xl">
            {num}. {label}
          </span>
        )}
        <span className="font-display mt-3 block text-[1.45rem] font-bold leading-tight sm:text-3xl">{title}</span>
      </h2>
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
      {href && (
        <Link href={href} className="mt-4 inline-block text-sm font-semibold text-teal-ink underline-offset-4 hover:underline">
          Learn more →
        </Link>
      )}
      {note && <p className={`mt-4 text-xs text-ink/75 sm:mt-5 ${compactMobile ? "hidden sm:block" : ""}`}>{note}</p>}
    </div>
  );
}
