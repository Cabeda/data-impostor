import { previewText } from "./mastodon-preview.ts";

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

export function readTitleFromBody(body: string | null | undefined): string {
  const heading = body?.split("\n").find((line) => line.trim().startsWith("#"));
  if (!heading) return "Reading notes";
  const title = heading
    .replace(/^#+\s*/, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/, "$1")
    .trim();
  return title || "Reading notes";
}

function newest<T extends { data: { pubDate: Date } }>(entries: T[]): T | undefined {
  return [...entries].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())[0];
}

function newestMastodon(entries: MastodonLike[]): MastodonLike | undefined {
  return [...entries].sort(
    (a, b) => new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime(),
  )[0];
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
): HomeItem[] {
  const items: HomeItem[] = [];
  const post = newest(blog);
  const read = newest(reads);
  const activity = newestMastodon(mastodon);

  if (post) {
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
