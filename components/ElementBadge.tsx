/** Periodic-table style element square: atomic number, big symbol, name. */
export default function ElementBadge({
  num,
  symbol,
  name,
  bg = "#fffefb",
  className = "",
  size = "md",
}: {
  num: string;
  symbol: string;
  name: string;
  bg?: string;
  className?: string;
  size?: "md" | "lg";
}) {
  const box = size === "lg" ? "h-24 w-24" : "h-[4.5rem] w-[4.5rem]";
  const sym = size === "lg" ? "text-[2.6rem]" : "text-3xl";
  return (
    <div className={`element-tile flex ${box} shrink-0 flex-col items-center justify-center ${className}`} style={{ background: bg }} aria-hidden>
      <span className="element-num !left-1.5 !top-1 text-[10px] text-ink/80">{num}</span>
      <span className={`element-symbol ${sym} mt-1 text-ink`}>{symbol}</span>
      <span className="mt-0.5 text-[8.5px] font-bold uppercase tracking-wider text-ink/80">{name}</span>
    </div>
  );
}
