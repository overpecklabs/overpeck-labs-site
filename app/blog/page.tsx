import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { pageMeta } from "@/lib/site";
import { formatDate, getPosts } from "@/lib/blog";

// Re-check hourly so scheduled posts appear on their date (America/New_York).
export const revalidate = 3600;

export const metadata: Metadata = pageMeta({
  title: "Blog | Overpeck Labs",
  description: "Practical tips on websites, automations and AI tools for local trades in Bergen County, NJ, from Overpeck Labs.",
  path: "/blog",
});

export default function BlogIndex() {
  const posts = getPosts();
  return (
    <>
      <Nav />
      <main className="relative px-5 pb-20 pt-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Blog</h1>
          <p className="mt-3 text-[17px] text-ink/75">Websites, automations and AI tools for local trades, in plain English.</p>

          {posts.length === 0 ? (
            <div className="paper mt-10 rounded-md px-6 py-12 text-center sm:px-10">
              <p className="font-display text-2xl font-bold text-ink">New posts every Monday, Wednesday and Friday.</p>
              <p className="mt-2 text-ink/75">Check back soon.</p>
              <Link href="/free-mockup" className="btn-primary mt-7 inline-flex">
                Get my free homepage design
              </Link>
            </div>
          ) : (
            <ul className="mt-10 space-y-5">
              {posts.map((p) => (
                <li key={p.slug}>
                  <article className="paper rounded-md px-6 py-7 transition hover:-translate-y-0.5 motion-reduce:transition-none sm:px-8">
                    <p className="text-sm text-ink/65">
                      <time dateTime={p.date}>{formatDate(p.date)}</time>
                    </p>
                    <h2 className="font-display mt-1.5 text-2xl font-bold text-ink">
                      <Link href={`/blog/${p.slug}`} className="hover:underline">
                        {p.title}
                      </Link>
                    </h2>
                    {p.description && <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{p.description}</p>}
                    <Link href={`/blog/${p.slug}`} className="mt-3 inline-block text-sm font-semibold text-teal-ink hover:underline" aria-label={`Read: ${p.title}`}>
                      Read the post →
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
