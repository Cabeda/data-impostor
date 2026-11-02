import { previewText } from "./mastodon-preview.ts";
import { readTitleFromBody } from "./content-intake.ts";

export type HomeKind = "Writing" | "Reading" | "Activity";

export interface HomeItem {
  kind: HomeKind;
  href: string;
  title: string;
  date: Date;
}

interface BlogLike {
  id: string;
  data: { title: string; pubDate: Date };
}

interface ReadLike {
  body?: string | null;
  data: { pubDate: Date };
}

interface MastodonLike {
  id: string;
  data: { content: string; created_at: string };
}

function newest<T>(entries: T[], dateOf: (entry: T) => number): T | undefined {
  if (entries.length === 0) return undefined;
  let best = entries[0];
  for (const entry of entries) {
    if (dateOf(entry) > dateOf(best)) best = entry;
  }
  return best;
}

/**
 * The three “latest” entries the landing page shows. One module owns the
 * collection selection, date normalisation and the reads title rule, so the
 * page stays markup and the rule cannot drift from renderReadsEntry.
 */
export function latestContents(
  blog: BlogLike[],
  reads: ReadLike[],
  mastodon: MastodonLike[],
  writingLimit = 5,
): HomeItem[] {
  const items: HomeItem[] = [];
  const posts = [...blog]
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    .slice(0, Math.max(1, writingLimit));
  const read = newest(reads, (entry) => entry.data.pubDate.getTime());
  const activity = newest(mastodon, (entry) => new Date(entry.data.created_at).getTime());

  for (const post of posts) {
    items.push({
      kind: "Writing",
      href: `/blog/${post.id}/`,
      title: post.data.title,
      date: new Date(post.data.pubDate),
    });
  }
  if (read) {
    items.push({
      kind: "Reading",
      href: "/reads",
      title: readTitleFromBody(read.body),
      date: new Date(read.data.pubDate),
    });
  }
  if (activity) {
    items.push({
      kind: "Activity",
      href: `/mastodon/${activity.id}`,
      title: previewText(activity.data.content, 64),
      date: new Date(activity.data.created_at),
    });
  }
  return items;
}

export { readTitleFromBody } from "./content-intake.ts";
