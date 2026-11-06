import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import { after, before, test } from "node:test";
import { chromium } from "playwright-chromium";

let browser;
let moduleUrl;
before(async () => {
  const source = await readFile(new URL("../src/lib/reader-narration.ts", import.meta.url), "utf8");
  moduleUrl = `data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString("base64")}`;
  browser = await chromium.launch({ channel: process.env.READER_BROWSER_CHANNEL || undefined });
});
after(async () => { await browser?.close(); });

async function narrate(html, mode = "adapted") {
  const page = await browser.newPage();
  try {
    await page.setContent(`<article lang="en">${html}</article>`);
    return await page.evaluate(async ({ moduleUrl, mode }) => {
      const { buildNarration } = await import(moduleUrl);
      const root = document.querySelector("article");
      const before = root.innerHTML;
      const result = buildNarration(root, mode).map(({ el, block, ...rest }) => ({ ...rest, source: el.id, block: block.id }));
      return { result, unchanged: before === root.innerHTML };
    }, { moduleUrl, mode });
  } finally { await page.close(); }
}

test("prose stays continuous across inline markup without mutating the article", async () => {
  const { result, unchanged } = await narrate('<p id="prose">Read <strong>the result</strong> from <a href="https://example.com">this link</a> and <code>orders.country</code>. Version 1.10 is unchanged.</p>');
  assert.deepEqual(result.map((s) => s.text), ["Read the result from this link and orders.country.", "Version 1.10 is unchanged."]);
  assert.equal(unchanged, true);
  assert.ok(result.every((s) => s.source === "prose"));
});

test("ordered counters, nesting and checkboxes retain their meaning without duplicating paragraphs", async () => {
  const { result } = await narrate('<ol start="3"><li><p>Alpha. Again.</p><ul><li>Bullet.</li></ul><ol reversed><li>Nested A.</li><li value="7">Nested B.</li></ol></li><li value="8">Beta.</li><li>Gamma.</li></ol><ul><li><input type="checkbox" checked disabled>Done.</li><li><input type="checkbox" disabled>Pending.</li></ul>');
  assert.deepEqual(result.map((s) => s.text), ["3. Alpha.", "Again.", "Bullet.", "2. Nested A.", "7. Nested B.", "8. Beta.", "9. Gamma.", "Checked. Done.", "Not checked. Pending."]);
});

test("only a reviewed description substitutes content, with exact detail available", async () => {
  const html = '<figure id="example" data-listen-summary="Counts orders by country." data-listen-reviewed="true"><pre><code class="language-sql">SELECT country, COUNT(*)\nFROM orders;</code></pre></figure>';
  const adapted = (await narrate(html)).result;
  assert.equal(adapted.length, 1);
  assert.match(adapted[0].text, /^Adapted description\. Counts orders by country\./);
  assert.equal(adapted[0].hasDetails, true);
  const original = (await narrate(html, "original")).result;
  assert.ok(original.some((s) => s.text.includes("COUNT open parenthesis asterisk close parenthesis")));
  assert.ok(original.every((s) => s.block === "example"));
  const unreviewed = (await narrate(html.replace('data-listen-reviewed="true"', 'data-listen-reviewed="false"'))).result;
  assert.deepEqual(unreviewed.map((s) => s.text), original.map((s) => s.text));
});

test("code preserves line order, indentation and syntax", async () => {
  const { result } = await narrate('<pre><code class="language-python">if ready:\n  run("x_y")\n\n</code></pre>');
  assert.deepEqual(result.map((s) => s.text), ["python Code listing. Syntax is read explicitly.", "Line 1. if 1 space ready colon.", "Line 2. Indent 2 spaces. run open parenthesis double quote x underscore y double quote close parenthesis.", "Line 3. Blank line.", "End code listing."]);
});

test("original code distinguishes literal whitespace and speaks inline operators and flags", async () => {
  const { result } = await narrate('<p><code>a*b</code> and <code>--no-write-json</code> in <code>/tmp/x_y</code>.</p><pre><code>print("a  b")\nprint("a b")\n \t run()  </code></pre>', "original");
  const text = result.map((s) => s.text).join(" ");
  assert.match(text, /a asterisk b and dash dash no dash write dash json in slash tmp slash x underscore y/);
  assert.match(text, /a 2 spaces b/);
  assert.match(text, /a 1 space b/);
  assert.match(text, /Indent 1 space 1 tab 1 space/);
  assert.match(text, /close parenthesis 2 spaces/);
});

test("hidden table rows, cells and CSS-hidden prose are excluded", async () => {
  const { result } = await narrate('<style>.invisible { display:none }</style><p class="invisible">Hidden prose.</p><table><thead><tr><th>Plan</th><th>Price</th></tr></thead><tbody><tr hidden><td>Secret</td><td>99</td></tr><tr><td>A</td><td hidden>Secret price</td></tr><tr style="display:none"><td>Hidden row</td><td>22</td></tr></tbody></table>');
  const text = result.map((s) => s.text).join(" ");
  assert.doesNotMatch(text, /Hidden|Secret|99|22|empty/);
  assert.match(text, /Plan: A/);
});

