"use client";

/**
 * Sample-content helpers shared by every client demo.
 *
 *   <SampleMark />            tiny superscript "sample" with a tooltip; put it after any unverified fact
 *                             (rates, license, insurance, years, stats, policies)
 *   <SampleTag>               the one small "Sample reviews" tag that sits on the reviews heading
 *   <RatingSummary reviews>   "4.9 ★★★★★ from 7 sample reviews"
 *   <ReviewGrid reviews>      the review cards (no per-card sample label; the heading tag covers them)
 *   <PreviewNote />           footer line: "Photos and sample content are for preview only."
 *
 * Sample content is always labeled as such. Never present it as real.
 */

import { useId } from "react";
import { Stagger, StaggerItem } from "./motion";

export const SAMPLE_TOOLTIP = "Sample text, to be replaced with your details";

export type Review = { name: string; town: string; rating: 4 | 5; text: string; service?: string };
export type Faq = { q: string; a: string; sample?: boolean };

export function SampleMark({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <sup className={`group relative ml-0.5 inline-block align-super text-[0.6em] font-semibold lowercase leading-none tracking-wide ${className}`}>
      <span tabIndex={0} aria-describedby={id} className="cursor-help opacity-55 underline decoration-dotted underline-offset-2 outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-current">
        sample
      </span>
      {/* display:none until hover/focus, so it never widens the page */}
      <span id={id} role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 hidden w-44 -translate-x-1/2 rounded-md bg-black/85 px-2 py-1 text-center text-[11px] font-medium normal-case leading-snug tracking-normal text-white shadow-lg group-hover:block group-focus-within:block">
        {SAMPLE_TOOLTIP}
      </span>
    </sup>
  );
}

export function SampleTag({ children = "Sample reviews", className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <span title={SAMPLE_TOOLTIP} className={`inline-flex items-center rounded-full border border-current/20 px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider opacity-60 ${className}`}>
      {children}
    </span>
  );
}

export function Stars({ rating, color = "#f59e0b", size = 16 }: { rating: number; color?: string; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" fill={i <= Math.round(rating) ? color : "#d6d3d1"} />
        </svg>
      ))}
    </span>
  );
}

export const averageRating = (reviews: Review[]) => Math.round((reviews.reduce((a, r) => a + r.rating, 0) / Math.max(1, reviews.length)) * 10) / 10;

export function RatingSummary({ reviews, color, className = "" }: { reviews: Review[]; color?: string; className?: string }) {
  const avg = averageRating(reviews);
  return (
    <p className={`inline-flex flex-wrap items-center justify-center gap-2 text-sm font-semibold ${className}`}>
      <span className="text-2xl font-extrabold">{avg.toFixed(1)}</span>
      <Stars rating={avg} color={color} size={18} />
      <span className="opacity-70">from {reviews.length} sample reviews</span>
    </p>
  );
}

export function ReviewGrid({ reviews, color, cardClassName = "bg-white border-stone-200" }: { reviews: Review[]; color?: string; cardClassName?: string }) {
  return (
    <Stagger className="mx-auto mt-10 max-w-6xl columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
      {reviews.map((r) => (
        <StaggerItem key={r.name + r.town} as="figure" className={`demo-lift break-inside-avoid rounded-3xl border p-6 ${cardClassName}`}>
          <Stars rating={r.rating} color={color} />
          <blockquote className="mt-3 text-[15px] leading-relaxed">&ldquo;{r.text}&rdquo;</blockquote>
          <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm">
            <span className="font-bold">
              {r.name} <span className="font-normal opacity-60">· {r.town}</span>
            </span>
            {r.service && <span className="text-xs font-semibold uppercase tracking-wider opacity-50">{r.service}</span>}
          </figcaption>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function PreviewNote({ className = "" }: { className?: string }) {
  return <p className={`text-xs opacity-60 ${className}`}>Photos and sample content are for preview only.</p>;
}
