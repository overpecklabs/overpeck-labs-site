import Chapter from "../Chapter";
import ChapterCopy from "../ChapterCopy";

export default function Workflows() {
  return (
    <Chapter length={2.6} index={2} id="workflows" bridge="Now that it runs itself… let’s measure what’s working." className="items-start sm:items-center">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-4 px-5 pt-20 sm:pt-0 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-12">
        <ChapterCopy
          num="02"
          label="Automate"
          href="/services/workflows-automation"
          kicker="02 · Workflows & Automation"
          annotation="lab-tested systems"
          title={<>The busywork runs itself.</>}
          points={[
            "Instant follow-ups for every call and form",
            "Booking confirmations and invoice reminders",
            "Review requests sent automatically after each job",
          ]}
          note="Scroll: tasks flow in and check themselves off."
        />
        {/* the 3D piece sits here */}
        <div data-anchor="graph" className="h-[34vh] w-full lg:h-[62vh]" aria-hidden />
      </div>
    </Chapter>
  );
}
