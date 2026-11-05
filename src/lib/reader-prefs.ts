export const READER_PREFS_KEY = "di:reader-prefs";

export const THEMES = ["paper", "sepia", "night"] as const;
export const SIZES = ["s", "m", "l"] as const;
export const FACES = ["serif", "sans"] as const;

export type Theme = (typeof THEMES)[number];
export type Size = (typeof SIZES)[number];
export type Face = (typeof FACES)[number];

export interface ReaderPrefs {
  theme: Theme;
  size: Size;
  face: Face;
  listen: boolean;
  voice?: string;
  narration?: "adapted" | "original";
}

export const THEME_COLORS: Record<Theme, string> = {
  paper: "#fbf8f1",
  sepia: "#f2e6d1",
  night: "#000000",
};

export const DEFAULT_READER_PREFS: ReaderPrefs = {
  theme: "paper",
  size: "m",
  face: "serif",
  listen: false,
};

export function systemTheme(): Theme {
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "paper";
  }
  return "paper";
}

function oneOf<T extends string>(values: readonly T[], value: unknown, fallback: T): T {
  return typeof value === "string" && (values as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

export function parseReaderPrefs(raw: string | null | undefined): ReaderPrefs {
  const fallbackTheme = systemTheme();
  if (!raw) return { ...DEFAULT_READER_PREFS, theme: fallbackTheme };
  try {
    const value = JSON.parse(raw) as Partial<ReaderPrefs> | null;
    if (!value || typeof value !== "object") return { ...DEFAULT_READER_PREFS, theme: fallbackTheme };
    return {
      theme: oneOf(THEMES, value.theme, fallbackTheme),
      size: oneOf(SIZES, value.size, DEFAULT_READER_PREFS.size),
      face: oneOf(FACES, value.face, DEFAULT_READER_PREFS.face),
      listen: typeof value.listen === "boolean" ? value.listen : DEFAULT_READER_PREFS.listen,
      ...(typeof value.voice === "string" ? { voice: value.voice } : {}),
      ...(value.narration === "adapted" || value.narration === "original" ? { narration: value.narration } : {}),
    };
  } catch {
    return { ...DEFAULT_READER_PREFS, theme: fallbackTheme };
  }
}

export function serializeReaderPrefs(prefs: ReaderPrefs): string {
  return JSON.stringify(prefs);
}

