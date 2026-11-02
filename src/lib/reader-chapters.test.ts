import assert from "node:assert/strict";
import { test } from "node:test";
import { chapterIndex } from "./reader-chapters.ts";

test("no headings keeps chapter zero", () => {
  assert.equal(chapterIndex([], 300), 0);
});

test("stays on the first chapter above the line", () => {
  assert.equal(chapterIndex([100, 500, 900], 300), 0);
  assert.equal(chapterIndex([-200, 500, 900], 300), 0);
});

test("advances only for headings already above the line", () => {
  assert.equal(chapterIndex([100, 200, 900], 300), 1);
  assert.equal(chapterIndex([100, 200, 250], 300), 2);
});

test("the exact line belongs to the previous chapter", () => {
  assert.equal(chapterIndex([100, 300, 500], 300), 0);
});
