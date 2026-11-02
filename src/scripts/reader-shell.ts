import { chapterIndex } from "../lib/reader-chapters";

interface Elements {
  header: HTMLElement | null;
  hero: HTMLElement | null;
  sheet: HTMLElement | null;
  contentsToggle: HTMLElement | null;
  track: HTMLElement | null;
  article: HTMLElement | null;
  headings: HTMLElement[];
  links: HTMLElement[];
  labels: HTMLElement[];
  progressBars: HTMLElement[];
  minutesLeft: HTMLElement[];
  readMin: number;
  hasHero: boolean;
}

let elements: Elements | null = null;
let started = false;
let ticking = false;
let currentChapter = -1;
let lastStripChapter = -1;
let lastFocus: HTMLElement | null = null;

function query(): Elements {
  const article = document.getElementById("post-content");
  const hero = document.querySelector<HTMLElement>(".reader-hero");
  return {
    header: document.querySelector<HTMLElement>("[data-reader-header]"),
    hero,
    sheet: document.querySelector<HTMLElement>("[data-contents-sheet]"),
    contentsToggle: document.querySelector<HTMLElement>("[data-contents-toggle]"),
    track: document.querySelector<HTMLElement>(".chapter-track"),
    article,
    headings: article ? Array.from(article.querySelectorAll<HTMLElement>("h2")) : [],
    links: Array.from(document.querySelectorAll<HTMLElement>("[data-chapter-link]")),
    labels: Array.from(document.querySelectorAll<HTMLElement>("[data-chapter-label]")),
    progressBars: Array.from(document.querySelectorAll<HTMLElement>("[data-progress]")),
    minutesLeft: Array.from(document.querySelectorAll<HTMLElement>("[data-minutes-left]")),
    readMin: Number(article?.dataset.readMinutes || 1),
    hasHero: !!hero?.classList.contains("has-image"),
  };
}

function bind() {
  elements = query();
  currentChapter = -1;
  lastStripChapter = -1;
  document.body.style.overflow = "";
  onScroll();
}

function scrollProgress(el: Elements): number {
  if (!el.article) return 0;
  const rect = el.article.getBoundingClientRect();
  const total = Math.max(1, rect.height - window.innerHeight * 0.45);
  return Math.min(1, Math.max(0, (window.innerHeight * 0.35 - rect.top) / total));
}

function centerStrip(el: Elements) {
  if (!el.track || currentChapter === lastStripChapter) return;
  lastStripChapter = currentChapter;
  const active = el.track.querySelector<HTMLElement>(".is-current");
  if (!active) return;
  const trackRect = el.track.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  const target =
    el.track.scrollLeft +
    (activeRect.left - trackRect.left) -
    (trackRect.width - activeRect.width) / 2;
  el.track.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
}

function onScroll() {
  const el = elements;
  if (!el?.article || el.headings.length === 0) return;

  // Read pass: all measurements before any writes.
  const progress = scrollProgress(el);
  const tops = el.headings.map((heading) => heading.getBoundingClientRect().top);
  const index = chapterIndex(tops, window.innerHeight * 0.35);
  const solid = !el.hasHero || !el.hero || window.scrollY > el.hero.offsetHeight - 80;
  const minutes = `${Math.max(1, Math.ceil(el.readMin * (1 - progress)))} min left`;

  // Write pass.
  el.progressBars.forEach((bar) => {
    bar.style.width = `${(progress * 100).toFixed(1)}%`;
  });
  el.minutesLeft.forEach((node) => {
    node.textContent = minutes;
  });
  el.labels.forEach((node) => {
    node.textContent = `${String(index + 1).padStart(2, "0")} · ${el.headings[index]?.textContent ?? ""}`;
  });
  el.links.forEach((link) => {
    link.classList.toggle("is-current", Number(link.dataset.chapterLink) === index);
  });
  if (el.header) el.header.dataset.solid = String(solid);
  currentChapter = index;
  centerStrip(el);
}

function requestScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    onScroll();
    ticking = false;
  });
}

function openSheet() {
  const el = elements;
  if (!el?.sheet) return;
  lastFocus = document.activeElement as HTMLElement;
  el.sheet.classList.add("is-open");
  el.sheet.setAttribute("aria-hidden", "false");
  el.contentsToggle?.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  el.sheet.querySelector<HTMLElement>(".contents-close")?.focus();
}

function closeSheet() {
  const el = elements;
  if (!el?.sheet?.classList.contains("is-open")) return;
  el.sheet.classList.remove("is-open");
  el.sheet.setAttribute("aria-hidden", "true");
  el.contentsToggle?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  lastFocus?.focus?.();
}

function toggleSheet() {
  if (elements?.sheet?.classList.contains("is-open")) closeSheet();
  else openSheet();
}

function onClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.closest("[data-contents-close]")) return closeSheet();
  if (target.closest("[data-contents-toggle]")) return toggleSheet();
  if (target.closest("[data-chapter-link]")) closeSheet();
  const menuLink = target.closest(".reader-menu a");
  if (menuLink) {
    const menu = menuLink.closest(".reader-menu");
    if (menu) menu.removeAttribute("open");
  }

function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement;
  const tag = target?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  if (event.key === "Escape") return closeSheet();
  if (event.key.toLowerCase() === "c" && target?.isContentEditable !== true) {
    toggleSheet();
  }
}

/** Bind once per page; rebind node lists when Astro swaps the body. */
export function initReaderShell() {
  bind();
  if (started) return;
  started = true;
  window.addEventListener("scroll", requestScroll, { passive: true });
  window.addEventListener("resize", requestScroll);
  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("astro:page-load", bind);
}
