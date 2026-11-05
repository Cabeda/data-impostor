# Write and review an article for listening

Use this workflow when drafting or improving a blog article. The author and an assisting agent use the same checks. The [tutorial](../src/data/blog/20261105-writing-for-listeners/index.md) contains worked examples; [research](research/listening-experience.md) explains the publishing guidance and its limits.

## Workflow

1. Read the complete article. Identify its intended reader, main argument, essential evidence and qualifications. Preserve the author's voice and every condition needed to understand the argument.
2. Review the article in source order. For each table, code listing, diagram or equation, decide whether the surrounding prose explains its purpose and its important result. Prefer adding useful visible explanation before creating a separate listening description.
3. Use semantic Markdown: actual headings and lists, meaningful link text, fenced code with a language, table headers, and descriptive image alternatives. Keep exact commands, identifiers and data intact. The reader announces ordered numbers automatically.
4. Where raw reading would obscure the argument, wrap it in HTML carrying a listening description, using the recipes below. Draft with `data-listen-reviewed="false"`. A short command intended for execution usually needs full reading instead of a summary.
5. Compare each description against the block and surrounding article. Check inputs, operations, outputs, units, scope, exceptions and uncertainty. Mark `data-listen-reviewed="true"` only after this review. An agent may review descriptions it can verify against the source; leave uncertain editorial choices unreviewed for the author. When the source changes, reset the flag and review it again. The flag records review; it does not automatically detect stale descriptions.
6. Preview the actual article. Listen in **Adapted listening** and **Full reading**. Check **Read full block**, **Skip current block**, replay, source highlighting, section navigation and footnote return. Select an identifier or command and use **Spell selection** to check exact characters, case and whitespace. Test a narrow viewport and keyboard access to the controls.
7. Listen again without reading the screen. Can you explain the argument, the purpose of each example and the material qualifications? Can you recover exact syntax or values without losing your place? Fix the article or its listening description wherever you cannot.
8. Report what changed, what was listened to and what remains uncertain. A browser test of speech text verifies behavior; it does not establish pronunciation quality or comprehension. Run the repository's checks before committing.

## Descriptions in Markdown

Blog posts use `.md` files. Attach an optional reviewed listening description to a stable HTML wrapper. Blank lines separate the wrapper from fenced code or a Markdown table:

````md
<div id="orders-query" data-listen-summary="This SQL query counts orders in each country." data-listen-reviewed="false">

```sql
SELECT country, COUNT(*) FROM orders GROUP BY country;
```

</div>
````

Preview to verify that the fence renders as code, rather than literal backticks. Use `"true"` after review; omitted or false flags preserve original reading. `data-listen-summary` is site-specific speech metadata, not an HTML accessibility substitute. Images still need `alt`; tables still need their headers and caption.

Adapted listening announces a substitution and provides **Read full block** to expand the source before continuing through the article. **Full reading** bypasses descriptions throughout. Both modes read the source when a description is absent or unreviewed.

Each block needs a unique, stable `id`. Keep the wrapper around just the example it describes; grouping unrelated sections makes skipping and highlighting too coarse. A `figure` with `figcaption` is also supported. Critical instructions and qualifications belong in the main article too.

## Check each kind of content

| Content | Author's checks |
| --- | --- |
| Prose | Establish purpose before unfamiliar names. Give numbers units. Keep referents clear when the listener cannot look back. Prefer sentences that carry their own conditions. |
| Headings and breaks | Use a meaningful hierarchy. The player uses level-two headings as chapters and pauses at headings and horizontal rules. |
| Lists and task lists | Use ordered lists for actual order. Keep one logical item per entry. Use native task-list markup for checked state. Let the player speak markers. |
| Code | Label the language. Explain purpose, relevant inputs, important operation and result. Preserve dependencies, error cases and conditions that affect the argument. Keep the original executable example available. |
| Tables | State subject, units and reading direction. Use meaningful headers. A takeaway must retain qualifications and distinguish missing data from zero. Inspect span-heavy tables in full reading. |
| Inline code | Keep exact identifiers. For an unfamiliar pronunciation, use `<span data-say="spoken wording">visual wording</span>`. Use this only for equivalent pronunciation, not a different technical claim. |
| Images and diagrams | Use `alt=""` for decorative images and meaningful alt text for informative images. Put attribution in a caption or credit, not alt text. Use a reviewed listening block for a longer explanation. Avoid repeating the caption verbatim in alt text. |
| Mathematics | Supply a reviewed verbal explanation or `data-say`/`aria-label` on a math element. Preserve variable names, grouping and units. The player is not a general mathematical speech engine; raw notation is explicitly announced when a description is unavailable. |
| Links | Make labels meaningful in the sentence. Adapted listening reads the label; full reading adds external destinations. Shorten raw URLs in prose when a meaningful label serves the same purpose. |
| Quotes, warnings and deletions | Use blockquotes, visible warning labels and semantic deletion markup. Explain what a warning applies to. Do not rely on colour or bold text alone. |
| Footnotes and sidebars | Keep essential qualifications in the main argument. Standard footnotes can be opened while listening and the player provides a return control. Adapted listening announces their availability instead of silently discarding them. |
| Collapsible and raw HTML content | Verify reading order. Collapsed details expose their summary; opening a section rebuilds the narration. Hidden elements and `data-listen-ignore` are excluded. Use exclusion only for redundant controls or decoration, not essential content. |

## Completion checklist

- Descriptions explain the examples without inventing claims, results or guarantees.
- Every approved description has been compared with the current source. Unreviewed descriptions stay disabled.
- The listener knows when they hear an adaptation and can recover the complete source.
- Values retain labels and units; code retains syntax in full reading.
- Paragraphs containing links, emphasis and inline code sound like continuous prose.
- No meaningful block is silently missing, repeated or read in the wrong order.
- Skipping a block and returning from a note resume at the expected article position.
- The actual chosen voice has been auditioned; any untested engines or devices are recorded.

For browser regressions, install Chromium with `pnpm exec playwright install chromium`, start `pnpm dev --host 127.0.0.1 --port 4322`, then run `READER_TEST_URL=http://127.0.0.1:4322 pnpm test:reader`. The element tests also run without a server; the player integration test requires that URL. To use an installed Edge instead of bundled Chromium, add `READER_BROWSER_CHANNEL=msedge`. The tests capture speech requests rather than playing sound, so an actual listening pass remains necessary.

Suggested request to an agent:

> Improve this article using `docs/writing-for-listeners.md`. Preserve my argument and voice. Review every content type present. Draft listening descriptions only where they help, keep them unreviewed until I approve them, and list any remaining problems with pronunciation, source fidelity or navigation. Preview both presentations and distinguish automated checks from an actual listening review.
