export interface ReadingEntry {
  id: string;
  data: { pubDate: Date };
  body?: string | null;
  Content?: unknown;
}

export interface ReadingMonth {
  key: string;
  id: string;
  index: number;
  year: number;
  label: string;
  shortLabel: string;
  items: ReadingEntry[];
}

export interface ReadingDiary {
  months: ReadingMonth[];
  years: number[];
  noteCount: number;
}

export function groupReadingEntries(entries: ReadingEntry[]): ReadingDiary {
  const sorted = [...entries].sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );

  const months: ReadingMonth[] = [];
  for (const entry of sorted) {
    const date = entry.data.pubDate;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    let month = months.find((item) => item.key === key);
    if (!month) {
      month = {
        key,
        id: `month-${date.getFullYear()}-${date.getMonth() + 1}`,
        index: months.length,
        year: date.getFullYear(),
        label: date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        shortLabel: date.toLocaleDateString("en-US", { month: "short" }),
        items: [],
      };
      months.push(month);
    }
    month.items.push(entry);
  }

  const years = [...new Set(months.map((month) => month.year))];
  return { months, years, noteCount: entries.length };
}

