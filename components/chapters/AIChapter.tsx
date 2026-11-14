import Chapter from "../Chapter";
import ChapterCopy from "../ChapterCopy";
import ChatDemo from "../ChatDemo";

export default function AIChapter() {
  return (
    <Chapter index={3} id="ai" fadeOutAt={0.92} className="items-start sm:items-center">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-5 px-5 pt-20 sm:pt-0 lg:grid-cols-2">
        <ChapterCopy
          kicker="03 · AI implementation"
          title={<>An assistant that answers at 9 p.m., too.</>}
          points={[
            "Chat and booking assistant that answers common questions and books jobs",
            "Automated follow-ups for quotes and missed calls",
            "Review requests sent after every finished job",
          ]}
        />
        <ChatDemo />
      </div>
    </Chapter>
  );
}
