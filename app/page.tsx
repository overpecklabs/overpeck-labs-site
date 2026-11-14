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

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <SceneLoader />
      <Nav />
      <main className="relative z-10">
        {/* Pinned chapters (data-chapter) are transparent so the fixed 3D canvas shows through. */}
        <Hero />
        <MockupOffer />
        <Services />
        <Websites />
        <Workflows />
        <Tracking />
        <AIChapter />
        <Industries />
        <Process />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
