import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSearchEntry, matchingPostIds } from './post-search.ts';

const entries = [
  buildSearchEntry({ id: 'one', body: 'Fast warehouse queries with DuckDB', data: { title: 'Café systems', description: 'A practical guide', tags: ['Data'] } }),
  buildSearchEntry({ id: 'two', body: 'Other notes', data: { title: 'DuckDB operations', tags: ['SQL'] } }),
];
test('all scope matches words across fields, ignores accents/case, preserves exact topic filtering', () => {
  assert.deepEqual([...matchingPostIds(entries, 'CAFE duckdb data', 'all', 'Data')], ['one']);
  assert.equal(matchingPostIds(entries, 'cafe', 'all', 'SQL').size, 0);
  assert.deepEqual([...matchingPostIds(entries, 'practical', 'all', '')], ['one']);
});
test('scopes do not leak matches from other fields, and empty/reset returns all entries', () => {
  assert.deepEqual([...matchingPostIds(entries, 'DuckDB', 'title', '')], ['two']);
  assert.deepEqual([...matchingPostIds(entries, 'DuckDB', 'body', '')], ['one']);
  assert.deepEqual([...matchingPostIds(entries, 'data', 'tags', '')], ['one']);
  assert.equal(matchingPostIds(entries, 'no match here', 'all', '').size, 0);
  assert.equal(matchingPostIds(entries, '', 'all', '').size, 2);
});
test('build artifact stores only normalized fields, without duplicated raw body or combined text', () => {
  assert.equal(entries[0].fields.title, 'cafe systems');
  assert.equal('body' in entries[0], false);
  assert.equal('all' in entries[0].fields, false);
});
