#!/usr/bin/env node
// Stock photos for client demos: search Pexels/Unsplash, download, convert to WebP (max 1600px wide),
// save to clients/{slug}/assets/ (+ public/demos/{slug}/), and record credits in assets/CREDITS.md.
//
// Keys live ONLY in .env.local (gitignored), never in site code:
//   PEXELS_API_KEY=...        (preferred: Pexels allows downloading and self-hosting)
//   UNSPLASH_ACCESS_KEY=...   (fallback)
//
// Usage:
//   node scripts/demo-photos.mjs search "dog walking park" [--n 12] [--source pexels|unsplash] [--orientation landscape|portrait|square]
//       Prints candidates and writes a contact sheet (HTML) you can open or screenshot to check them.
//   node scripts/demo-photos.mjs get <slug> <source>:<id> <name> --alt "What the photo shows"
//       Downloads one photo as clients/<slug>/assets/<name>.webp and adds it to CREDITS.md.
//
// Rules: no identifiable people presented as the business's staff, no other companies' logos or branded vehicles.
// Check every candidate visually before using it.

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Windows + Node 24: keep sharp single-threaded and uncached to avoid a libuv crash on exit.
sharp.cache(false);
sharp.concurrency(1);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_W = 1600;
// Search results are cached so `get` doesn't spend another API request (Unsplash demo keys: 50/hour).
const CACHE = join(tmpdir(), "demo-photos-cache.json");
const readCache = () => (existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, "utf8")) : {});
function writeCache(entries) {
  const c = readCache();
  for (const e of entries) c[e.ref] = e.detail;
  writeFileSync(CACHE, JSON.stringify(c));
}

function env() {
  const out = { ...process.env };
  const file = join(root, ".env.local");
  if (existsSync(file)) {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (m && !out[m[1]]) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return out;
}
const E = env();

function args(argv) {
  const pos = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) flags[argv[i].slice(2)] = argv[i + 1]?.startsWith("--") || argv[i + 1] === undefined ? true : argv[++i];
    else pos.push(argv[i]);
  }
  return { pos, flags };
}

function pickSource(requested) {
  if (requested === "pexels" || requested === "unsplash") return requested;
  if (E.PEXELS_API_KEY) return "pexels";
  if (E.UNSPLASH_ACCESS_KEY) return "unsplash";
  throw new Error("No photo API key. Add PEXELS_API_KEY (preferred) or UNSPLASH_ACCESS_KEY to .env.local.");
}

