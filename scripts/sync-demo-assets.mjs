// Copies clients/{slug}/assets/* to public/demos/{slug}/ so demo images are served at /demos/{slug}/<file>.
// Runs before `next dev` and `next build`. Never deletes anything; skips _template, dotfiles and README files.
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const clients = join(root, "clients");

if (existsSync(clients)) {
  for (const slug of readdirSync(clients)) {
    if (slug.startsWith("_") || slug.startsWith(".")) continue;
    const src = join(clients, slug, "assets");
    if (!existsSync(src) || !statSync(src).isDirectory()) continue;
    const files = readdirSync(src).filter((f) => !/^readme\.md$/i.test(f) && !f.startsWith("."));
    if (!files.length) continue;
    const dest = join(root, "public", "demos", slug);
    mkdirSync(dest, { recursive: true });
    for (const f of files) cpSync(join(src, f), join(dest, f), { recursive: true });
    console.log(`demo assets: copied ${files.length} file(s) for ${slug}`);
  }
}
