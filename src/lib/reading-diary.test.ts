import assert from "node:assert/strict";
import { test } from "node:test";
import { groupReadingEntries } from "./reading-diary.ts";

const entry = (id: string, day: number, month: number, year = 2026) => ({
  id,
  data: { pubDate: new Date(year, month - 1, day) },
});

test("groups newest first and keeps month order", () => {
  const diary = groupReadingEntries([
    entry("a", 3, 10),
    entry("b", 20, 9),
    entry("c", 1, 10),
  ]);
  assert.deepEqual(diary.months.map((m) => m.label), ["October 2026", "September 2026"]);
  assert.deepEqual(diary.months[0].items.map((i) => i.id), ["a", "c"]);
  assert.deepEqual(diary.years, [2026]);
  assert.equal(diary.noteCount, 3);
});

test("ids are stable month ids", () => {
  const diary = groupReadingEntries([entry("a", 3, 10)]);
  assert.equal(diary.months[0].id, "month-2026-10");
  assert.equal(diary.months[0].shortLabel, "Oct");
});
