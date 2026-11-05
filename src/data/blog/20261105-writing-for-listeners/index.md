---
title: "Writing technical articles that work when you listen"
description: "A practical tutorial for narrating prose, code, tables, diagrams and notes without losing the meaning."
pubDate: 2026-11-05
tags:
  - accessibility
  - writing
  - tts
---


A technical article can read well on a screen and still be difficult to follow aloud. A listener cannot scan back to a table header or glance at the preceding line of code. The audio needs to preserve those relationships.

Press **Listen** to start playback. By default, the reader uses reviewed explanations of complex examples when available. In **Aa reading settings**, **Listening detail** lets you choose **Use available descriptions** or **Read full details**. The latter includes original code and table details, external link destinations and footnotes. Your preference is saved on this device. You can skip the current block or replay a sentence in either setting. Where a description replaces the source, **Read full block** expands that example and then continues through the article.

## Start with the argument

Before polishing pronunciation, identify what the reader needs to understand. Explain why an example exists before presenting its implementation. Keep qualifications beside the claims they affect.

“Execution took twelve milliseconds” is easier to follow than “twelve,” even when a nearby table supplies the unit. Likewise, “The query counts orders in each country” gives a listener a useful purpose before they hear SQL syntax.

The same care helps with abbreviations and unfamiliar names. Explain a component's role before relying on its name. Expand an abbreviation when it first matters, and use one name consistently afterwards.

## Prose, links and inline code

