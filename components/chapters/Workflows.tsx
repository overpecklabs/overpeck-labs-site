import Chapter from "../Chapter";
import ChapterCopy from "../ChapterCopy";

export default function Workflows() {
  return (
    <Chapter index={2} id="workflows" bridge="Now that it runs itself… let’s measure what’s working." className="items-start sm:items-center">
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 sm:pt-0">
        <ChapterCopy
          href="/services/workflows-automation"
          kicker="02 · Workflows & Automation"
          annotation="lab-tested systems"
          title={<>The busywork runs itself.</>}
          points={[
            "Instant follow-ups for new calls and forms",
            "Booking confirmations and invoice reminders",
            "Review requests sent automatically after each job",
          ]}
          note="Scroll: tasks flow in and check themselves off."
        />
      </div>
    </Chapter>
  );
}
