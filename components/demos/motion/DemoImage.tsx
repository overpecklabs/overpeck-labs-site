import Image from "next/image";

export type DemoPhoto = { src: string; alt: string } | null;

/**
 * A demo photo: next/image filling its box, lazy unless `priority` (the hero), with a subtle
 * "Placeholder photo" tag so the client knows their own photos will replace it.
 * The parent sets the size (an aspect-ratio box, or `absolute inset-0`), so there's no layout shift.
 * With no photo yet, it shows a soft gradient panel instead.
 */
export default function DemoImage({
  photo,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  className = "",
  imgClassName = "object-cover",
  tag = true,
  tagPosition = "bottom-right",
}: {
  photo: DemoPhoto;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  tag?: boolean;
  tagPosition?: "bottom-right" | "top-right" | "bottom-left";
}) {
  // Callers may position the box themselves (e.g. "absolute inset-0" for the hero); only default to relative.
  const positioning = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className) ? "" : "relative";
  const pos = { "bottom-right": "bottom-2 right-2", "top-right": "top-2 right-2", "bottom-left": "bottom-2 left-2" }[tagPosition];
  return (
    <div className={`${positioning} overflow-hidden ${className}`}>
      {photo ? (
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} loading={priority ? undefined : "lazy"} className={imgClassName} />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-stone-200 to-stone-300 text-xs font-semibold text-stone-500" role="img" aria-label="Photo coming soon">
          Photo coming soon
        </div>
      )}
      {tag && (
        <span className={`pointer-events-none absolute ${pos} z-10 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm`}>
          Placeholder photo
        </span>
      )}
    </div>
  );
}
