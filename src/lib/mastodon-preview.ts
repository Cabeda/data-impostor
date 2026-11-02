/**
 * Mastodon content arrives as HTML and is rendered inside a card that is
 * already a link. Anchors inside it produce nested links — invalid HTML, and
 * the reason the list had unnamed, zero-sized links. The preview keeps the
 * text and drops the anchors; the post page keeps the real links.
 */

import { plainTextFromHtml, truncate } from "./text.ts";

const OPEN_ANCHOR = /<a\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi;
const CLOSE_ANCHOR = /<\/a\s*>/gi;

export function stripLinks(html: string): string {
  return html.replace(OPEN_ANCHOR, "").replace(CLOSE_ANCHOR, "");
}

/** A card's accessible name and preview line: the post as one plain sentence. */
export function previewText(html: string, maxLength = 80): string {
  return truncate(plainTextFromHtml(html), maxLength);
}
