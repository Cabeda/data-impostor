/** A speech presentation derived from the DOM; article markup stays untouched. */
export type NarrationMode = "adapted" | "original";
export interface NarrationSegment {
  el: HTMLElement;
  block: HTMLElement;
  text: string;
  kind: "prose" | "heading" | "code" | "table" | "image" | "math" | "description" | "note";
  pauseAfter: number;
  hasDetails?: boolean;
  lang?: string;
}

const ignored = "script, style, template, button, select, textarea, nav, [data-listen-ignore], [data-footnote-backref]";
const blockTags = /^(P|DIV|SECTION|ARTICLE|ASIDE|BLOCKQUOTE|FIGURE|FIGCAPTION|PRE|TABLE|UL|OL|LI|DL|DT|DD|DETAILS|SUMMARY|H[1-6]|HR|MATH)$/;
const clean = (text: string) => text.replace(/\s+/g, " ").trim();

function omitted(el: Element): boolean {
  if (el.matches(ignored) || el.hasAttribute("hidden") || el.getAttribute("aria-hidden") === "true") return true;
  const style = el.ownerDocument.defaultView?.getComputedStyle(el);
  return style?.display === "none" || style?.visibility === "hidden" || style?.visibility === "collapse";
}

function inlineText(node: Node, mode: NarrationMode): string {
  if (node.nodeType === 3) return node.textContent || "";
  if (node.nodeType !== 1) return "";
  const el = node as HTMLElement;
  if (omitted(el)) return "";
  if (el.tagName === "CODE" && mode === "original") return speakCode(el.textContent || "");
  if (el.dataset.say) return el.dataset.say;
  if (el.matches("math, [role=math]")) return el.getAttribute("aria-label") || el.getAttribute("alttext") || `Mathematical notation; no spoken description is provided. ${el.textContent}`;
  if (el.tagName === "BR") return " ";
  if (el.tagName === "IMG") return el.getAttribute("alt") || "";
  if (el.matches("[data-footnote-ref]")) return ` footnote ${el.textContent} `;
  const text = Array.from(el.childNodes).map((child) => inlineText(child, mode)).join("");
  if (el.matches("s, del")) return ` deleted text: ${text}; end deleted text `;
  if (mode === "original" && el.tagName === "A") {
    const href = el.getAttribute("href") || "";
    if (/^https?:/.test(href) && clean(text) !== href) return `${text} (${href})`;
  }
  return text;
}

function itemNumber(item: HTMLElement): number | null {
  const list = item.parentElement;
  if (list?.tagName !== "OL") return null;
  const items = Array.from(list.children).filter((child) => child.tagName === "LI");
  const step = list.hasAttribute("reversed") ? -1 : 1;
  const integer = (value: string | null) => value !== null && /^[+-]?\d+$/.test(value.trim()) ? Number(value) : null;
  let value = integer(list.getAttribute("start")) ?? (step < 0 ? items.length : 1);
  for (const sibling of items) {
    value = integer(sibling.getAttribute("value")) ?? value;
    if (sibling === item) return value;
    value += step;
  }
  return null;
}

/** In detail reading, say syntax explicitly instead of trusting voice punctuation settings. */
export function speakCode(text: string): string {
  const symbols: Record<string, string> = {
    "(": "open parenthesis", ")": "close parenthesis", "[": "open bracket", "]": "close bracket",
    "{": "open brace", "}": "close brace", "<": "less than", ">": "greater than", "=": "equals",
    "+": "plus", "-": "dash", "*": "asterisk", "/": "slash", "\\": "backslash", "_": "underscore",
    ".": "dot", ",": "comma", ":": "colon", ";": "semicolon", "'": "single quote", '"': "double quote",
    "`": "backtick", "!": "exclamation mark", "?": "question mark", "&": "ampersand", "|": "vertical bar",
    "$": "dollar sign", "#": "hash", "%": "percent", "@": "at sign", "^": "caret", "~": "tilde",
  };
  // Explicit whitespace preserves strings, alignment, trailing spaces and mixed indentation.
  return clean((text.match(/ +|\t+|[^ \t]+/g) || []).map((token) => {
    if (/^ +$/.test(token)) return `${token.length} ${token.length === 1 ? "space" : "spaces"}`;
    if (/^\t+$/.test(token)) return `${token.length} ${token.length === 1 ? "tab" : "tabs"}`;
    return Array.from(token).map((char) => symbols[char] ? ` ${symbols[char]} ` : char).join("");
  }).join(" "));
}

