import Chapter from "../Chapter";
import ChapterCopy from "../ChapterCopy";
import TrackingDashboard from "../TrackingDashboard";

export default function Tracking() {
  return (
    <Chapter
      index={3}
      id="tracking"
      length={3.6}
      fadeOutAt={0.9}
      bridgeDesktopOnly
      bridge="Now that we can see everything… let’s fill the gaps with AI."
      className="items-start lg:items-center"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-5 px-5 pt-[4.5rem] lg:grid-cols-[minmax(0,370px)_1fr] lg:gap-12 lg:pt-0">
        <ChapterCopy
          kicker="03 · Track, Monitor & Optimize"
          annotation="no guesswork"
          compactMobile
          title={<>We watch it, so you don&apos;t have to.</>}
          points={[
            "Calls, forms and search rankings tracked in one place",
            "Site health monitored, with problems fixed fast",
            "New opportunities flagged as we find them",
          ]}
          note="The dashboard shows sample data, not client results."
        />
        <TrackingDashboard />
      </div>
    </Chapter>
  );
}
