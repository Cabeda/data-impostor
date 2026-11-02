/**
 * Excerpt: the sentence a page shows when it has no `description` of its own.
 *
 * A meta description is prose, not markup, so this reduces a Markdown/MDX body
 * to its first prose paragraph: fenced code, images, headings and tags are
 * dropped, inline emphasis and links keep their text, list items keep their
 * text (a list-only post still gets a description), and the result is cut at a
 * word boundary.
 */

import { collapseWhitespace, decodeEntities, truncate } from "./text.ts";

const isProse = (block: string): boolean =>
  block.length > 0 &&
  !/^#{1,6}\s/.test(block) &&
  !/^<\/?[A-Za-z]/.test(block) &&
  !/^\|/.test(block);

function toPlainText(block: string): string {
  const stripped = block
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<\/?[A-Za-z][^>]*>/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "");
  return collapseWhitespace(decodeEntities(stripped));
}

/** The first prose paragraph of a Markdown/MDX body, as a plain-text excerpt. */
export function excerpt(markdown: string, maxLength = 155): string {
  const paragraphs = markdown
    .replace(/```[\s\S]*?```/g, "\n\n")
    .replace(/~~~[\s\S]*?~~~/g, "\n\n")
    .split(/\n\s*\n/)
    .map((block) => block.trim());

  const text =
    paragraphs
      .filter(isProse)
      .map(toPlainText)
      .find((plain) => plain.length > 0) ?? "";
  return truncate(text, maxLength);
}
