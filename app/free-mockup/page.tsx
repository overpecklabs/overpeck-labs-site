import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MockupWizard from "@/components/MockupWizard";

export const metadata: Metadata = {
  title: "Free Website Mockup · Overpeck Labs",
  description: "Answer a few quick questions and we'll design a free custom mockup of your new website. No obligation.",
};

export default function FreeMockupPage() {
  return (
    <>
      <Nav />
      <main className="relative min-h-screen overflow-hidden bg-ink px-4 pb-20 pt-28 sm:px-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_85%_10%,rgba(155,107,255,0.18),transparent_70%),radial-gradient(45%_35%_at_10%_30%,rgba(25,240,210,0.12),transparent_70%)]" />
        <div className="relative mx-auto max-w-2xl">
          <p className="inline-flex rounded-full border border-teal/50 bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal">Free Website Mockup</p>
          <h1 className="font-display mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Tell us about your business. <span className="text-gradient">We&apos;ll design the rest.</span>
          </h1>
          <p className="mt-3 text-white/65">6 short steps, about 3 minutes. Free, with no obligation. Your answers save as you go.</p>
          <MockupWizard />
        </div>
      </main>
      <Footer />
    </>
  );
}
