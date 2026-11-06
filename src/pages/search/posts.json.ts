import { getCollection } from 'astro:content';
import { buildSearchEntry } from '../../lib/post-search';

export async function GET() {
  const entries = (await getCollection('blog')).map(buildSearchEntry);
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
