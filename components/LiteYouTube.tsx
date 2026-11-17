"use client";

import { useState } from "react";

/**
 * Click-to-play YouTube player. Only the thumbnail loads with the page; the privacy-enhanced
 * (youtube-nocookie.com) player iframe is created on click, so YouTube's scripts never slow the first load.
 * 16:9, rounded, in a navy frame with a teal play button. Used by the homepage commercial and blog posts.
 */
export default function LiteYouTube({ id, title, className = "" }: { id: string; title: string; className?: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={`overflow-hidden rounded-2xl border border-[#0b1f3a]/20 bg-[#0b1f3a] p-1.5 shadow-[0_18px_40px_rgba(11,31,58,0.22)] sm:p-2 ${className}`}>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#0b1f3a]">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-none"
          >
            <img
              src={`https://i.ytimg.com/vi/${encodeURIComponent(id)}/maxresdefault.jpg`}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/45 via-transparent to-transparent" aria-hidden />
            <span
              className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#06201c]/20 bg-[#19f0d2] text-[#06201c] shadow-[0_8px_24px_rgba(11,31,58,0.4)] transition-transform duration-200 group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-white sm:h-20 sm:w-20"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 sm:h-9 sm:w-9" fill="currentColor">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
