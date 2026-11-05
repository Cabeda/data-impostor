import { audioReducer, initialAudioPlayback } from "../lib/audio-state";
import { chapterIndex } from "../lib/reader-chapters";
import { buildNarration, spellText, type NarrationSegment, type NarrationMode } from "../lib/reader-narration";
import {
  READER_PREFS_KEY,
  parseReaderPrefs,
  serializeReaderPrefs,
  type ReaderPrefs,
} from "../lib/reader-prefs";

interface Sentence extends NarrationSegment {
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
let speechTimer: ReturnType<typeof setTimeout> | undefined;
let generation = 0;
let pendingNext: number | null = null;
let noteReturn: number | null = null;
let narrationMode: NarrationMode = "adapted";
let selectedText = "";
let spelling = false;

function cancelSpeech() {
  generation++;
  clearTimeout(speechTimer);
  pendingNext = null;
  spelling = false;
  synth()?.cancel();
}

function spellSelection() {
  const api = synth();
  if (!api || !state.hasVoices || !selectedText) return;
  const wasSpeaking = state.speaking;
  const wasPaused = state.paused;
  const returnIndex = state.idx;
  cancelSpeech();
  clearTimeout(simTimer);
  const token = generation;
  spelling = true;
  state.speaking = true;
  state.paused = false;
  const utterance = new SpeechSynthesisUtterance(`Spelling selection. ${spellText(selectedText)}`);
  utterance.lang = "en";
  utterance.rate = state.rate;
  if (state.voice) utterance.voice = state.voice;
  utterance.onend = () => {
    if (token !== generation) return;
    generation++;
    spelling = false;
    const remainPaused = wasPaused || state.paused;
    if (wasSpeaking && !remainPaused) play(returnIndex);
    else {
      state.speaking = wasSpeaking || remainPaused;
      state.paused = remainPaused;
      if (remainPaused) pendingNext = returnIndex;
      updateUI();
    }
  };
  utterance.onerror = () => {
    if (token !== generation) return;
    spelling = false;
    state.speaking = false;
    state.paused = false;
    updateUI();
  };
  api.resume();
  api.speak(utterance);
  updateUI();
}

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
  document.querySelectorAll<HTMLElement>("[data-narration-source]").forEach((el) => {
    el.classList.remove("tts-sentence", "is-speaking");
    delete el.dataset.s;
    delete el.dataset.narrationSource;
  });
  sentences = [];
  current = null;
}

function sourceSegments(root: HTMLElement, mode: NarrationMode): Sentence[] {
  return buildNarration(root, mode).map((segment) => ({ ...segment, chapter: chapterOf(segment.el) }));
}

function indexSources() {
  document.querySelectorAll<HTMLElement>("[data-narration-source]").forEach((el) => {
    el.classList.remove("tts-sentence");
    delete el.dataset.s;
    delete el.dataset.narrationSource;
  });
  sentences.forEach((segment, index) => {
    if (segment.el.dataset.narrationSource) return;
    segment.el.classList.add("tts-sentence");
    segment.el.dataset.narrationSource = "true";
    segment.el.dataset.s = String(index);
  });
}

function prepareSentences() {
  if (!article || prepared) return;
  prepared = true;
  narrationMode = prefs().narration || "adapted";
  const title = document.querySelector<HTMLElement>(".reader-hero h1");
  sentences = [
    ...(title ? sourceSegments(title, narrationMode) : []),
    ...sourceSegments(article, narrationMode),
  ];
  indexSources();
}

function changeNarrationMode(mode: NarrationMode) {
  const source = sentences[state.idx];
  const playing = state.speaking;
  const paused = state.paused;
  cancelSpeech();
  clearTimeout(simTimer);
  savePrefs({ narration: mode });
  prepared = false;
  prepareSentences();
  const match = sentences.findIndex((segment) => segment.el === source?.el && segment.text === source.text);
  const blockMatch = sentences.findIndex((segment) => segment.block === source?.block);
  state.idx = Math.max(0, match >= 0 ? match : blockMatch);
  noteReturn = null;
  if (playing && !paused) play(state.idx);
  else {
    if (playing && paused) pendingNext = state.idx;
    highlight(state.idx);
    updateUI();
  }
}

