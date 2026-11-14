export default function ChapterCopy({
  kicker,
  title,
  points,
  note,
  children,
}: {
  kicker: string;
  title: React.ReactNode;
  points?: string[];
  note?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="glass max-w-md rounded-3xl p-5 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-teal">{kicker}</p>
      <h2 className="font-display mt-2 text-[1.7rem] font-bold leading-tight sm:mt-3 sm:text-4xl">{title}</h2>
      {points && (
        <ul className="mt-4 space-y-2 text-sm text-white/75 sm:mt-5 sm:space-y-2.5 sm:text-base">
          {points.map((p) => (
            <li key={p} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet shadow-[0_0_8px_#9b6bff]" />
              {p}
            </li>
          ))}
        </ul>
      )}
      {children}
      {note && <p className="mt-4 text-xs text-white/45 sm:mt-5">{note}</p>}
    </div>
  );
}