Write normal Markdown. Emphasis and links should remain part of a complete sentence. The reader combines inline elements before dividing prose into sentences, so **an emphasized phrase**, a [useful reference](https://www.w3.org/WAI/tutorials/), and an identifier such as `country` do not become unrelated audio fragments.

Use meaningful link labels. Use available descriptions reads the label in context. Read full details also includes external link destinations, which is useful when the destination itself matters.

For a pronunciation the voice gets wrong, provide an equivalent spoken form:

```html
<span data-say="S Q L">SQL</span>
```

This changes what our player says, while leaving the visible wording intact. It is a pronunciation override, not permission to substitute a different claim. Keep exact commands, flags and identifiers available in the article.

When exact spelling matters, select the source text and use **Spell selection**. It announces individual letters with their case, digits, symbols and whitespace, then resumes the article. Read full details also verbalizes punctuation in inline code.

## Headings, lists and task state

Use headings to divide the argument into meaningful sections. Level-two headings become chapters in this reader. A short pause marks a heading or a horizontal break.

Use an ordered list when sequence matters:

1. Explain what the example demonstrates.
2. Present the example.
3. Explain what the result establishes, including its limits.

The reader adds these numbers to speech. You do not need to write “first” and “second” into every item. Nested lists keep their own numbering. Unordered lists retain item boundaries without acquiring numbers.

Task lists carry a different meaning:

- [x] Identify the article's main argument.
- [ ] Listen to the final article without watching the screen.

The reader announces checked and unchecked state. A checklist should distinguish completed work from work still required.

## Code: explain the operation and retain the syntax

Reading punctuation aloud is useful when someone needs to reproduce code, but it can obscure the point of a longer example. Give the example an explanation that carries the part of the argument it supports.

<figure id="orders-by-country" data-listen-summary="This SQL query groups rows from the orders table by country and counts the rows in each group. The result contains a country and its row count. It does not filter orders by date or status." data-listen-reviewed="true">
<figcaption>Count orders by country</figcaption>

```sql
SELECT country, COUNT(*)
FROM orders
GROUP BY country;
```

</figure>

The description explains the grouping, the output and two absent filters. It avoids inventing an ordering or claiming that the query handles every application's definition of an order.

In full reading, the player announces the listing, reads it line by line and verbalizes syntax. Indentation is stated because it can be meaningful. You can skip the block whenever the explanation is enough.

To author this presentation in Markdown, wrap the example in a figure. Start new descriptions with `data-listen-reviewed="false"`:

````md

<figure id="my-example" data-listen-summary="Explain the purpose, important operation and result here." data-listen-reviewed="false">
<figcaption>Count orders by country</figcaption>

```sql
SELECT country, COUNT(*) FROM orders GROUP BY country;
```

</figure>
````

An unreviewed description is ignored by playback. Compare it with the source, then approve it for publication. If the code changes, review the description again; the flag does not detect that change for you.

A short command that the reader must type may be better left as original content. A description of what a command does cannot substitute for the command itself.

## Tables: keep labels attached to values

A table presents several dimensions at once. Its spoken version must tell the listener which label belongs to each value. Small tables often work well as labeled rows.

The following values are invented to demonstrate narration; they are not benchmark results.

| Implementation | Execution time | Measured runs |
| --- | --- | --- |
| Example A | 12 milliseconds | 10 |
| Example B | 4 milliseconds | 10 |

Read full details introduces the table and reads rows with column labels. This avoids presenting “twelve, ten, four, ten” without context. Empty cells are announced as empty; a zero remains zero.

For a larger table, write a description of the result the argument uses. Preserve relevant units, exceptions and limitations:

<figure id="table-interpretation" data-listen-summary="In this invented example, implementation B took four milliseconds and implementation A took twelve. Each has ten measured runs. These numbers demonstrate narration; they do not establish that B will be faster in another workload." data-listen-reviewed="true">
<figcaption>Interpreting the invented comparison</figcaption>

| Implementation | Execution time | Measured runs |
| --- | --- | --- |
| Example A | 12 milliseconds | 10 |
| Example B | 4 milliseconds | 10 |

</figure>

A table caption identifies its subject. A structural summary explains how its rows and columns are organized. A takeaway interprets its data. Those are different jobs; one sentence may not do all three. [W3C's table guidance](https://www.w3.org/WAI/tutorials/tables/caption-summary/) explains the distinction between captions and structural summaries.

## Images, diagrams and equations

Decorative images need an empty alternative: `alt=""`. Informative images need an alternative that explains their relevant content. Credit the photographer in a caption or attribution, rather than making the listener hear a credit URL as the image description.

```html
<img src="decorative-banner.jpg" alt="">
<img src="orders-flow.svg" alt="Orders move from the API into a queue, then a worker writes them to the warehouse.">
```

A complex diagram may need a longer listening description. Explain the relationships the article depends on: what flows where, which branches are conditional, and what changes as a result. Keep access to the image and its full description. Avoid repeating a caption verbatim in the alternative text.

Equations need equivalent care. The formula “total equals price times quantity” should preserve the operation and the meaning of its variables:

<div role="math" data-say="Total equals price multiplied by quantity.">total = price × quantity</div>

The reader can use this supplied spoken form. It is not a general mathematical speech engine. Without a description, it announces that it is reading mathematical notation rather than claiming to have interpreted it. For complex mathematics, provide a reviewed explanation and retain the original notation.

```html
<div role="math" data-say="Total equals price multiplied by quantity.">
  total = price × quantity
</div>
```

## Quotations, warnings, notes and hidden content

Blockquotes have audible boundaries:

> An example demonstrates a behavior under its stated conditions. It does not establish every possible outcome.

Make a warning's subject explicit. “Warning: this command deletes the selected files” works in audio; a red border alone does not. Deleted text is announced as deleted when semantic deletion markup is present.

Keep essential qualifications in the main argument. Supporting material can live in a footnote.[^supporting-note] Use available descriptions announces that notes are available. Follow a note reference to hear it, then use **Return to article** to resume at the referring sentence.

<details>
<summary>An optional aside about narration</summary>

This text enters the listening presentation when the section is expanded. The collapsed summary remains available before you open it.

</details>

The reader excludes hidden elements and article controls. For raw HTML, check the actual reading order in the preview. A custom widget or a visual arrangement can need an explicit description even when ordinary Markdown works automatically.

## Review it by listening

Use the actual voice and device you expect to listen with. Automated checks can verify the speech text and navigation, but cannot tell you that a technical name sounds right or that a passage is easy to understand.

1. Listen with available descriptions without reading the page. Identify any point that makes you need to look back.
2. Read full code and table blocks. Check that you can recover the exact syntax, labels and values.
3. Skip a long block and follow a footnote. Confirm that you return to the expected part of the argument.
4. Compare every description with its current source, including conditions and exceptions.

These choices borrow from accessible publishing: preserve meaning, expose structure and let the listener control detail. DAISY's [reading-app requirements](https://daisy.github.io/reading-apps-ux-reqs/requirements/published/FINAL-20251031/) provide useful guidance. They do not prescribe a universal way to summarize code, and this site does not claim conformance simply by adding narration.

[^supporting-note]: A note can preserve supporting evidence without interrupting the main explanation. It should not hide a qualification that changes the article's conclusion.