test("nested inline math and description wrappers preserve their meaning", async () => {
  const { result } = await narrate('<p>For <span><math aria-label="x squared"><msup><mi>x</mi><mn>2</mn></msup></math></span> use this value.</p><div><span><span data-listen-summary="The diagram has two branches." data-listen-reviewed="true">Diagram content.</span></span></div>');
  const text = result.map((s) => s.text).join(" ");
  assert.match(text, /For x squared use this value/);
  assert.match(text, /Adapted description\. The diagram has two branches/);
  assert.equal(result.at(-1).hasDetails, true);
});

test("optional spelling preserves character case, whitespace and punctuation", async () => {
  const page = await browser.newPage();
  try {
    const text = await page.evaluate(async (moduleUrl) => {
      const { spellText } = await import(moduleUrl);
      return spellText("Ab_1\t\n");
    }, moduleUrl);
    assert.equal(text, "capital A, lowercase b, underscore, digit 1, 1 tab, new line");
  } finally { await page.close(); }
});

test("table values carry headers, preserving empty cells and zero", async () => {
  const { result } = await narrate('<table id="results"><caption>Timing</caption><thead><tr><th>Engine</th><th>Time in milliseconds</th><th>Errors</th></tr></thead><tbody><tr><th scope="row">A</th><td>12</td><td>0</td></tr><tr><th scope="row">B</th><td>4</td><td></td></tr></tbody></table>');
  assert.deepEqual(result.map((s) => s.text), ["Table: Timing.", "Row 1. Engine: A. Time in milliseconds: 12. Errors: 0.", "Row 2. Engine: B. Time in milliseconds: 4. Errors: empty.", "End table."]);
  assert.ok(result.every((s) => s.block === "results"));
});

test("table spans retain column and row relationships", async () => {
  const { result } = await narrate('<table><thead><tr><th rowspan="2">Plan</th><th colspan="2">Cost</th></tr><tr><th>Monthly</th><th>Yearly</th></tr></thead><tbody><tr><th rowspan="2">Basic</th><td>10</td><td>100</td></tr><tr><td>12</td><td>120</td></tr></tbody></table>');
  assert.equal(result[1].text, "Row 1. Plan: Basic. Cost, Monthly: 10. Cost, Yearly: 100.");
  assert.equal(result[2].text, "Row 2. Plan: Basic. Cost, Monthly: 12. Cost, Yearly: 120.");
});

test("hidden physical rows retain span positions and zero spans stop at the row group", async () => {
  const { result } = await narrate('<table><thead><tr><th>Plan</th><th>Price</th></tr></thead><tbody><tr><th rowspan="2">A</th><td>10</td></tr><tr hidden><td>Secret</td></tr><tr><th>B</th><td>20</td></tr></tbody><tbody><tr><th rowspan="0">C</th><td>30</td></tr><tr><td>40</td></tr></tbody><tbody><tr><th>D</th><td>50</td></tr></tbody></table>');
  assert.deepEqual(result.map((s) => s.text), ["Table.", "Row 1. Plan: A. Price: 10.", "Row 2. Plan: B. Price: 20.", "Row 3. Plan: C. Price: 30.", "Row 4. Plan: C. Price: 40.", "Row 5. Plan: D. Price: 50.", "End table."]);
});

test("informative images and math are described; decoration and repeated captions are omitted", async () => {
  const { result } = await narrate('<figure><img alt="Orders flow into the warehouse."><figcaption>Orders flow into the warehouse.</figcaption></figure><img alt=""><img><div role="math" data-say="Total equals price times quantity.">t=p*q</div><math><mi>x</mi><mo>+</mo><mn>1</mn></math>');
  assert.deepEqual(result.map((s) => s.text), ["Image. Orders flow into the warehouse.", "Image without a description.", "Total equals price times quantity.", "Mathematical notation; no spoken description is provided. x+1"]);
});

test("notes, quotations, deletion and collapsed content have explicit treatment", async () => {
  const html = '<blockquote><p>A quote.</p></blockquote><p><del>Old value</del> is replaced. See <a data-footnote-ref href="#note">1</a>.</p><details><summary>Optional material</summary><p>Secret until expanded.</p></details><p hidden>Hidden.</p><p aria-hidden="true">Also hidden.</p><p data-listen-ignore>Ignored.</p><section data-footnotes id="notes"><h2>Footnotes</h2><ol><li id="note">Evidence.<a data-footnote-backref>↩</a></li></ol></section>';
  const { result } = await narrate(html);
  const text = result.map((s) => s.text).join(" ");
  assert.match(text, /Quotation\. A quote\. End quotation\./);
  assert.match(text, /deleted text: Old value; end deleted text/);
  assert.match(text, /footnote 1/);
  assert.match(text, /Optional material\. Collapsed section\./);
  assert.doesNotMatch(text, /Secret|Hidden|Also hidden|Ignored|Evidence/);
  assert.equal(result.at(-1).hasDetails, true);
  assert.match((await narrate(html, "original")).result.map((s) => s.text).join(" "), /Evidence\./);
});

test("full reading retains destinations and equivalent pronunciation overrides", async () => {
  const { result } = await narrate('<p><span data-say="S Q L">SQL</span> is described at <a href="https://example.com/docs">the documentation</a>.</p>', "original");
  assert.match(result.map((s) => s.text).join(" "), /S Q L is described at the documentation \(https:\/\/example.com\/docs\)/);
});
