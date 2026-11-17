import "server-only";
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

/**
 * Blog posts are Markdown files in content/blog/*.md with a frontmatter block:
 *
 *   ---
 *   title: "Post title"
 *   slug: "post-title"          (optional: defaults to the file name)
 *   description: "One or two sentences for the index, search results and social cards."
 *   date: "2026-11-18"
 *   youtubeId: ""               (optional: a YouTube video ID renders a click-to-play player at the top)
 *   published: true             (anything else never renders; the older `status: published` also works)
 *   ---
 *
 * A post shows only when it's published AND its date is on or before today in America/New_York, so posts can be
 * committed ahead of time and appear on their date (the blog pages revalidate hourly). HTML comments in the body
 * are notes for us and are stripped. Files starting with "_" are templates and are skipped.
 */

export type PostMeta = { slug: string; title: string; date: string; description: string; youtubeId: string };
export type Post = PostMeta & { html: string };

const DIR = path.join(process.cwd(), "content", "blog");

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.replace(/^﻿/, "").match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    else v = v.replace(/\s+#.*$/, ""); // trailing comment on an unquoted value
    meta[kv[1].toLowerCase()] = v;
  }
  return { meta, body: m[2] };
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const YT_RE = /^[A-Za-z0-9_-]{11}$/;

/** Every published post in the folder, regardless of date (parsed once per server instance). */
function load(): Post[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  } catch {
    return [];
  }
  const posts: Post[] = [];
  for (const f of files) {
    const { meta, body } = parseFrontmatter(fs.readFileSync(path.join(DIR, f), "utf8"));
    if (meta.published?.toLowerCase() !== "true" && meta.status?.toLowerCase() !== "published") continue;
    const slug = (meta.slug || f.replace(/\.md$/, "")).toLowerCase();
    const date = (meta.date ?? "").slice(0, 10);
    const youtubeId = meta.youtubeid ?? "";
    if (!meta.title || !DATE_RE.test(date) || Number.isNaN(Date.parse(date)) || !SLUG_RE.test(slug)) {
      console.warn(`[blog] skipping ${f}: needs a title, a YYYY-MM-DD date and a lowercase-hyphen slug`);
      continue;
    }
    if (youtubeId && !YT_RE.test(youtubeId)) console.warn(`[blog] ${f}: ignoring invalid youtubeId "${youtubeId}"`);
    const html = marked.parse(body.replace(/<!--[\s\S]*?-->\s*/g, ""), { async: false }) as string;
    posts.push({ slug, title: meta.title, date, description: meta.description ?? "", youtubeId: YT_RE.test(youtubeId) ? youtubeId : "", html });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

let cache: Post[] | null = null;

/** Today's date (YYYY-MM-DD) in New Jersey. */
const todayNY = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

/** Published posts dated today or earlier. The date check runs on every call, so scheduled posts appear on their day. */
const visible = () => {
  const today = todayNY();
  return (cache ??= load()).filter((p) => p.date <= today);
};

export const getPosts = (): PostMeta[] => visible().map(({ html: _html, ...meta }) => meta);
export const getPost = (slug: string): Post | undefined => visible().find((p) => p.slug === slug);

/** "November 18, 2026" (dates are calendar dates, so format in UTC to avoid an off-by-one). */
export const formatDate = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
