import { Suspense } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import SceneLoader from "@/components/SceneLoader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MockupOffer from "@/components/MockupOffer";
import Services from "@/components/Services";
import Showcase from "@/components/Showcase";
import Websites from "@/components/chapters/Websites";
import Workflows from "@/components/chapters/Workflows";
import Tracking from "@/components/chapters/Tracking";
import AIChapter from "@/components/chapters/AIChapter";
import Industries from "@/components/Industries";
import { INDUSTRY_PAGES } from "@/lib/industries-pages";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HydrateWhenNear from "@/components/HydrateWhenNear";

/** Thin aluminum whiteboard-frame divider between sections. */
/**
 * Each section is its own Suspense boundary: the server HTML is identical, but React hydrates the sections as
 * separate, interruptible units instead of one long main-thread task (much lower Total Blocking Time).
 */
const S = ({ children }: { children: React.ReactNode }) => <Suspense fallback={null}>{children}</Suspense>;
/** Below the fold: server HTML as usual, hydrated only when it nears the viewport (see HydrateWhenNear). */
const L = ({ children }: { children: React.ReactNode }) => (
  <S>
    <HydrateWhenNear>{children}</HydrateWhenNear>
  </S>
);

const Divider = () => <div className="board-bg relative z-10 px-5 py-1"><div className="board-divider" aria-hidden /></div>;

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <SceneLoader />
      <Nav />
      <main className="relative z-10">
        {/* Pinned 3D chapters (data-chapter) are transparent so the fixed canvas shows through; other sections are opaque board. */}
        {/* The journey: problem -> four building blocks -> the complete formula -> proof -> offer */}
        <S><Hero /></S>
        <S><Websites /></S>
        <L><Workflows /></L>
        <L><Tracking /></L>
        <L><AIChapter /></L>
        <Divider />
        <L><Services /></L>
        <Divider />
        <L><Showcase /></L>
        <Divider />
        <L><Industries workflowTags={Object.fromEntries(INDUSTRY_PAGES.map((i) => [i.mockup, i.workflow.title]))} /></L>
        <Divider />
        <L><Process /></L>
        <Divider />
        <L><Pricing /></L>
        <Divider />
        <L><MockupOffer /></L>
        <Divider />
        <L><Contact /></L>
      </main>
      <L><Footer /></L>
    </>
  );
}
