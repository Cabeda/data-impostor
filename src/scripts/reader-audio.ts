import { audioReducer, initialAudioPlayback } from "../lib/audio-state";
import { chapterIndex } from "../lib/reader-chapters";
import {
  READER_PREFS_KEY,
  parseReaderPrefs,
  serializeReaderPrefs,
  type ReaderPrefs,
} from "../lib/reader-prefs";

interface Sentence {
  el: HTMLElement;
  text: string;
  chapter: number;
}

const playback = { ...initialAudioPlayback };
const state = {
  listen: false,
  rate: 1,
  voice: null as SpeechSynthesisVoice | null,
  hasVoices: false,
  get speaking() {
    return playback.speaking;
  },
  set speaking(value: boolean) {
    playback.speaking = value;
  },
  get paused() {
    return playback.paused;
  },
  set paused(value: boolean) {
    playback.paused = value;
  },
  get finished() {
    return playback.finished;
  },
  set finished(value: boolean) {
    playback.finished = value;
  },
  get idx() {
    return playback.idx;
  },
  set idx(value: number) {
    playback.idx = value;
  },
};

let initialized = false;
let prepared = false;
let article: HTMLElement | null = null;
let dock: HTMLElement | null = null;
let headings: HTMLElement[] = [];
let sentences: Sentence[] = [];
let current: HTMLElement | null = null;
let simTimer: ReturnType<typeof setTimeout> | undefined;

function prefs(): ReaderPrefs {
  try {
    return parseReaderPrefs(localStorage.getItem(READER_PREFS_KEY));
  } catch {
    return parseReaderPrefs(null);
  }
}

function savePrefs(patch: Partial<ReaderPrefs>): ReaderPrefs {
  const next = { ...prefs(), ...patch };
  try {
    localStorage.setItem(READER_PREFS_KEY, serializeReaderPrefs(next));
  } catch {}
  return next;
}

function synth(): SpeechSynthesis | null {
  return typeof window !== "undefined" && window.speechSynthesis
    ? window.speechSynthesis
    : null;
}

function chapterOf(el: Element): number {
  if (el.tagName === "H2") {
    return Math.max(0, headings.indexOf(el as HTMLElement));
  }
  let node: Element | null = el;
  while (node && node !== article) {
    let prev = node.previousElementSibling;
    while (prev) {
      if (prev.tagName === "H2") {
        return Math.max(0, headings.indexOf(prev as HTMLElement));
      }
      prev = prev.previousElementSibling;
    }
    node = node.parentElement;
  }
  return 0;
}

function unwrapSentences() {
  if (!article) return;
  article.querySelectorAll<HTMLElement>(".tts-sentence").forEach((span) => {
    span.replaceWith(document.createTextNode(span.textContent || ""));
  });
  sentences = [];
  current = null;
}

function prepareSentences() {
  if (!article || prepared) return;
  prepared = true;

  const titleElement = document.querySelector<HTMLElement>(".reader-hero h1");
  if (titleElement) {
    const titleText = titleElement.textContent?.trim();
    if (titleText) {
      const span = document.createElement("span");
      span.className = "tts-sentence";
      span.textContent = `${titleText}. `;
      span.dataset.s = String(sentences.length);
      titleElement.textContent = "";
      titleElement.appendChild(span);
      sentences.push({ el: span, text: `${titleText}.`, chapter: 0 });
    }
  }

  const blocks = Array.from(article.querySelectorAll("p, li, blockquote, h2, h3"));
  for (const block of blocks) {
    if (block.closest("pre, code, figure")) continue;
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);

    for (const node of nodes) {
      const text = node.nodeValue || "";
      if (!text.trim()) continue;
      const parts = text.match(/[^.!?…]+[.!?…]+["')\]]*\s*|[^.!?…]+$/g) || [text];
      const frag = document.createDocumentFragment();

      for (const part of parts) {
        if (!part.trim()) {
          frag.appendChild(document.createTextNode(part));
          continue;
        }
        const span = document.createElement("span");
        span.className = "tts-sentence";
        span.textContent = part;
        span.dataset.s = String(sentences.length);
        sentences.push({ el: span, text: part.trim(), chapter: chapterOf(block) });
        frag.appendChild(span);
      }

      node.parentNode?.replaceChild(frag, node);
    }
  }
}

function loadVoices() {
  const api = synth();
  if (!api) {
    state.hasVoices = false;
    return;
  }
  const voices = api.getVoices().filter((v) => /^en/i.test(v.lang));
  state.voice = voices[0] ?? null;
  state.hasVoices = voices.length > 0;
}

function ensurePrepared() {
  prepareSentences();
  loadVoices();
}

function syncListenUI() {
  const root = document.documentElement;
  if (state.listen) root.dataset.listen = "on";
  else delete root.dataset.listen;

  document.querySelectorAll<HTMLElement>("[data-listen-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(state.listen));
  });
  document.querySelectorAll<HTMLElement>("[data-listen-label]").forEach((label) => {
    label.textContent = state.listen ? "Listening" : "Listen";
  });
}

