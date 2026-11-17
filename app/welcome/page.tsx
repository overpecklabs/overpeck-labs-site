import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";

export const metadata: Metadata = {
  title: "Welcome to Overpeck Labs",
  robots: { index: false, follow: false },
};

const PLANS: Record<string, string> = { starter: "Starter", growth: "Growth", pro: "Pro" };

const INTAKE_ITEMS = [
  "Logo",
  "Photos",
  "Services list",
  "Service area",
  "Hours",
  "License number",
  "Domain access, if you already have a domain",
  "Links to your reviews",
];

export default async function WelcomePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.plan) ? sp.plan[0] : sp.plan;
  const planName = raw ? PLANS[raw.toLowerCase()] : undefined;
  const intakeUrl = process.env.NEXT_PUBLIC_INTAKE_URL?.trim();

  return (
    <>
      <Nav />
      <main className="relative px-5 pb-20 pt-28">
        <article className="paper mx-auto max-w-3xl rounded-md px-6 py-10 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-ink">Welcome to Overpeck Labs</p>
          <h1 className="font-display mt-3 text-4xl font-bold text-ink">Thank you, we&apos;re glad to be building your site</h1>
          {planName && (
            <p className="mt-4 text-lg text-ink/85">
              You&apos;re signed up for the <strong>{planName}</strong> plan.
            </p>
          )}

          <h2 className="font-display mt-10 text-xl font-bold text-ink">What happens next</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-ink/90">
            <li>Check your email. A welcome message from Overpeck Labs is on its way (check spam if you don&apos;t see it in a few minutes).</li>
            <li>
              <strong>Check your email for your personal onboarding link.</strong> It takes about 10 to 15 minutes, saves as you go, and the link is just for you. Already finished onboarding, or need a new
              link?{" "}
              <Link href="/portal/login" className="font-semibold text-teal-ink underline">
                Sign in to your client portal
              </Link>
              .
            </li>
            <li>We start the build and stay in touch by email. You review the site before it goes live.</li>
            <li>After launch your monthly plan continues, month to month. Cancel anytime by replying to your welcome email.</li>
          </ol>

          <section id="intake" className="mt-12 scroll-mt-28 rounded-md border-2 border-ink/15 bg-white/60 px-5 py-6">
            <h2 className="font-display text-xl font-bold text-ink">What to have handy</h2>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[15px] text-ink/90">
              {INTAKE_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {intakeUrl ? (
              <a href={intakeUrl} className="btn-primary mt-6" target="_blank" rel="noopener noreferrer">
                Open the intake form
              </a>
            ) : (
              <p className="mt-6 text-[15px] text-ink/90">Prefer email? Reply to your welcome email with these items instead.</p>
            )}
          </section>

          <p className="mt-12 text-sm text-ink/80">
            Questions? Reply to your welcome email or call{" "}
            <a href={`tel:${PHONE_TEL}`} className="font-semibold text-teal-ink underline">
              {PHONE_DISPLAY}
            </a>
          </p>
        </article>
      </main>
      <Footer hideCta />
    </>
  );
}
