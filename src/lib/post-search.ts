export type SearchScope = 'all' | 'title' | 'tags' | 'body';
export interface SearchEntry {
  id: string;
  tags: string[];
  // Each field is stored once; no second copy of the full body for “everything”.
  fields: { title: string; description: string; tags: string; body: string };
}
export function normalizeSearch(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}
export function buildSearchEntry(post: { id: string; body?: string; data: { title: string; description?: string; tags?: string[] } }): SearchEntry {
  const tags = post.data.tags || [];
  return { id: post.id, tags, fields: {
    title: normalizeSearch(post.data.title), description: normalizeSearch(post.data.description || ''),
    tags: normalizeSearch(tags.join(' ')), body: normalizeSearch(post.body || ''),
  } };
}
export function matchingPostIds(entries: SearchEntry[], query: string, scope: SearchScope, tag: string): Set<string> {
  const terms = normalizeSearch(query).split(' ').filter(Boolean);
  return new Set(entries.filter(entry => {
    if (tag && !entry.tags.includes(tag)) return false;
    const fields = scope === 'all' ? Object.values(entry.fields) : [entry.fields[scope]];
    return terms.every(term => fields.some(field => field.includes(term)));
  }).map(entry => entry.id));
}