function highlight(index: number) {
  if (current) current.classList.remove("is-speaking");
  const sentence = sentences[index];
  if (!sentence) return;
  current = sentence.el;
  sentence.el.classList.add("is-speaking");
}

function updateUI() {
  const icon = state.speaking ? (state.paused ? "▶" : "❚❚") : "▶";
  document.querySelectorAll<HTMLElement>("[data-audio-icon]").forEach((el) => {
    el.textContent = icon;
  });

  const mode = state.paused ? "Paused" : state.hasVoices ? "Listening" : "Simulated read";
  const status = !state.speaking
    ? state.finished
      ? "Finished · click any sentence"
      : state.listen
        ? "Ready · click any sentence"
        : "Not listening"
    : `${mode} · ${Math.min(state.idx + 1, sentences.length)}/${sentences.length}`;

  document.querySelectorAll<HTMLElement>("[data-audio-status]").forEach((el) => {
    el.textContent = status;
  });
  document.querySelectorAll<HTMLElement>("[data-audio-progress]").forEach((el) => {
    el.style.width = `${(((state.idx + 1) / Math.max(1, sentences.length)) * 100).toFixed(1)}%`;
  });
  document.querySelectorAll<HTMLElement>("[data-audio-locate]").forEach((el) => {
    el.hidden = !state.speaking;
  });
  if (state.speaking) {
    const chapter = sentences[state.idx]?.chapter ?? 0;
    document.querySelectorAll<HTMLElement>("[data-audio-chapter]").forEach((el) => {
      el.textContent = `Chapter ${chapter + 1} · ${headings[chapter]?.textContent ?? ""}`;
    });
  }
  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.playbackState =
        state.speaking && !state.paused ? "playing" : "paused";
    } catch {}
  }
}

function scheduleSim() {
  clearTimeout(simTimer);
  if (!state.speaking || state.paused) return;
  simTimer = setTimeout(() => {
    if (!state.speaking || state.paused) return;
    if (state.idx >= sentences.length - 1) {
      Object.assign(state, audioReducer(state, { type: "finish" }));
      updateUI();
      return;
    }
    state.idx += 1;
    highlight(state.idx);
    updateUI();
    scheduleSim();
  }, 2100 / state.rate);
}

function speakFrom(index: number) {
  const api = synth();
  if (!api) {
    state.hasVoices = false;
    highlight(index);
    updateUI();
    scheduleSim();
    return;
  }
  if (index >= sentences.length) {
    Object.assign(state, audioReducer(state, { type: "finish" }));
    updateUI();
    return;
  }

  state.idx = index;
  state.finished = false;
  state.speaking = true;
  state.paused = false;
  highlight(index);

  const next = new SpeechSynthesisUtterance(sentences[index].text);
  next.rate = state.rate;
  if (state.voice) next.voice = state.voice;
  next.onend = () => {
    if (!state.speaking || state.paused) return;
    speakFrom(index + 1);
  };
  next.onerror = (event) => {
    if (event.error === "interrupted" || event.error === "canceled") return;
    state.speaking = false;
    state.paused = false;
    updateUI();
  };
  api.speak(next);
  updateUI();
}

function seekTo(index: number) {
  Object.assign(state, audioReducer(state, { type: "seek", idx: index }));
  if (!state.speaking) {
    highlight(index);
    updateUI();
    return;
  }
  if (state.hasVoices) {
    synth()?.cancel();
    if (state.paused) {
      highlight(index);
      updateUI();
    } else {
      speakFrom(index);
    }
  } else {
    clearTimeout(simTimer);
    highlight(index);
    updateUI();
    scheduleSim();
  }
}

function play(from?: number) {
  ensurePrepared();
  if (typeof from === "number") state.idx = from;
  else if (state.finished) state.idx = 0;

  Object.assign(state, audioReducer(state, { type: "play", from: typeof from === "number" ? from : undefined }));

  if (state.hasVoices) {
    synth()?.cancel();
    speakFrom(state.idx);
  } else {
    highlight(state.idx);
    updateUI();
    scheduleSim();
  }
}

function stop() {
  Object.assign(state, audioReducer(state, { type: "stop" }));
  synth()?.cancel();
  clearTimeout(simTimer);
  if (current) {
    current.classList.remove("is-speaking");
    current = null;
  }
  updateUI();
}

function pause() {
  synth()?.pause();
  clearTimeout(simTimer);
  Object.assign(state, audioReducer(state, { type: "pause" }));
  updateUI();
}

function resume() {
  synth()?.resume();
  Object.assign(state, audioReducer(state, { type: "resume" }));
  updateUI();
  if (!state.hasVoices) scheduleSim();
}

function togglePlay() {
  if (!state.listen) {
    enableListen();
    return;
  }
  if (state.speaking && !state.paused) pause();
  else if (state.speaking && state.paused) resume();
  else play();
}

function enableListen() {
  savePrefs({ listen: true });
  state.listen = true;
  ensurePrepared();
  syncListenUI();
  updateUI();
}

