import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  checkEntryDate,
  formatCompact,
  formatISO,
  isUndatedPage,
  localDate,
  parseEntryId,
  postIdentity,
  renderReadsEntry,
  slugFromTitle,
  utcDate,
} from "./content-intake.ts";

describe("slugFromTitle", () => {
  it("lowercases and hyphenates a plain title", () => {
    assert.equal(slugFromTitle("Pyscript Demo"), "pyscript-demo");
  });

  it("collapses runs of separators and trims them", () => {
    assert.equal(
      slugFromTitle("  Multiple   spaces, and punctuation!  "),
      "multiple-spaces-and-punctuation",
    );
  });

  it("folds accents to their base letters", () => {
    assert.equal(slugFromTitle("Ação e Reação"), "acao-e-reacao");
  });

  it("drops symbols but keeps digits", () => {
    assert.equal(
      slugFromTitle("DuckDB & Python: 2x Faster"),
      "duckdb-python-2x-faster",
    );
    assert.equal(slugFromTitle("C++ vs C#"), "c-vs-c");
  });

  it("keeps non-Latin letters instead of collapsing to nothing", () => {
    assert.equal(slugFromTitle("日本語のタイトル"), "日本語のタイトル");
  });

  it("refuses a title with nothing to name a URL", () => {
    assert.throws(() => slugFromTitle("---"), /Cannot derive a slug/);
    assert.throws(() => slugFromTitle(""), /Cannot derive a slug/);
  });

  it("caps a very long title without leaving a trailing dash", () => {
    const slug = slugFromTitle("word ".repeat(40));
    assert.ok(slug.length <= 80);
    assert.ok(!slug.endsWith("-"));
  });
});

describe("postIdentity", () => {
  it("places a blog entry in a dated folder and dates its frontmatter", () => {
    assert.deepEqual(
      postIdentity("blog", { date: new Date(2024, 10, 5), title: "Pyscript Demo" }),
      {
        path: "src/data/blog/20241105-pyscript-demo/index.md",
        entryId: "20241105-pyscript-demo",
        pubDate: "2024-11-05",
      },
    );
  });

  it("places a reads entry under its year", () => {
    assert.deepEqual(postIdentity("reads", { date: new Date(2024, 8, 18) }), {
      path: "src/data/reads/2024/20240918.md",
      entryId: "2024/20240918",
      pubDate: "2024-09-18",
    });
  });

  it("refuses to name a blog entry without a title", () => {
    assert.throws(
      () => postIdentity("blog", { date: new Date(2024, 10, 5) }),
      /Blog entries need a title/,
    );
  });

  it("refuses an invalid date", () => {
    assert.throws(
      () => postIdentity("reads", { date: new Date("not a date") }),
      /invalid Date/,
    );
  });
});

describe("parseEntryId", () => {
  it("reads the day out of a blog id", () => {
    assert.deepEqual(parseEntryId("blog", "20241105-pyscript-demo"), {
      year: 2024,
      month: 11,
      day: 5,
    });
  });

  it("reads the day out of a reads id", () => {
    assert.deepEqual(parseEntryId("reads", "2024/20240918"), {
      year: 2024,
      month: 9,
      day: 18,
    });
  });

  it("rejects ids with no date, an impossible date, or a year that disagrees", () => {
    assert.equal(parseEntryId("blog", "pyscript-demo"), null);
    assert.equal(parseEntryId("blog", "20241305-impossible"), null);
    assert.equal(parseEntryId("reads", "20241127"), null);
    assert.equal(parseEntryId("reads", "2023/20240918"), null);
  });
});

describe("checkEntryDate", () => {
  it("accepts an entry whose path and frontmatter agree", () => {
    assert.equal(
      checkEntryDate("blog", "20241105-pyscript-demo", new Date("2024-11-05")),
      null,
    );
    assert.equal(
      checkEntryDate("reads", "2024/20240918", new Date("2024-09-18")),
      null,
    );
  });

  it("accepts an ISO date string, which is what YAML hands over uncoerced", () => {
    assert.equal(
      checkEntryDate("reads", "2024/20240918", "2024-09-18"),
      null,
    );
  });

  it("names both days when they disagree", () => {
    const problem = checkEntryDate("reads", "2024/20240918", new Date("2024-09-14"));
    assert.match(problem ?? "", /2024-09-14/);
    assert.match(problem ?? "", /2024-09-18/);
    assert.match(problem ?? "", /path is the identity/);
  });

  it("catches a compact date that YAML read as epoch milliseconds", () => {
    // `pubDate: 20241105` is a number, and `new Date(20241105)` is 1970-01-01.
    const problem = checkEntryDate("blog", "20241105-pyscript-demo", new Date(20241105));
    assert.match(problem ?? "", /1970-01-01/);
  });

  it("reports a missing or unusable frontmatter date", () => {
    assert.match(
      checkEntryDate("blog", "20241105-pyscript-demo", undefined) ?? "",
      /no usable pubDate/,
    );
  });

  it("reports an entry whose path carries no date", () => {
    assert.match(
      checkEntryDate("blog", "pyscript-demo", new Date("2024-11-05")) ?? "",
      /does not encode a date/,
    );
  });
});

describe("isUndatedPage", () => {
  it("recognises the blog pages that carry no date", () => {
    assert.equal(isUndatedPage("blog", "uses"), true);
    assert.equal(isUndatedPage("blog", "workflow"), true);
  });

  it("does not extend the exception to posts or to other collections", () => {
    assert.equal(isUndatedPage("blog", "20241105-pyscript-demo"), false);
    assert.equal(isUndatedPage("blog", "a-new-page"), false);
    assert.equal(isUndatedPage("reads", "uses"), false);
  });
});

describe("date readers", () => {
  it("reads a date-only value in UTC, whatever the machine's time zone", () => {
    assert.deepEqual(utcDate(new Date("2024-11-05")), {
      year: 2024,
      month: 11,
      day: 5,
    });
  });

  it("reads the local calendar day the author meant", () => {
    assert.deepEqual(localDate(new Date(2024, 10, 5, 23, 30)), {
      year: 2024,
      month: 11,
      day: 5,
    });
  });

  it("formats both canonical and path forms", () => {
    const day = { year: 2024, month: 9, day: 8 };
    assert.equal(formatISO(day), "2024-09-08");
    assert.equal(formatCompact(day), "20240908");
  });
});

describe("renderReadsEntry", () => {
  it("renders the title link the reads page styles", () => {
    assert.equal(
      renderReadsEntry({ title: "A Book", url: "https://example.com/a" }),
      "##### [A Book](https://example.com/a)",
    );
  });

  it("credits authors in the link text", () => {
    assert.equal(
      renderReadsEntry({
        title: "A Book",
        url: "https://example.com/a",
        authors: ["Ada", "Grace"],
      }),
      "##### [A Book by Ada, Grace](https://example.com/a)",
    );
  });

  it("appends highlights as bullets separated by a blank line", () => {
    assert.equal(
      renderReadsEntry({
        title: "A Book",
        url: "https://example.com/a",
        highlights: [{ text: "first" }, { text: "second" }],
      }),
      "##### [A Book](https://example.com/a)\n\n- first\n- second\n",
    );
  });

  it("leaves no trailing bullets when there are no highlights", () => {
    assert.equal(
      renderReadsEntry({ title: "A Book", url: "https://example.com/a", highlights: [] }),
      "##### [A Book](https://example.com/a)",
    );
  });
});
