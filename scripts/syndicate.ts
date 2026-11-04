#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-net

import { parseArgs } from "jsr:@std/cli";
import { walk } from "jsr:@std/fs";

const INSTANCE = Deno.env.get("MASTODON_INSTANCE") || "mastodon.social";
const TOKEN = Deno.env.get("MASTODON_ACCESS_TOKEN") || "";
const SITE_URL = "https://cabeda.dev";

interface Frontmatter {
  title?: string;
  description?: string;
  tags?: string[];
  mastodonUrl?: string;
  syndicate?: boolean;
  syndication?: Record<string, string>;
}

function parseFrontmatter(content: string): { fm: Frontmatter } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { fm: {} };
  const raw = match[1];
  const fm: Frontmatter = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      try {
        (fm as any)[key] = JSON.parse(val.replace(/'/g, '"'));
      } catch { /* fall through */ }
      continue;
    }
    if (val === "true") { (fm as any)[key] = true; continue; }
    if (val === "false") { (fm as any)[key] = false; continue; }
    if (val === "") { (fm as any)[key] = undefined; continue; }
    val = val.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    (fm as any)[key] = val;
  }
  return { fm };
}

function hasMastodonUrl(fm: Frontmatter): boolean {
  if (fm.mastodonUrl) return true;
  if (fm.syndication && fm.syndication.mastodon) return true;
  return false;
}

function insertMastodonUrl(content: string, url: string): string {
  const lines = content.split("\n");
  const idx = lines.findIndex((l) => /^pubDate:/.test(l.trim()));
  if (idx !== -1) {
    lines.splice(idx + 1, 0, `mastodonUrl: ${url}`);
  } else {
    const fmEnd = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
    if (fmEnd !== -1) lines.splice(fmEnd, 0, `mastodonUrl: ${url}`);
  }
  return lines.join("\n");
}

async function publishToMastodon(post: { title: string; url: string; description?: string; tags?: string[] }): Promise<string> {
  if (!TOKEN) throw new Error("MASTODON_ACCESS_TOKEN is required");
  const tags = (post.tags || []).map((t) => `#${t.replace(/\s+/g, "")}`).join(" ");
  const status = `${post.title}\n\n${post.url}${post.description ? `\n\n${post.description}` : ""}${tags ? `\n\n${tags}` : ""}`;
  const res = await fetch(`https://${INSTANCE}/api/v1/statuses`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ status, visibility: "public" }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Publish failed: ${res.status} ${res.statusText} ${text}`);
  }
  const data = await res.json();
  return data.url || `https://${INSTANCE}/@${data.account?.username || ""}/${data.id}`;
}

const flags = parseArgs(Deno.args, { boolean: ["all", "dry-run", "help"], string: [] });

if (flags.help) {
  console.log("Usage: deno run --allow-read --allow-write --allow-env --allow-net scripts/syndicate.ts [--all] [--dry-run]");
  Deno.exit(0);
}

const dryRun = flags["dry-run"] === true;
let processed = 0;
let published = 0;

for await (const entry of walk("src/data/blog", { exts: ["md"], match: [/index\.md$/] })) {
  const path = entry.path;
  if (path.includes("/_")) continue;
  const content = await Deno.readTextFile(path);
  const { fm } = parseFrontmatter(content);
  if (!fm.title) continue;
  if (hasMastodonUrl(fm)) continue;
  if (!flags.all && fm.syndicate !== true) continue;

  const folder = path.split("/").slice(-2, -1)[0];
  const postUrl = `${SITE_URL}/blog/${folder}/`;
  processed++;

  if (dryRun) {
    console.log(`[dry-run] Would publish: ${fm.title} -> ${postUrl}`);
    continue;
  }

  try {
    const url = await publishToMastodon({ title: fm.title, url: postUrl, description: fm.description, tags: fm.tags });
    const updated = insertMastodonUrl(content, url);
    await Deno.writeTextFile(path, updated);
    published++;
    console.log(`Published: ${fm.title} -> ${url}`);
  } catch (err) {
    console.error(`Failed for ${fm.title}:`, err);
  }
}

console.log(`Processed ${processed} post(s), published ${published}.`);
