/**
 * Small text helpers shared by the two places that turn stored content into
 * something a page or a meta tag can carry.
 */

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

export function decodeEntities(text: string): string {
  return text.replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity] ?? " ");
}

export function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** HTML to one plain line: tags, entities and runs of whitespace gone. */
export function plainTextFromHtml(html: string): string {
  return collapseWhitespace(decodeEntities(html.replace(/<[^>]+>/g, " ")));
}

/** Cut at a word boundary, never past `maxLength` including the ellipsis. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  const cut = text.slice(0, maxLength - 1);
  const boundary = cut.lastIndexOf(" ");
  const body = (boundary > maxLength / 2 ? cut.slice(0, boundary) : cut)
    .replace(/[\s,;:.!?–—-]+$/, "")
    .trim();
  return `${body}…`;
}
