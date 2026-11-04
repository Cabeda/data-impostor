import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeSyndication, getPlatform, PLATFORM_IDS } from "./platforms.ts";

describe("normalizeSyndication", () => {
  it("returns empty when nothing provided", () => {
    assert.deepEqual(normalizeSyndication({}), {});
  });

  it("merges legacy mastodonUrl", () => {
    assert.deepEqual(normalizeSyndication({ mastodonUrl: "https://m.example/@u/1" }), {
      mastodon: "https://m.example/@u/1",
    });
  });

  it("does not overwrite explicit syndication.mastodon", () => {
    assert.deepEqual(
      normalizeSyndication({
        mastodonUrl: "https://legacy",
        syndication: { mastodon: "https://new" },
      }),
      { mastodon: "https://new" },
    );
  });

  it("preserves other platforms", () => {
    assert.deepEqual(
      normalizeSyndication({ syndication: { linkedin: "https://li/x" } }),
      { linkedin: "https://li/x" },
    );
  });
});

describe("platforms", () => {
  it("has mastodon and linkedin", () => {
    assert.ok(getPlatform("mastodon"));
    assert.ok(getPlatform("linkedin"));
    assert.equal(getPlatform("nope"), undefined);
  });

  it("mastodon supports comments, linkedin does not", () => {
    assert.equal(getPlatform("mastodon")!.supportsComments, true);
    assert.equal(getPlatform("linkedin")!.supportsComments, false);
  });

  it("platform ids include both", () => {
    assert.ok(PLATFORM_IDS.includes("mastodon"));
    assert.ok(PLATFORM_IDS.includes("linkedin"));
  });
});
