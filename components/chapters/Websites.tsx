import Chapter from "../Chapter";
import ChapterCopy from "../ChapterCopy";

export default function Websites() {
  return (
    <Chapter index={1} id="websites" className="items-start sm:items-center">
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 sm:pt-0">
        <ChapterCopy
          kicker="01 · Custom websites"
          title={<>A site built to turn visitors into calls.</>}
          points={[
            "Designed from scratch for your trade, not a recycled template",
            "Mobile-first, fast, with tap-to-call and quote forms up front",
            "Structured for local search in your Bergen County towns",
          ]}
        >
          <p className="mt-5 text-xs text-white/45">Scroll: a sample site assembles itself. Illustrative placeholder layout.</p>
        </ChapterCopy>
      </div>
    </Chapter>
  );
}
