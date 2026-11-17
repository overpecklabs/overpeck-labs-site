import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MockupWizard from "@/components/MockupWizard";

export const metadata: Metadata = pageMeta({
  title: "Free Website Mockup for Bergen County Businesses | Overpeck Labs",
  description: "Answer a few quick questions and we'll design a free custom mockup of your new website. No obligation.",
  path: "/free-mockup",
});

export default function FreeMockupPage() {
  return (
    <>
      <Nav />
      {/* Plain off-white surface: no whiteboard/lab background behind the form. */}
      <main className="min-h-screen bg-[#f8f8f5] px-4 pb-32 pt-24 sm:px-5 sm:pb-24 sm:pt-28">
        <div className="mx-auto max-w-[560px] text-center">
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">Get a free homepage mockup</h1>
          <p className="mt-2 text-[17px] text-ink/70">About 2 minutes. Free, no obligation. Your answers save as you go.</p>
        </div>
        <div className="mt-4">
          <MockupWizard />
        </div>
      </main>
      <Footer hideCta />
    </>
  );
}
