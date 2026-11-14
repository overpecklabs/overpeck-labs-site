import Chapter from "../Chapter";
import ChapterCopy from "../ChapterCopy";

export default function Websites() {
  return (
    <Chapter index={1} id="websites" className="items-start sm:items-center">
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 sm:pt-0">
        <ChapterCopy
          kicker="01 · Websites That Win Business"
          title={<>Built to bring in jobs, not just look good.</>}
          points={[
            "Designed from scratch for your trade and your towns",
            "Tap-to-call, quote forms and booking right up front",
            "Fast, mobile-first and set up for local search",
          ]}
          note="Scroll: a sample site assembles itself. Illustrative layout."
        />
      </div>
    </Chapter>
  );
}
