import Chapter from "../Chapter";
import ChapterCopy from "../ChapterCopy";

export default function Tracking() {
  return (
    <Chapter index={3} id="tracking" className="items-start sm:items-center">
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 sm:pt-0">
        <ChapterCopy
          kicker="03 · Track, Monitor & Optimize"
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
