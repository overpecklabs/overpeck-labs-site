import Chapter from "../Chapter";
import ChapterCopy from "../ChapterCopy";

export default function Tracking() {
  return (
    <Chapter index={3} id="tracking" bridge="Now that we can see everything… let’s fill the gaps with AI." className="items-start sm:items-center">
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 sm:pt-0">
        <ChapterCopy
          kicker="03 · Track, Monitor & Optimize"
          annotation="no guesswork"
          title={<>We watch it, so you don&apos;t have to.</>}
          points={[
            "Calls, forms and search rankings tracked in one place",
            "Site health monitored, with problems fixed fast",
            "New opportunities flagged as we find them",
          ]}
          note="The dashboard shows example data, not client results."
        />
      </div>
    </Chapter>
  );
}
