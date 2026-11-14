import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/pages/blocks";

export const metadata: Metadata = { title: "Page not found | Overpeck Labs", robots: { index: false } };

export default function NotFound() {
  return (
    <PageShell>
      <section className="board-surface px-5 pb-20 pt-32">
        <div className="paper tilt-l mx-auto max-w-xl rounded-md p-8 text-center">
          <p className="font-marker text-2xl text-mk-red">hmm, nothing here</p>
          <h1 className="font-display mt-2 text-4xl font-bold text-ink">Page not found</h1>
          <p className="mt-3 text-ink/85">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary">
              Back to home
            </Link>
            <Link href="/services" className="btn-ghost">
              Our services
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
