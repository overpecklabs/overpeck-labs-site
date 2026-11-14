/**
 * A sparing handwritten marker note (max 1-2 per section). Decorative, so hidden from
 * screen readers; colors are AA on the board (#d93f44 red, #1f6feb blue, #237a34 green).
 */
const ARROWS = {
  left: "M54 22 C40 26 22 22 8 12 M6 24 L7 11 L19 9",
  right: "M4 22 C18 26 36 22 50 12 M38 9 L51 11 L50 24",
  down: "M30 4 C34 18 30 32 22 46 M14 38 L22 47 L31 41",
  up: "M22 46 C18 32 22 18 30 4 M20 12 L30 3 L36 15",
};

type Props = {
  children: React.ReactNode;
  color?: string;
  arrow?: keyof typeof ARROWS;
  arrowFirst?: boolean;
  className?: string;
  size?: string;
  /** hide below this breakpoint (keeps phones uncluttered) */
  showFrom?: "sm" | "md" | "lg";
};

const DISPLAY = { all: "inline-flex", sm: "hidden sm:inline-flex", md: "hidden md:inline-flex", lg: "hidden lg:inline-flex" };

export default function Annotation({ children, color = "#d93f44", arrow, arrowFirst, className = "", size = "text-xl", showFrom }: Props) {
  const svg = arrow ? (
    <svg width="58" height="50" viewBox="0 0 58 50" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d={ARROWS[arrow]} />
    </svg>
  ) : null;
  return (
    <span aria-hidden className={`font-marker pointer-events-none select-none items-center gap-1 ${DISPLAY[showFrom ?? "all"]} ${size} ${className}`} style={{ color }}>
      {arrowFirst && svg}
      <span>{children}</span>
      {!arrowFirst && svg}
    </span>
  );
}
