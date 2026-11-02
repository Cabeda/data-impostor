import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { excerpt } from "./excerpt.ts";

describe("excerpt", () => {
  it("returns the first paragraph as plain text", () => {
    assert.equal(
      excerpt("I keep up with the industry through a curated feed.\n\nSecond paragraph."),
      "I keep up with the industry through a curated feed.",
    );
  });

  it("drops headings, emphasis and inline code markers", () => {
    assert.equal(
      excerpt("## The problem\n\nI use *RSS* and `read-it-later` daily."),
      "I use RSS and read-it-later daily.",
    );
  });

  it("drops fenced code blocks instead of leaking their contents", () => {
    assert.equal(
      excerpt("Before the code.\n\n```js\nconst secret = 1;\n```\n\nAfter the code."),
      "Before the code.",
    );
  });

  it("uses the first bullet when the body is only a list", () => {
    assert.equal(
      excerpt("- fixed the flaky test\n- wrote the runbook"),
      "fixed the flaky test wrote the runbook",
    );
  });

  it("drops images but keeps the link text", () => {
    assert.equal(
      excerpt("![a chart](./chart.png) See [the tool](https://example.com)."),
      "See the tool.",
    );
  });

  it("collapses whitespace and decodes HTML entities", () => {
    assert.equal(excerpt("One\n  two &amp; three\tfour"), "One two & three four");
  });

  it("truncates on a word boundary with an ellipsis", () => {
    const result = excerpt("word ".repeat(60), 40);
    assert.ok(result.length <= 40, `length ${result.length}`);
    assert.ok(result.endsWith("…"));
    assert.ok(!result.includes("wor…"), `cut mid-word: ${result}`);
  });

  it("leaves text shorter than the limit untouched", () => {
    assert.equal(excerpt("Short and complete.", 155), "Short and complete.");
  });

  it("returns an empty string for empty or syntax-only input", () => {
    assert.equal(excerpt(""), "");
    assert.equal(excerpt("```\ncode only\n```"), "");
  });
});
