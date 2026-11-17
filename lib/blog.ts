import "server-only";
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

/**
 * Blog posts are Markdown files in content/blog/*.md with a frontmatter block:
 *
 *   ---
 *   title: "Post title"
 *   date: 2026-11-18
 *   description: "One or two sentences for the index, search results and social cards."
 *   slug: post-title            (optional: defaults to the file name)
 *   status: published           (anything else, e.g. draft, is never rendered)
 *   ---
 *
 * Read at build time only (the pages are prerendered). Files starting with "_" are templates and are skipped.
 */

export type PostMeta = { slug: string; title: string; date: string; description: string };
export type Post = PostMeta & { html: string };

const DIR = path.join(process.cwd(), "content", "blog");

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.replace(/^﻿/, "").match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].replace(/\s+#.*$/, "").trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    meta[kv[1].toLowerCase()] = v;
  }
  return { meta, body: m[2] };
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
    if (meta.status?.toLowerCase() !== "published") continue;
    const slug = (meta.slug || f.replace(/\.md$/, "")).toLowerCase();
    const date = meta.date && !Number.isNaN(Date.parse(meta.date)) ? meta.date : "";
    if (!meta.title || !date || !SLUG_RE.test(slug)) {
      console.warn(`[blog] skipping ${f}: needs a title, a valid date and a lowercase-hyphen slug`);
      continue;
    }
    posts.push({ slug, title: meta.title, date, description: meta.description ?? "", html: marked.parse(body, { async: false }) as string });
  }
  return posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

let cache: Post[] | null = null;
const all = () => (cache ??= load());

export const getPosts = (): PostMeta[] => all().map(({ html: _html, ...meta }) => meta);
export const getPost = (slug: string): Post | undefined => all().find((p) => p.slug === slug);

/** "November 18, 2026" (dates are calendar dates, so format in UTC to avoid an off-by-one). */
export const formatDate = (d: string) => new Date(d.length === 10 ? `${d}T00:00:00Z` : d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
