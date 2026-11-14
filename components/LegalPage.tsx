import Nav from "./Nav";
import Footer from "./Footer";

/** Shared layout for simple text pages (privacy, terms). */
export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="relative px-5 pb-20 pt-28">
        <article className="paper mx-auto max-w-3xl rounded-md px-6 py-10 sm:px-10">
          <h1 className="font-display text-4xl font-bold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-ink/75">Last updated: {updated}</p>
          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink/90 [&_h2]:font-display [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
