# Listening to technical Markdown

Research date: 5 November 2026. Scope: publishing and reading-system guidance; proposed product behavior. This note does not implement a player or claim that existing site behavior has been verified.

## Finding

A useful listening experience needs semantic structure, navigation and control over detail, alongside intelligible speech. Treat the written article as the source and give its difficult blocks an explicitly authored listening presentation. Preserve access to the complete code, table or equation whenever a shorter explanation is used.

No universal code-narration convention was established by the primary sources reviewed. The code policy below is a design recommendation, not a W3C, DAISY or audiobook-industry rule.

## What the sources establish

### Reading applications

DAISY's Reading Apps User Requirements distinguishes read aloud from embedded audio. It calls for structured navigation, continuous playback, pause/resume, saved position, semantic exposure to assistive technology, and return after following a note. Its read-aloud requirements include reading tables left to right and top to bottom; embedded audio should preserve row/column relationships. Users should be able to hear image alternatives and encoded mathematics, escape defined structures, and configure skipping. Noncontinuous modes and adjustable pauses are optional enhancements in its prioritization. These are reading-app requirements, rather than a mandate to summarize technical blocks. [DAISY, final 31 October 2025](https://daisy.github.io/reading-apps-ux-reqs/requirements/published/FINAL-20251031/).

EPUB Accessibility 1.1 recommends identifying skippable and escapable structures for synchronized text/audio publications. Skipping selects secondary material to omit by preference; escaping leaves a structure already being played. Its scope is EPUB conformance, not a direct conformance requirement for this website, but the distinction transfers well to player design. [W3C EPUB Accessibility 1.1, synchronized text/audio](https://www.w3.org/TR/epub-a11y-11/#sec-sync-text-audio).

### Descriptions and tables

W3C distinguishes a table caption, which identifies its subject, from a summary of its organization, which assists navigation through complex structures. That structural summary is not necessarily an interpretation or takeaway. Captions and summaries should avoid duplication. [W3C WAI, Caption & Summary](https://www.w3.org/WAI/tutorials/tables/caption-summary/).

DAISY's image-description principles recommend context-appropriate descriptions, longer descriptions when concise alt text is insufficient, subject expertise and editorial quality assurance, with special care for AI-produced descriptions. These principles concern images in text-based digital publications; their glossary explicitly says audiobooks require additional guidance. Extending their editorial process to code explanations is our recommendation. [DAISY / Inclusive Publishing, image-description principles](https://inclusivepublishing.org/principles-for-image-descriptions/).

### Audiobook production and technical publishers

NLS narration specifications require fidelity to the supplied text, accurate pronunciation and a pace suited to meaning. Their omission and relocation rules are controlled exceptions for NLS production. This supports careful adaptation and review, not silently replacing source material with a generated synopsis. These are NLS contract requirements, not universal commercial publishing rules. [Library of Congress NLS, Narration, sections 3.1–3.2](https://www.loc.gov/nls/who-we-are/guidelines-and-specifications/contract-specifications/narration/).

Packt provides an audiobook companion PDF for *Exploring GPT-3* that directs listeners to downloadable code. This is a concrete publisher example of preserving exact technical material alongside audio, not evidence that every publisher narrates or omits code in the same way. [Packt audiobook companion](https://static.packt-cdn.com/downloads/Audiobook/Audiobook_9781805127833_Exploring_GPT-3.pdf).

## Proposed behavior for this site

Everything in this section is a product proposal informed by those sources, not an externally prescribed standard.

### Continuous listening and detail

Keep ordinary paragraphs complete and in source order. Offer continuous listening with clear cues for structure and optional author-reviewed descriptions of difficult blocks. Describe that setting as an adapted listening version if code or tables are replaced by explanations. Do not advertise it as a verbatim full reading.

Offer a full-detail reading setting that retains table values and code, plus a way to inspect or replay an individual block. A short explanation should not be the only nonvisual way to obtain the original content. Let listeners select a global preference and change the current block without losing their position.

Expose distinct controls for “Skip this block,” “Read the full block” and “Return to article.” A blanket “skip code” setting should be an explicit listener choice. Blocks without reviewed descriptions should fall back to exact reading or an announced omission under that choice, rather than inventing a description at playback time.

### Markdown elements

| Element | Continuous listening proposal | Detail and source access |
| --- | --- | --- |
| Headings | Speak heading text with a short boundary pause. Keep hierarchy in chapter navigation. | Jump to previous/next heading; optionally announce level. |
| Paragraphs and emphasis | Read full prose with sentence and paragraph phrasing. Use emphasis sparingly. | Replay paragraph or sentence; avoid announcing formatting tokens by default. |
| Lists and tasks | Preserve ordered numbers, item boundaries and task state. Announce nesting where needed for meaning. | Navigate item by item and escape the whole list. |
| Tables | Introduce caption/subject and structure. Read small tables with labels; for a large table, use an explicitly identified reviewed explanation only in adapted mode. | Read every row with relevant column/row headers and units. Preserve empty, zero and unavailable values as distinct states. Avoid flattening cells into an unlabeled number stream. |
| Fenced code | Announce language and listing title. In adapted mode, speak a reviewed explanation of purpose, inputs, key operation and result. | Offer original listing and line-by-line reading, with configurable punctuation. Retain comments, indentation significance, identifiers and operators. |
| Inline code | Speak short identifiers or expressions in context with tested pronunciations. | Spell exact identifier, path, flag or command on request. Never silently expand an identifier into a different claim. |
| Images and diagrams | Read meaningful alt text; use the caption without repeating the same words twice. Decorative images need no narration. | Offer longer descriptions for diagrams. Flag absent descriptions editorially; never use a filename as an adequate substitute. |
| Mathematics | Use a reviewed spoken form or a capable math-speech renderer. | Preserve formula structure and original notation; allow slower or more explicit reading. Do not treat arbitrary LaTeX token stripping as mathematical accessibility. |
| Links | Speak meaningful link text within the sentence. | Keep an actionable reference list and exact URL. Read a raw URL when it is itself instructional or explicitly requested. |
| Footnotes, references and asides | Announce their availability with configurable inline reading. | Follow the note, read it fully and return to the exact prior position. Distinguish quotations and editorial commentary. |

The boundary between “small” and “large” blocks should be tested with listeners; a fixed line or cell threshold would be a local heuristic, not a standard. A two-line regular expression may need more explanation than a ten-line straightforward example.

### Author-reviewed listening descriptions

Use a separately named listening description for code and tables. HTML `alt` is an image mechanism; “alt text for code” is a useful analogy but should not imply an existing standard code attribute.

For code, describe what the example demonstrates, relevant inputs, important transformations, output and any condition the surrounding argument depends on. Avoid claiming general correctness or safety from a brief snippet. Read a short command exactly when the reader is expected to type it. A purpose description alone cannot replace such instructions.

For tables, distinguish subject, organization and interpretation. Include units, material exceptions and qualifications in any takeaway. A statement such as “Option A wins” must not replace a table whose result depends on price, workload or a footnote.

Draft descriptions during authoring, review them with the source block and surrounding article, and listen to the actual synthesized voice. Machine assistance can create drafts; publication should require author or subject-matter review. Record review status so an unreviewed draft cannot silently become the published audio.

### Fidelity and source mapping

Keep a stable block identifier, source location, content revision or hash, block type, exact text and optional reviewed listening text. Record whether each audio segment is exact prose, a pronunciation adjustment, an author description, a summary or a listener-selected omission. This is a proposed internal model, not an EPUB requirement.

Map each segment to the relevant rendered block so “Show source” scrolls to that block. An explanation of ten lines should highlight the block it describes, rather than pretending its words occur in the original. Revalidate descriptions when their source changes. Maintain positions using source block plus local offset; a timestamp alone becomes unreliable after regenerated speech.

Show the current presentation clearly: “Original reading” or “Adapted listening.” Announce material substitutions or omissions at the block, particularly during audio-only playback. Preserve the original content and accessibility semantics independently of the listening script.

## Validation before implementation is considered complete

Use representative technical articles with nested lists, a short command, multiline code, a labeled table, a complex table, a chart, equations and notes. Check both exact and adapted presentations without watching the screen. Verify that listeners can identify the conclusion and its exceptions, retrieve exact values or syntax, escape detail, and resume at the correct location. Include users who rely on screen readers; polished TTS alone does not establish accessible navigation.

This note is research and design guidance. It does not establish WCAG conformance, measured comprehension improvements or compatibility across speech engines.
