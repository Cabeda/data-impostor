import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chromium } from 'playwright-chromium';

test('chapter bar sticks to the viewport top after the header scrolls away', { skip: !process.env.READER_TEST_URL }, async () => {
  const browser = await chromium.launch({ channel: process.env.READER_BROWSER_CHANNEL || undefined });
  try {
    const page = await browser.newPage();
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 844 });
      for (const slug of ['20221124-duckdb_transports', '20261105-writing-for-listeners']) {
        await page.goto(`${process.env.READER_TEST_URL}/blog/${slug}/`);
        await page.evaluate(() => window.scrollTo(0, 1400));
        await page.waitForTimeout(300);
        const top = await page.locator('[data-chapter-bar]').evaluate((el) => el.getBoundingClientRect().top);
        assert.ok(Math.abs(top) <= 1, `${slug} at ${width}px: chapter bar top is ${top}px`);
      }
    }
  } finally { await browser.close(); }
});
