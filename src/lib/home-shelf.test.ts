import assert from "node:assert/strict";
import { test } from "node:test";
import { latestContents, readTitleFromBody } from "./home-shelf.ts";

const post = (id: string, title: string, day: number) => ({
  id,
  data: { title, pubDate: new Date(`2026-10-${String(day).padStart(2, "0")}T00:00:00Z`) },
});

const read = (day: number, body?: string) => ({
  body,
  data: { pubDate: new Date(`2026-10-${String(day).padStart(2, "0")}T00:00:00Z`) },
});

const toot = (id: string, content: string, day: number) => ({
  id,
  data: { content, created_at: `2026-10-${String(day).padStart(2, "0")}T00:00:00Z` },
});

test("read title comes from the first markdown heading", () => {
  assert.equal(
    readTitleFromBody("## [Why DuckDB is fast](https://example.com)\n\n- a highlight"),
    "Why DuckDB is fast",
  );
  assert.equal(readTitleFromBody("## Plain heading\n"), "Plain heading");
  assert.equal(readTitleFromBody(undefined), "Reading notes");
  assert.equal(readTitleFromBody("no heading"), "Reading notes");
});

test("latest contents selects the newest of each collection", () => {
  const items = latestContents(
    [post("old", "Old post", 1), post("new", "New post", 9)],
    [read(2, "## [First read](https://a)"), read(8, "## [Second read](https://b)")],
    [toot("1", "Older toot", 3), toot("2", "Newer toot", 7)],
  );

  assert.deepEqual(
    items.map((item) => [item.kind, item.title]),
    [
      ["Writing", "New post"],
      ["Reading", "Second read"],
      ["Activity", "Newer toot"],
    ],
  );
  assert.equal(items[0].href, "/blog/new/");
  assert.equal(items[1].href, "/reads");
  assert.equal(items[2].href, "/mastodon/2");
});

test("empty collections drop their row", () => {
  assert.deepEqual(latestContents([], [], []), []);
  assert.deepEqual(
    latestContents([post("only", "Only post", 1)], [], []).map((item) => item.kind),
    ["Writing"],
  );
});