function disableListen() {
  savePrefs({ listen: false });
  state.listen = false;
  stop();
  syncListenUI();
  updateUI();
}

function toggleListen() {
  if (state.listen) disableListen();
  else enableListen();
}

function currentChapterFromScroll(): number {
  return chapterIndex(
    headings.map((heading) => heading.getBoundingClientRect().top),
    window.innerHeight * 0.35,
  );
}

function startAtChapter(index: number) {
  const sentenceIndex = sentences.findIndex((sentence) => sentence.chapter >= index);
  if (sentenceIndex < 0) return;
  if (state.speaking || state.paused) {
    if (state.paused) play(sentenceIndex);
    else seekTo(sentenceIndex);
  }
}

function goChapter(index: number) {
  const heading = headings[index];
  if (!heading) return;
  heading.scrollIntoView({ behavior: "smooth", block: "start" });
  startAtChapter(index);
}

function stepChapter(direction: number) {
  const current = state.speaking
    ? sentences[state.idx]?.chapter ?? currentChapterFromScroll()
    : currentChapterFromScroll();
  goChapter(Math.min(headings.length - 1, Math.max(0, current + direction)));
}

function handleArticleClick(target: HTMLElement) {
  if (!state.listen || !article) return;
  if (target.closest("a")) return;
  if (window.getSelection()?.toString()) return;

  const span = target.closest<HTMLElement>(".tts-sentence");
  let index = span ? Number(span.dataset.s) : -1;

  if (index < 0) {
    const block = target.closest("p, li, blockquote");
    const first = block?.querySelector<HTMLElement>(".tts-sentence");
    if (first) index = Number(first.dataset.s);
  }
  if (index < 0 || Number.isNaN(index)) return;

  if (state.speaking && !state.paused) seekTo(index);
  else play(index);
}

function onClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  if (target.closest("[data-audio-toggle]")) {
    togglePlay();
    return;
  }
  if (target.closest("[data-audio-locate]")) {
    if (state.speaking) {
      sentences[state.idx]?.el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }
  const chapter = target.closest<HTMLElement>("[data-chapter]");
  if (chapter) {
    stepChapter(chapter.dataset.chapter === "prev" ? -1 : 1);
    return;
  }
  const link = target.closest<HTMLElement>("[data-chapter-link]");
  if (link && state.listen) {
    const index = Number(link.dataset.chapterLink);
    if (!Number.isNaN(index) && (state.speaking || state.paused)) {
      window.setTimeout(() => startAtChapter(index), 0);
    }
    return;
  }
  if (target.closest("#post-content")) {
    handleArticleClick(target);
  }
}

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  if (!target.matches("[data-rate]")) return;
  state.rate = Number(target.value) || 1;
  document.querySelectorAll<HTMLSelectElement>("[data-rate]").forEach((select) => {
    select.value = String(state.rate);
  });
  if (state.speaking && !state.paused) {
    if (state.hasVoices) {
      synth()?.cancel();
      speakFrom(state.idx);
    } else {
      scheduleSim();
    }
  }
}

function setupMediaSession() {
  if (!("mediaSession" in navigator)) return;
  try {
    const image = document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content || document.title,
      artist: "José Cabeda",
      album: "Data Impostor",
      artwork: image ? [{ src: image, sizes: "512x512", type: "image/jpeg" }] : [],
    });
    navigator.mediaSession.setActionHandler("play", () => play());
    navigator.mediaSession.setActionHandler("pause", pause);
    navigator.mediaSession.setActionHandler("nexttrack", () => stepChapter(1));
    navigator.mediaSession.setActionHandler("previoustrack", () => stepChapter(-1));
  } catch {}
}

export interface ReaderAudioApi {
  toggleListen: () => void;
  togglePlay: () => void;
  stop: () => void;
  refresh: () => void;
}

function refresh() {
  state.listen = prefs().listen;
  article = document.getElementById("post-content");
  dock = document.querySelector("[data-audio-dock]");
  if (!article || !dock) {
    stop();
    return;
  }

  headings = Array.from(article.querySelectorAll<HTMLElement>("h2"));

  prepared = false;
  sentences = [];
  if (current) {
    current.classList.remove("is-speaking");
    current = null;
  }
  unwrapSentences();
  Object.assign(state, audioReducer(state, { type: "reset" }));
  synth()?.cancel();
  clearTimeout(simTimer);

  if (state.listen) {
    ensurePrepared();
    syncListenUI();
  }
  updateUI();
}

export function initReaderAudio(): ReaderAudioApi {
  const api: ReaderAudioApi = { toggleListen, togglePlay, stop, refresh };
  if (initialized) return api;
  initialized = true;

  document.addEventListener("click", onClick);
  document.addEventListener("change", onChange);
  document.addEventListener("astro:before-swap", () => {
    stop();
  });
  document.addEventListener("astro:page-load", () => {
    refresh();
  });
  setupMediaSession();
  refresh();

  return api;
}
