import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_READER_PREFS,
  parseReaderPrefs,
  serializeReaderPrefs,
} from "./reader-prefs.ts";

test("defaults when storage is empty", () => {
  assert.deepEqual(parseReaderPrefs(null), DEFAULT_READER_PREFS);
  assert.deepEqual(parseReaderPrefs(""), DEFAULT_READER_PREFS);
});

test("defaults when storage is corrupt", () => {
  assert.deepEqual(parseReaderPrefs("{"), DEFAULT_READER_PREFS);
  assert.deepEqual(parseReaderPrefs("null"), DEFAULT_READER_PREFS);
  assert.deepEqual(parseReaderPrefs('"nope"'), DEFAULT_READER_PREFS);
});

test("keeps valid preferences", () => {
  const prefs = { theme: "night", size: "l", face: "sans", listen: true } as const;
  assert.deepEqual(parseReaderPrefs(JSON.stringify(prefs)), prefs);
});

test("replaces invalid fields without dropping the rest", () => {
  assert.deepEqual(
    parseReaderPrefs('{"theme":"neon","size":"l","face":"serif","listen":"yes"}'),
    { ...DEFAULT_READER_PREFS, size: "l" },
  );
});

test("round trips through storage", () => {
  const prefs = { theme: "sepia", size: "s", face: "sans", listen: false } as const;
  assert.deepEqual(parseReaderPrefs(serializeReaderPrefs(prefs)), prefs);
});

test("persists listening presentation while ignoring invalid modes", () => {
  for (const narration of ["adapted", "original"] as const) {
    const prefs = { ...DEFAULT_READER_PREFS, narration };
    assert.deepEqual(parseReaderPrefs(serializeReaderPrefs(prefs)), prefs);
  }
  assert.deepEqual(parseReaderPrefs('{"narration":"unknown"}'), DEFAULT_READER_PREFS);
});