/** Explicit spelling is optional: continuous narration need not spell every identifier. */
export function spellText(text: string): string {
  return Array.from(text).map((char) => {
    if (/[A-Z]/.test(char)) return `capital ${char}`;
    if (/[a-z]/.test(char)) return `lowercase ${char}`;
    if (/\d/.test(char)) return `digit ${char}`;
    if (char === "\n") return "new line";
    if (char === "\r") return "carriage return";
    return speakCode(char) || `character ${char}`;
  }).join(", ");
}

/** Compile source-mapped segments in reading order, including nested Markdown and HTML. */
export function buildNarration(root: HTMLElement, mode: NarrationMode = "adapted"): NarrationSegment[] {
  const segments: NarrationSegment[] = [];
  const announcedItems = new Set<Element>();
  const langOf = (el: HTMLElement) => el.closest<HTMLElement>("[lang]")?.lang || "en";

  function add(el: HTMLElement, text: string, kind: NarrationSegment["kind"] = "prose", block = el, hasDetails = false) {
    text = clean(text);
    if (!text) return;
    const item = el.closest<HTMLElement>("li");
    if (item && !announcedItems.has(item)) {
      const number = itemNumber(item);
      const checkbox = item.querySelector<HTMLInputElement>(":scope > input[type=checkbox], :scope > p > input[type=checkbox]");
      text = `${number === null ? "" : `${number}. `}${checkbox ? checkbox.checked ? "Checked. " : "Not checked. " : ""}${text}`;
      announcedItems.add(item);
    }
    segments.push({ el, block, text, kind, hasDetails, pauseAfter: kind === "heading" ? 450 : 180, lang: langOf(el) });
  }

  function prose(el: HTMLElement, text: string, block: HTMLElement) {
    const value = clean(text).replace(/([.!?])\s+footnote\s+(\d+)\b/g, " (footnote $2)$1");
    if (!value) return;
    // Segment after collecting inline markup, so emphasis and links don't interrupt a sentence.
    const parts = new Intl.Segmenter(langOf(el), { granularity: "sentence" }).segment(value);
    for (const part of parts) add(el, part.segment, "prose", block);
  }

  function container(el: HTMLElement, group?: HTMLElement) {
    let buffer = "";
    const flush = () => { prose(el, buffer, group || el); buffer = ""; };
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType === 1) {
        const child = node as HTMLElement;
        if (blockTags.test(child.tagName) || child.hasAttribute("data-listen-summary") || child.matches("img, svg[role=img], math, [role=math]") || child.querySelector("[data-listen-summary], math, [role=math], svg[role=img]")) {
          flush();
          visit(child, group);
          continue;
        }
      }
      buffer += inlineText(node, mode);
    }
    flush();
  }

  function table(el: HTMLTableElement, group: HTMLElement) {
    const caption = el.caption ? clean(inlineText(el.caption, mode)) : "";
    add(el, `Table${caption ? `: ${caption}` : ""}.`, "table", group);
    const rows = Array.from(el.rows);
    const hiddenInTable = (element: Element) => {
      for (let node: Element | null = element; node && node !== el; node = node.parentElement) {
        if (omitted(node)) return true;
      }
      return false;
    };
    // Expand spans into a logical grid so labels stay associated with each value.
    const grid: HTMLTableCellElement[][] = [];
    rows.forEach((row, r) => {
      grid[r] ??= [];
      let c = 0;
      for (const cell of Array.from(row.cells)) {
        while (grid[r][c]) c++;
        const remainingInGroup = rows.slice(r).filter((candidate) => candidate.parentElement === row.parentElement).length;
        const rowSpan = cell.getAttribute("rowspan") === "0" ? remainingInGroup : Math.min(remainingInGroup, Math.max(1, cell.rowSpan));
        for (let dr = 0; dr < rowSpan && r + dr < rows.length; dr++) {
          grid[r + dr] ??= [];
          for (let dc = 0; dc < Math.max(1, cell.colSpan); dc++) grid[r + dr][c + dc] = cell;
        }
        c += Math.max(1, cell.colSpan);
      }
    });
    const headerCount = rows.filter((row) => row.parentElement === el.tHead).length || (rows[0] && Array.from(rows[0].cells).every((cell) => cell.tagName === "TH") ? 1 : 0);
    let spokenRow = 0;
    for (let r = headerCount; r < rows.length; r++) {
      if (hiddenInTable(rows[r])) continue;
      spokenRow++;
      const seen = new Set<Element>();
      const cells = (grid[r] || []).flatMap((cell, c) => {
        if (hiddenInTable(cell)) return [];
        if (seen.has(cell)) return [];
        seen.add(cell);
        const explicit = (cell.getAttribute("headers") || "").split(/\s+/).filter(Boolean)
          .map((id) => el.ownerDocument.getElementById(id)).filter((header) => header && el.contains(header));
        const column = grid.slice(0, headerCount).map((row) => row[c]).filter(Boolean);
        const headers = (explicit.length ? explicit : column).filter((header) => !hiddenInTable(header!));
        const label = Array.from(new Set(headers.map((header) => clean(inlineText(header!, mode))).filter(Boolean))).join(", ") || `Column ${c + 1}`;
        const value = clean(inlineText(cell, mode)) || "empty";
        return [`${label}: ${value}.`];
      });
      add(rows[r], `Row ${spokenRow}. ${cells.join(" ")}`, "table", group);
    }
    add(el, "End table.", "table", group);
  }

  function visit(el: HTMLElement, group?: HTMLElement) {
    if (omitted(el)) return;
    // A caption repeated verbatim in a single image's alt text should be heard once.
    if (el.tagName === "FIGCAPTION" && el.parentElement?.tagName === "FIGURE") {
      const images = el.parentElement.querySelectorAll("img");
      if (images.length === 1 && clean(images[0].alt) === clean(el.textContent || "")) return;
    }
    const summary = el.dataset.listenSummary?.trim();
    if (summary && el.dataset.listenReviewed === "true" && mode === "adapted") {
      add(el, `Adapted description. ${summary} Full content is available using Read full block.`, "description", group || el, true);
      return;
    }
    // A summary wrapper is one navigable block in either presentation.
    const block = group || (summary ? el : undefined);
    if (el.matches("section[data-footnotes], section.footnotes") && mode === "adapted") {
      const count = el.querySelectorAll("ol > li").length;
      add(el, `Footnotes. ${count} notes available using Read full block.`, "note", block || el, true);
      return;
    }
    if (el.tagName === "PRE") {
      const language = el.querySelector("code")?.className.match(/language-([\w+-]+)/)?.[1] || el.dataset.language || "";
      add(el, `${language ? `${language} ` : ""}Code listing. Syntax is read explicitly.`, "code", block || el);
      (el.textContent || "").replace(/\n$/, "").split("\n").forEach((line, index) => {
        const indent = line.match(/^[\t ]*/)?.[0] || "";
        const indentation = indent ? `Indent ${speakCode(indent)}. ` : "";
        add(el, `Line ${index + 1}. ${indentation}${speakCode(line.slice(indent.length)) || "Blank line"}.`, "code", block || el);
      });
      add(el, "End code listing.", "code", block || el);
      return;
    }
    if (el.tagName === "TABLE") { table(el as HTMLTableElement, block || el); return; }
    if (el.tagName === "IMG" || el.matches("svg[role=img]")) {
      const alt = el.getAttribute("alt") ?? el.getAttribute("aria-label");
      if (alt === "" || el.getAttribute("role") === "presentation") return;
      add(el, alt ? `Image. ${alt}` : "Image without a description.", "image", block || el);
      return;
    }
    if (el.localName === "math" || el.getAttribute("role") === "math") {
      const spoken = el.dataset.say || el.getAttribute("aria-label") || el.getAttribute("alttext");
      add(el, spoken || `Mathematical notation; no spoken description is provided. ${el.textContent}`, "math", block || el);
      return;
    }
    if (/^H[1-6]$/.test(el.tagName)) { add(el, inlineText(el, mode), "heading", block || el); return; }
    if (el.tagName === "HR") {
      if (segments.length) segments[segments.length - 1].pauseAfter = 650;
      return;
    }
    if (el.tagName === "DETAILS" && !el.hasAttribute("open")) {
      const label = el.querySelector<HTMLElement>(":scope > summary");
      if (label) add(label, `${inlineText(label, mode)}. Collapsed section.`, "prose", block || el);
      return;
    }
    if (el.tagName === "BLOCKQUOTE") {
      add(el, "Quotation.", "prose", block || el);
      container(el, block || el);
      add(el, "End quotation.", "prose", block || el);
      return;
    }
    if (el.tagName === "ASIDE") {
      add(el, "Aside.", "prose", block || el);
      container(el, block || el);
      add(el, "End aside.", "prose", block || el);
      return;
    }
    // Lists retain individual item groups, unless an authored wrapper groups the example.
    container(el, block || (el.tagName === "LI" || el.tagName === "ASIDE" ? el : undefined));
  }

  visit(root);
  return segments;
}
