import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { previewText, stripLinks } from "./mastodon-preview.ts";

describe("stripLinks", () => {
  it("removes anchors but keeps their text", () => {
    assert.equal(
      stripLinks('<p>Read <a href="https://example.com" rel="nofollow">this</a> now.</p>'),
      "<p>Read this now.</p>",
    );
  });

  it("removes anchors that only wrap an image", () => {
    assert.equal(
      stripLinks('<p><a href="https://example.com"><img src="x.png" alt="a chart"></a></p>'),
      '<p><img src="x.png" alt="a chart"></p>',
    );
  });

  it("leaves content without links untouched", () => {
    assert.equal(stripLinks("<p>Plain post.</p>"), "<p>Plain post.</p>");
  });

  it("handles attributes containing angle brackets", () => {
    assert.equal(
      stripLinks('<a href="https://example.com/?a=1" title="a > b">x</a>'),
      "x",
    );
  });
});

describe("previewText", () => {
  it("strips tags, decodes entities and collapses whitespace", () => {
    assert.equal(
      previewText("<p>Fixed &amp; shipped\n\n the thing</p>"),
      "Fixed & shipped the thing",
    );
  });

  it("truncates longer text with an ellipsis", () => {
    const text = previewText("<p>" + "word ".repeat(40) + "</p>", 40);
    assert.ok(text.length <= 40, `length ${text.length}`);
    assert.ok(text.endsWith("…"));
  });

  it("returns an empty string for empty input", () => {
    assert.equal(previewText("<p></p>"), "");
  });
});