async function getJson(url, headers) {
  const r = await fetch(url, { headers });
  const left = r.headers.get("x-ratelimit-remaining");
  if (left !== null) console.error(`  (API requests left this hour: ${left})`);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${url.replace(/\?.*/, "")}`);
  return r.json();
}

const pexelsHeaders = () => ({ Authorization: E.PEXELS_API_KEY });
const unsplashHeaders = () => ({ Authorization: `Client-ID ${E.UNSPLASH_ACCESS_KEY}`, "Accept-Version": "v1" });

/* ---------- search ---------- */

async function search(query, { n = 12, source, orientation = "landscape" }) {
  const src = pickSource(source);
  let items = [];
  if (src === "pexels") {
    const o = orientation === "square" ? "square" : orientation;
    const j = await getJson(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${n}&orientation=${o}`, pexelsHeaders());
    items = j.photos.map((p) => ({
      ref: `pexels:${p.id}`, alt: p.alt || "", by: p.photographer, page: p.url, thumb: p.src.medium, w: p.width, h: p.height,
      detail: { source: "Pexels", license: "Pexels License", url: p.src.original, page: p.url, by: p.photographer, byUrl: p.photographer_url },
    }));
  } else {
    const o = orientation === "square" ? "squarish" : orientation;
    const j = await getJson(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${n}&orientation=${o}&content_filter=high`, unsplashHeaders());
    items = j.results
      .filter((p) => !p.premium && !p.plus)
      .map((p) => ({
        ref: `unsplash:${p.id}`, alt: p.alt_description || p.description || "", by: p.user.name, page: p.links.html, thumb: p.urls.small, w: p.width, h: p.height,
        detail: { source: "Unsplash", license: "Unsplash License", url: `${p.urls.raw}&w=${MAX_W}&fm=jpg&q=85`, page: p.links.html, by: p.user.name, byUrl: p.user.links.html, downloadLocation: p.links.download_location },
      }));
  }
  writeCache(items);
  const sheet = join(tmpdir(), `demo-photos-${query.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.html`);
  writeFileSync(
    sheet,
    `<!doctype html><meta charset="utf-8"><title>${query}</title><body style="font:12px system-ui;margin:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px">` +
      items.map((p, i) => `<figure style="margin:0"><img src="${p.thumb}" style="width:100%;aspect-ratio:4/3;object-fit:cover"><figcaption><b>${i + 1}. ${p.ref}</b><br>${p.alt.slice(0, 90)}<br>by ${p.by}</figcaption></figure>`).join("") +
      "</body>",
  );
  items.forEach((p, i) => console.log(`${String(i + 1).padStart(2)}. ${p.ref}  ${p.w}x${p.h}  by ${p.by}\n    ${p.alt.slice(0, 110)}\n    ${p.page}`));
  console.log(`\nContact sheet: ${sheet}`);
}

/* ---------- get ---------- */

async function details(ref) {
  const cached = readCache()[ref];
  if (cached) {
    // Unsplash API guideline: trigger the download endpoint for every photo actually used.
    if (cached.downloadLocation) await getJson(cached.downloadLocation, unsplashHeaders());
    return cached;
  }
  const [src, id] = ref.split(":");
  if (src === "pexels") {
    const p = await getJson(`https://api.pexels.com/v1/photos/${id}`, pexelsHeaders());
    return { source: "Pexels", license: "Pexels License", url: p.src.original, page: p.url, by: p.photographer, byUrl: p.photographer_url };
  }
  if (src === "unsplash") {
    const p = await getJson(`https://api.unsplash.com/photos/${id}`, unsplashHeaders());
    // Unsplash API guideline: trigger the download endpoint when a photo is downloaded.
    await getJson(p.links.download_location, unsplashHeaders());
    return { source: "Unsplash", license: "Unsplash License", url: `${p.urls.raw}&w=${MAX_W}&fm=jpg&q=85`, page: p.links.html, by: p.user.name, byUrl: p.user.links.html };
  }
  throw new Error(`Use <source>:<id>, e.g. pexels:12345 or unsplash:AbC123 (got "${ref}")`);
}

function upsertCredit(file, row) {
  const header = "# Photo credits\n\nPlaceholder photos for this demo, until the client sends their own. All self-hosted (never hotlinked).\n\n| File | What it shows | Source | Photographer | License |\n| --- | --- | --- | --- | --- |\n";
  let text = existsSync(file) ? readFileSync(file, "utf8") : header;
  if (!text.includes("| --- |")) text = header;
  const lines = text.split("\n").filter((l) => !l.startsWith(`| ${row.file} |`));
  const utm = row.source === "Unsplash" ? "?utm_source=overpeck_labs_demos&utm_medium=referral" : "";
  const line = `| ${row.file} | ${row.alt.replace(/\|/g, "/")} | [${row.source}](${row.page}${utm}) | [${row.by}](${row.byUrl}${utm}) | ${row.license} |`;
  const end = lines.findLastIndex((l) => l.startsWith("|"));
  lines.splice(end + 1, 0, line);
  writeFileSync(file, lines.join("\n").replace(/\n*$/, "\n"));
}

async function get(slug, ref, name, { alt = "" }) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Bad slug "${slug}"`);
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`Bad name "${name}" (lowercase letters, numbers, hyphens)`);
  if (!alt) throw new Error('Add --alt "what the photo shows"');
  const d = await details(ref);
  const r = await fetch(d.url);
  if (!r.ok) throw new Error(`Download failed: ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const assets = join(root, "clients", slug, "assets");
  const pub = join(root, "public", "demos", slug);
  mkdirSync(assets, { recursive: true });
  mkdirSync(pub, { recursive: true });
  const file = `${name}.webp`;
  const info = await sharp(buf).rotate().resize({ width: MAX_W, withoutEnlargement: true }).webp({ quality: 74 }).toFile(join(assets, file));
  copyFileSync(join(assets, file), join(pub, file));
  upsertCredit(join(assets, "CREDITS.md"), { file, alt, ...d });
  console.log(`Saved clients/${slug}/assets/${file} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB) -> /demos/${slug}/${file}`);
}

/* ---------- main ---------- */

const { pos, flags } = args(process.argv.slice(2));
try {
  if (pos[0] === "search" && pos[1]) await search(pos.slice(1).join(" "), { n: Number(flags.n) || 12, source: flags.source, orientation: flags.orientation });
  else if (pos[0] === "get" && pos[3]) await get(pos[1], pos[2], pos[3], { alt: typeof flags.alt === "string" ? flags.alt : "" });
  else {
    console.log('Usage:\n  node scripts/demo-photos.mjs search "query" [--n 12] [--source pexels|unsplash] [--orientation landscape|portrait|square]\n  node scripts/demo-photos.mjs get <slug> <source>:<id> <name> --alt "what it shows"');
    process.exitCode = 1;
  }
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exitCode = 1; // not process.exit(): exiting with open handles crashes libuv on Windows
}