function readFullBlock() {
  const segment = sentences[state.idx];
  if (!segment?.hasDetails) return;
  cancelSpeech();
  clearTimeout(simTimer);
  const start = sentences.findIndex((item) => item.block === segment.block);
  let end = start;
  while (end < sentences.length && sentences[end].block === segment.block) end++;
  sentences.splice(start, end - start, ...sourceSegments(segment.block, "original"));
  indexSources();
  noteReturn = null;
  play(start);
}

function skipBlock() {
  const block = sentences[state.idx]?.block;
  let next = state.idx + 1;
  while (next < sentences.length && sentences[next].block === block) next++;
  cancelSpeech();
  clearTimeout(simTimer);
  if (next >= sentences.length) {
    Object.assign(state, audioReducer(state, { type: "finish" }));
    updateUI();
  } else if (state.speaking && !state.paused) play(next);
  else {
    state.idx = next;
    if (state.speaking && state.paused) pendingNext = next;
    highlight(next);
    updateUI();
  }
}

function loadVoices() {
  const api = synth();
  if (!api) {
    state.hasVoices = false;
    state.voice = null;
    return;
  }
  const voices = api.getVoices().filter((v) => /^en/i.test(v.lang));
  state.hasVoices = voices.length > 0;
  const preferred = prefs().voice;
  state.voice = (preferred && voices.find((v) => v.voiceURI === preferred)) || voices[0] || null;
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

  const mode = state.paused ? "Paused" : spelling ? "Spelling selection" : state.hasVoices ? "Listening" : "Simulated read";
  const status = !state.speaking
    ? state.finished
      ? "Finished · click article text"
      : state.listen
        ? "Ready · click article text"
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
  document.querySelectorAll<HTMLSelectElement>("[data-narration-mode]").forEach((el) => { el.value = narrationMode; });
  document.querySelectorAll<HTMLButtonElement>("[data-audio-details]").forEach((el) => { el.hidden = !sentences[state.idx]?.hasDetails; });
  document.querySelectorAll<HTMLButtonElement>("[data-audio-return]").forEach((el) => { el.hidden = noteReturn === null; });
  document.querySelectorAll<HTMLButtonElement>("[data-audio-skip], [data-audio-replay]").forEach((el) => { el.disabled = !sentences.length; });
  document.querySelectorAll<HTMLButtonElement>("[data-audio-spell]").forEach((el) => { el.disabled = !selectedText || !state.hasVoices; });
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

  const token = ++generation;
  const next = new SpeechSynthesisUtterance(sentences[index].text);
  next.lang = sentences[index].lang || "en";
  next.rate = state.rate;
  const language = next.lang.split("-")[0].toLowerCase();
  const voice = state.voice?.lang.toLowerCase().startsWith(language) ? state.voice
    : api.getVoices().find((candidate) => candidate.lang.split("-")[0].toLowerCase() === language);
  if (voice) next.voice = voice;
  next.onend = () => {
    if (token !== generation || !state.speaking || state.idx !== index || pendingNext !== null) return;
    pendingNext = index + 1;
    const advance = () => {
      if (token !== generation || !state.speaking || state.paused) return;
      const nextIndex = pendingNext;
      pendingNext = null;
      if (nextIndex !== null) speakFrom(nextIndex);
    };
    if (!state.paused) speechTimer = setTimeout(advance, sentences[index].pauseAfter);
  };
  next.onerror = (event) => {
    if (token !== generation || event.error === "interrupted" || event.error === "canceled") return;
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
    cancelSpeech();
    if (state.paused) {
      pendingNext = index;
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
  if (!sentences.length) return;
  if (typeof from === "number") state.idx = from;
  else if (state.finished) state.idx = 0;

  Object.assign(state, audioReducer(state, { type: "play", from: typeof from === "number" ? from : undefined }));

  if (state.hasVoices) {
    cancelSpeech();
    synth()?.resume();
    speakFrom(state.idx);
  } else {
    highlight(state.idx);
    updateUI();
    scheduleSim();
  }
}

function stop() {
  Object.assign(state, audioReducer(state, { type: "stop" }));
  cancelSpeech();
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
  if (pendingNext !== null) {
    const next = pendingNext;
    pendingNext = null;
    clearTimeout(speechTimer);
    Object.assign(state, audioReducer(state, { type: "resume" }));
    synth()?.resume();
    speakFrom(next);
    return;
  }
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
  play();
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
  } else {
    state.idx = sentenceIndex;
    highlight(sentenceIndex);
    updateUI();
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
  const note = target.closest<HTMLAnchorElement>("a[data-footnote-ref], a[data-footnote-backref]");
  if (note) {
    const destination = article.ownerDocument.getElementById(decodeURIComponent(note.hash.slice(1)));
    if (note.hasAttribute("data-footnote-backref") && noteReturn !== null) {
      const back = noteReturn; noteReturn = null; play(back);
    } else if (destination && article.contains(destination)) {
      const section = destination.closest<HTMLElement>("section[data-footnotes], section.footnotes");
      if (section && sentences.some((segment) => segment.block === section && segment.hasDetails)) {
        const summaryIndex = sentences.findIndex((segment) => segment.block === section);
        sentences.splice(summaryIndex, 1, ...sourceSegments(section, "original"));
        indexSources();
      }
      const index = sentences.findIndex((segment) => destination === segment.el || destination.contains(segment.el));
      if (index >= 0) {
        const source = note.closest<HTMLElement>("[data-narration-source]");
        const referring = sentences.findIndex((segment) => segment.el === source && segment.text.includes(`footnote ${note.textContent?.trim()}`));
        noteReturn = referring >= 0 ? referring : state.idx;
        play(index);
      }
    }
    return;
  }
  if (target.closest("a, button, input, summary")) return;
  if (window.getSelection()?.toString()) return;

  const span = target.closest<HTMLElement>(".tts-sentence");
  let index = span ? Number(span.dataset.s) : -1;

  if (index < 0) {
    const block = target.closest("p, li, blockquote, pre, table, figure, math");
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
  if (target.closest("[data-audio-details]")) { readFullBlock(); return; }
  if (target.closest("[data-audio-spell]")) { spellSelection(); return; }
  if (target.closest("[data-audio-skip]")) { skipBlock(); return; }
  if (target.closest("[data-audio-replay]")) { play(state.idx); return; }
  if (target.closest("[data-audio-return]")) {
    if (noteReturn !== null) { const back = noteReturn; noteReturn = null; play(back); }
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
      cancelSpeech();
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
  noteReturn = null;
  narrationMode = prefs().narration || "adapted";
  selectedText = "";
  sentences = [];
  if (current) {
    current.classList.remove("is-speaking");
    current = null;
  }
  unwrapSentences();
  Object.assign(state, audioReducer(state, { type: "reset" }));
  cancelSpeech();
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
  document.addEventListener("di:narration-changed", (event) => {
    const { narration } = (event as CustomEvent<{ narration: NarrationMode }>).detail;
    if (state.listen) changeNarrationMode(narration);
  });
  document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();
    selectedText = selection && article?.contains(selection.anchorNode) && article.contains(selection.focusNode)
      ? selection.toString() : "";
    updateUI();
  });
  document.addEventListener("toggle", (event) => {
    if (state.listen && article?.contains(event.target as Node)) changeNarrationMode(narrationMode);
  }, true);
  document.addEventListener("astro:before-swap", () => {
    stop();
  });
  document.addEventListener("astro:page-load", () => {
    refresh();
  });
  document.addEventListener("di:voice-changed", (event) => {
    const detail = (event as CustomEvent<{ voiceURI?: string }>).detail;
    const voices = synth()?.getVoices().filter((v) => /^en/i.test(v.lang)) ?? [];
    state.voice = (detail?.voiceURI && voices.find((v) => v.voiceURI === detail.voiceURI)) || state.voice;
    if (state.speaking && !state.paused && state.hasVoices) {
      cancelSpeech();
      speakFrom(state.idx);
    }
  });
  const synthApi = synth();
  if (synthApi) {
    const previous = synthApi.onvoiceschanged;
    synthApi.onvoiceschanged = () => {
      if (typeof previous === "function") (previous as () => void)();
      loadVoices();
    };
  }
  loadVoices();
  setupMediaSession();
  refresh();

  return api;
}
