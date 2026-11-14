import SmoothScroll from "@/components/SmoothScroll";
import SceneLoader from "@/components/SceneLoader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MockupOffer from "@/components/MockupOffer";
import Services from "@/components/Services";
import Websites from "@/components/chapters/Websites";
import Workflows from "@/components/chapters/Workflows";
import Tracking from "@/components/chapters/Tracking";
import AIChapter from "@/components/chapters/AIChapter";
import Industries from "@/components/Industries";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/** Thin aluminum whiteboard-frame divider between sections. */
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
        <Hero />
        <Websites />
        <Workflows />
        <Tracking />
        <AIChapter />
        <Divider />
        <Services />
        <Divider />
        <Industries />
        <Divider />
        <Process />
        <Divider />
        <Pricing />
        <Divider />
        <MockupOffer />
        <Divider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
