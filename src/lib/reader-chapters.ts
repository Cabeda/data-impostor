/**
 * The chapter under the reading line. Pure so the scrollspy can be tested
 * without a DOM; the shell feeds it heading tops from getBoundingClientRect.
 */
export function chapterIndex(tops: number[], line: number): number {
  let index = 0;
  for (let i = 0; i < tops.length; i += 1) {
    if (tops[i] < line) index = i;
  }
  return index;
}
