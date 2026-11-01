/**
 * Content intake.
 *
 * The one module that answers, for an entry the site generates, where it lives
 * and when it was published. Astro's collection loaders (`src/lib/identity-loader.ts`)
 * and the scripts under `scripts/` are adapters over this module. It imports
 * nothing, so the Astro build and the Deno scripts can both use it.
 *
 * The rule it enforces: **the path is the identity**. A blog entry's folder is
 * `YYYYMMDD-slug/index.md` (and its id `YYYYMMDD-slug` is the URL), a reads
 * entry is `YYYY/YYYYMMDD.md`, and the frontmatter `pubDate` must name the same
 * calendar day.
 */

export type IntakeCollection = "blog" | "reads";

/** A calendar day, with no time zone and no time of day. */
export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

/** What a writer needs to create an entry, and what a loader validates against. */
export interface PostIdentity {
  /** Repository-relative path of the entry file. */
  path: string;
  /** The id Astro derives from that path — for blog posts, the URL segment. */
  entryId: string;
  /** Frontmatter date in canonical form: `YYYY-MM-DD`. */
  pubDate: string;
}

/** The part of a Readeck bookmark that the reads entry renders. */
export interface ReadsBookmark {
  title: string;
  url: string;
  authors?: string[];
  highlights?: Array<{ text: string }>;
}

const pad = (value: number): string => String(value).padStart(2, "0");

function isRealDate({ year, month, day }: CalendarDate): boolean {
  const probe = new Date(Date.UTC(year, month - 1, day));
  return (
    probe.getUTCFullYear() === year &&
    probe.getUTCMonth() === month - 1 &&
    probe.getUTCDate() === day
  );
}

function readDate(date: Date, zone: "local" | "utc"): CalendarDate {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError("Cannot derive a content date from an invalid Date");
  }
  const day: CalendarDate =
    zone === "utc"
      ? { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() }
      : { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  if (!isRealDate(day)) {
    throw new RangeError(`Not a calendar date: ${formatISO(day)}`);
  }
  return day;
}

/**
 * The author's calendar day, read in local time. Writers use this: "today"
 * means today where the person running the script is, not in UTC.
 */
export function localDate(date: Date): CalendarDate {
  return readDate(date, "local");
}

/**
 * The calendar day a date-only value names, read in UTC. Validation uses this:
 * a YAML `2024-11-05` is parsed as UTC midnight, so reading it back in local
 * time would shift the day for anyone west of Greenwich — and make a build pass
 * or fail depending on the machine running it.
 */
export function utcDate(date: Date): CalendarDate {
  return readDate(date, "utc");
}

/** `2024-11-05` — the canonical frontmatter form. */
export function formatISO(day: CalendarDate): string {
  return `${day.year}-${pad(day.month)}-${pad(day.day)}`;
}

/** `20241105` — the path form, used in folder and file names. */
export function formatCompact(day: CalendarDate): string {
  return `${day.year}${pad(day.month)}${pad(day.day)}`;
}

/**
 * A URL segment for a title: accents folded, lowercase, everything that is not
 * a letter or a number folded to a single dash. Unicode letters survive, so a
 * non-Latin title keeps its own script instead of collapsing to nothing.
 */
export function slugFromTitle(title: string): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  if (!slug) {
    throw new Error(`Cannot derive a slug from title: ${JSON.stringify(title)}`);
  }
  return slug;
}

/**
 * Where a new entry goes. `date` is the author's calendar day; for blog entries
 * the title is part of the path, for reads entries the day alone identifies it.
 */
export function postIdentity(
  collection: IntakeCollection,
  entry: { date: Date; title?: string },
): PostIdentity {
  const day = localDate(entry.date);
  const compact = formatCompact(day);

  if (collection === "reads") {
    return {
      path: `src/data/reads/${day.year}/${compact}.md`,
      entryId: `${day.year}/${compact}`,
      pubDate: formatISO(day),
    };
  }

  if (!entry.title) {
    throw new Error("Blog entries need a title: the folder name is the URL");
  }
  const entryId = `${compact}-${slugFromTitle(entry.title)}`;
  return {
    path: `src/data/blog/${entryId}/index.md`,
    entryId,
    pubDate: formatISO(day),
  };
}

const BLOG_ENTRY_ID = /^(\d{4})(\d{2})(\d{2})-(.+)$/;
const READS_ENTRY_ID = /^(\d{4})\/(\d{4})(\d{2})(\d{2})$/;

/**
 * Blog entries that are pages, not posts: they render through the collection
 * but have no publication date to anchor, so their id carries none. Kept
 * explicit so a new undated file fails the build until someone decides which
 * it is.
 */
const UNDATED_BLOG_ENTRIES = new Set(["uses", "workflow"]);

/** Whether an entry is a deliberately undated page rather than a post. */
export function isUndatedPage(
  collection: IntakeCollection,
  entryId: string,
): boolean {
  return collection === "blog" && UNDATED_BLOG_ENTRIES.has(entryId);
}


function parseCompact(year: string, month: string, day: string): CalendarDate | null {
  const date = { year: Number(year), month: Number(month), day: Number(day) };
  return isRealDate(date) ? date : null;
}

/** The calendar day an entry id encodes, or `null` when it encodes none. */
export function parseEntryId(
  collection: IntakeCollection,
  entryId: string,
): CalendarDate | null {
  if (collection === "blog") {
    const match = BLOG_ENTRY_ID.exec(entryId);
    return match ? parseCompact(match[1], match[2], match[3]) : null;
  }
  const match = READS_ENTRY_ID.exec(entryId);
  if (!match || match[1] !== match[2]) {
    return null;
  }
  return parseCompact(match[2], match[3], match[4]);
}

function publishedDay(value: unknown): CalendarDate | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : utcDate(value);
  }
  if (typeof value === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    return match ? parseCompact(match[1], match[2], match[3]) : null;
  }
  return null;
}

/**
 * The contract, checkable from the id Astro computed and the frontmatter it
 * parsed. Returns `null` when the entry is well formed, or one sentence naming
 * what disagrees.
 */
export function checkEntryDate(
  collection: IntakeCollection,
  entryId: string,
  pubDate: unknown,
): string | null {
  const inPath = parseEntryId(collection, entryId);
  if (!inPath) {
    return `${collection} entry "${entryId}" does not encode a date in its path`;
  }
  const inFrontmatter = publishedDay(pubDate);
  if (!inFrontmatter) {
    return `${collection} entry "${entryId}" has no usable pubDate (got ${String(pubDate)})`;
  }
  if (formatISO(inPath) !== formatISO(inFrontmatter)) {
    return `${collection} entry "${entryId}" says pubDate ${formatISO(inFrontmatter)}, but its path says ${formatISO(inPath)} — the path is the identity, so fix the frontmatter`;
  }
  return null;
}

/**
 * The body of a reads entry. The reads page styles these exact shapes
 * (`##### title` then `- highlight` bullets), so the markup lives here, next to
 * the identity, instead of inside the script that happens to call it.
 */
export function renderReadsEntry(bookmark: ReadsBookmark): string {
  const authors =
    bookmark.authors && bookmark.authors.length > 0
      ? ` by ${bookmark.authors.join(", ")}`
      : "";
  let markdown = `##### [${bookmark.title}${authors}](${bookmark.url})`;
  if (bookmark.highlights && bookmark.highlights.length > 0) {
    markdown += "\n\n";
    for (const highlight of bookmark.highlights) {
      markdown += `- ${highlight.text}\n`;
    }
  }
  return markdown;
}
