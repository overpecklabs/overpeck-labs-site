import Link from "next/link";

/** Slim bar above every private demo so the business knows what they're looking at. Extra compact on phones. */
export default function DemoBanner({ businessName, variant = "mockup" }: { businessName: string; variant?: "mockup" | "showcase" }) {
  if (variant === "showcase")
    return (
      <div data-demo-banner className="sticky top-0 z-[100] border-b border-black/10 bg-[#1a1a1a] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-[12px] sm:py-2 sm:text-sm">
          <p className="min-w-0 leading-snug">
            <span className="font-semibold">Sample site by </span>
            <Link href="/" className="font-semibold text-[#19f0d2] hover:underline">
              Overpeck Labs
            </Link>
            <span className="hidden sm:inline">: every feature here can be built for your business</span>
          </p>
          <Link href="/free-mockup" className="shrink-0 rounded-full bg-[#19f0d2] px-3 py-1 text-[12px] font-bold text-[#06201c] hover:bg-[#3ff6dd] sm:px-4 sm:py-1.5 sm:text-[13px]">
            Get yours
          </Link>
        </div>
      </div>
    );
  return (
    <div data-demo-banner className="sticky top-0 z-[100] border-b border-black/10 bg-[#1a1a1a] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-[12px] sm:py-2 sm:text-sm">
        <p className="min-w-0 leading-snug">
          <span className="sm:hidden">Free mockup for </span>
          <span className="hidden sm:inline">Free homepage mockup for </span>
          <span className="font-semibold">{businessName}</span>
          <span className="sm:hidden"> · </span>
          <span className="hidden sm:inline">, built by </span>
          <Link href="/" className="font-semibold text-[#19f0d2] hover:underline">
            Overpeck Labs
          </Link>
        </p>
        <Link href="/#contact" className="shrink-0 rounded-full bg-[#19f0d2] px-3 py-1 text-[12px] font-bold text-[#06201c] hover:bg-[#3ff6dd] sm:px-4 sm:py-1.5 sm:text-[13px]">
          <span className="sm:hidden">Let&apos;s talk</span>
          <span className="hidden sm:inline">Like it? Let&apos;s talk</span>
        </Link>
      </div>
    </div>
  );
}
