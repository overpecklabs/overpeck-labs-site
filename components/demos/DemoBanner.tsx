import Link from "next/link";

/** Slim bar above every private demo so the business knows what they're looking at. */
export default function DemoBanner({ businessName }: { businessName: string }) {
  return (
    <div className="sticky top-0 z-[100] border-b border-black/10 bg-[#1a1a1a] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-[13px] sm:text-sm">
        <p className="min-w-0 leading-snug">
          Free homepage mockup for <span className="font-semibold">{businessName}</span>, built by{" "}
          <Link href="/" className="font-semibold text-[#19f0d2] hover:underline">
            Overpeck Labs
          </Link>
        </p>
        <Link href="/#contact" className="shrink-0 rounded-full bg-[#19f0d2] px-3 py-1.5 text-[13px] font-bold text-[#06201c] hover:bg-[#3ff6dd] sm:px-4">
          Like it? Let&apos;s talk
        </Link>
      </div>
    </div>
  );
}
