import Link from "next/link";
import LiteYouTube from "./LiteYouTube";

const COMMERCIAL_VIDEO_ID = "1SOgedpUTQs";
const TITLE = "A day in the life of Charlie";

/** Homepage commercial: heading, click-to-play video (see LiteYouTube) and a free homepage design CTA. */
export default function CommercialVideo() {
  return (
    <section id="commercial" aria-labelledby="commercial-title" className="board-bg relative px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 id="commercial-title" className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {TITLE}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-ink/80 sm:text-lg">
          See what can run in the background while a Bergen County electrician is on the job.
        </p>
        <p className="mt-2 text-xs font-medium text-ink/60">Charlie is a fictional sample business.</p>

        <LiteYouTube id={COMMERCIAL_VIDEO_ID} title={TITLE} className="mt-8" />

        <div className="mt-8">
          <Link href="/free-mockup" className="btn-primary">
            Get your free homepage design
          </Link>
        </div>
      </div>
    </section>
  );
}
