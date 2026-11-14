import SmoothScroll from "@/components/SmoothScroll";
import SceneLoader from "@/components/SceneLoader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Websites from "@/components/chapters/Websites";
import LeadGen from "@/components/chapters/LeadGen";
import AIChapter from "@/components/chapters/AIChapter";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <SceneLoader />
      <Nav />
      <main className="relative z-10">
        {/* The fixed 3D canvas shows through these four pinned chapters */}
        <div id="journey">
          <Hero />
          <Websites />
          <LeadGen />
          <AIChapter />
        </div>
        <Process />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
