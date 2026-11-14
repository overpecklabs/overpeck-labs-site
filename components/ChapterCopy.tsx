export default function ChapterCopy({
  kicker,
  title,
  points,
  children,
}: {
  kicker: string;
  title: React.ReactNode;
  points: string[];
  children?: React.ReactNode;
}) {
  return (
    <div className="glass max-w-md rounded-3xl p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-teal">{kicker}</p>
      <h2 className="font-display mt-3 text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
      <ul className="mt-5 space-y-2.5 text-sm text-white/75 sm:text-base">
        {points.map((p) => (
          <li key={p} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet shadow-[0_0_8px_#9b6bff]" />
            {p}
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}
