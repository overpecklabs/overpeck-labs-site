import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { RECEPTIONIST_PHONE as DEMO_LINE } from "@/flagships/overpeck-electric/phone";

// Only published posts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  const title = `${post.title} | Overpeck Labs`;
  return {
    title: { absolute: title },
    description: post.description,
    alternates: { canonical: path },
    openGraph: { title, description: post.description, url: path, siteName: SITE_NAME, type: "article", locale: "en_US", publishedTime: post.date },
    twitter: { card: "summary", title, description: post.description },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
  return (
    <>
      <Nav />
      <main className="relative px-5 pb-20 pt-28">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\u003c") }} />
        <article className="paper mx-auto max-w-3xl rounded-md px-6 py-10 sm:px-10">
          <p className="text-sm">
            <Link href="/blog" className="font-semibold text-teal-ink hover:underline">
              ← Blog
            </Link>
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold text-ink">{post.title}</h1>
          <p className="mt-2 text-sm text-ink/75">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
          {/* Markdown from content/blog (written by us, in the repo) */}
          <div
            className="mt-8 space-y-5 text-[16px] leading-relaxed text-ink/90 [&_a]:font-semibold [&_a]:text-teal-ink [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-ink/20 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-ink/5 [&_code]:px-1 [&_h2]:font-display [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_img]:rounded-md [&_li]:ml-5 [&_ol>li]:list-decimal [&_ol]:space-y-1.5 [&_ul>li]:list-disc [&_ul]:space-y-1.5"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <aside className="mt-12 rounded-md border-2 border-dashed border-ink/25 bg-white/70 px-6 py-7 text-center">
            <p className="font-display text-2xl font-bold text-ink">
              Test it out for yourself. Call{" "}
              <a href={DEMO_LINE.tel} className="whitespace-nowrap text-teal-ink underline underline-offset-4 hover:no-underline">
                {DEMO_LINE.display}
              </a>
              .
            </p>
            <Link href="/free-mockup" className="btn-primary mt-5 inline-flex">
              Get my free homepage design
            </Link>
          </aside>
        </article>
      </main>
      <Footer />
    </>
  );
}
