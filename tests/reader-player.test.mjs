import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright-chromium";

// Run against an Astro preview: READER_TEST_URL=http://127.0.0.1:4322 pnpm test:reader
test("article playback supports adapted detail, skipping, mode changes and footnote return", { skip: !process.env.READER_TEST_URL }, async () => {
  const browser = await chromium.launch({ channel: process.env.READER_BROWSER_CHANNEL || undefined });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    await page.addInitScript(() => {
      window.testSpeech = { utterances: [], current: null, previous: null, paused: false, queuedWhilePaused: false };
      window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
      Object.defineProperty(window, "speechSynthesis", { value: {
        getVoices: () => [{ lang: "en-GB", voiceURI: "test", name: "Test English" }],
        speak(utterance) {
          if (window.testSpeech.paused) window.testSpeech.queuedWhilePaused = true;
          window.testSpeech.current = utterance; window.testSpeech.utterances.push(utterance.text);
        },
        cancel() {}, pause() { window.testSpeech.paused = true; }, resume() { window.testSpeech.paused = false; },
      } });
    });
    const response = await page.goto(`${process.env.READER_TEST_URL}/blog/20261105-writing-for-listeners/`);
    assert.equal(response.status(), 200);
    await page.locator("[data-settings-toggle]").first().click();
    assert.equal(await page.getByLabel("Listening detail").inputValue(), "adapted");
    await page.getByLabel("Listening detail").selectOption("original");
    assert.equal(await page.evaluate(() => window.testSpeech.utterances.length), 0);
    await page.reload();
    await page.locator("[data-settings-toggle]").first().click();
    assert.equal(await page.getByLabel("Listening detail").inputValue(), "original");
    await page.getByLabel("Listening detail").selectOption("adapted");
    await page.locator("[data-settings-close]").first().click();
    await page.locator("[data-listen-toggle]").first().click();
    await page.waitForFunction(() => document.documentElement.dataset.listen === "on");
    await page.waitForFunction(() => window.testSpeech.utterances.length > 0);
    assert.equal(await page.locator("[data-audio-dock] [data-narration-mode]").count(), 0);
    await page.locator("#orders-by-country").click();
    await page.waitForFunction(() => window.testSpeech.current?.text.startsWith("Adapted description."));
    assert.equal(await page.locator("[data-audio-details]").isVisible(), true);
    await page.locator("[data-audio-details]").click();
    await page.waitForFunction(() => !window.testSpeech.current.text.startsWith("Adapted description."));
    // Some engines emit onend twice. A segment should still advance once.
    await page.evaluate(() => { window.testSpeech.current.onend(); window.testSpeech.current.onend(); });
    await page.waitForFunction(() => window.testSpeech.current.text.includes("Code listing."));
    await page.evaluate(() => window.testSpeech.current.onend());
    await page.waitForFunction(() => window.testSpeech.current.text.startsWith("Line 1."));
    assert.match(await page.evaluate(() => window.testSpeech.current.text), /COUNT open parenthesis asterisk close parenthesis/);
    await page.locator("[data-audio-skip]").click();
    await page.waitForFunction(() => window.testSpeech.current.text.startsWith("The description explains"));

    await page.locator("[data-audio-toggle]").click();
    await page.locator("[data-settings-toggle]").first().click();
    await page.getByLabel("Listening detail").selectOption("original");
    await page.locator("[data-settings-close]").first().click();
    const beforeResume = await page.evaluate(() => window.testSpeech.utterances.length);
    await page.locator("[data-audio-toggle]").click();
    await page.waitForFunction((count) => window.testSpeech.utterances.length > count, beforeResume);
    assert.equal(await page.evaluate(() => window.testSpeech.queuedWhilePaused), false);
    await page.locator("[data-audio-toggle]").click();
    await page.locator("[data-audio-skip]").click();
    const beforeSkippedResume = await page.evaluate(() => window.testSpeech.utterances.length);
    await page.locator("[data-audio-toggle]").click();
    await page.waitForFunction((count) => window.testSpeech.utterances.length > count, beforeSkippedResume);
    assert.equal(await page.evaluate(() => window.testSpeech.queuedWhilePaused), false);
    await page.evaluate(() => { window.testSpeech.previous = window.testSpeech.current; });
    await page.locator("[data-audio-replay]").click();
    const replayCount = await page.evaluate(() => window.testSpeech.utterances.length);
    await page.evaluate(() => window.testSpeech.previous.onend());
    await page.waitForTimeout(250);
    assert.equal(await page.evaluate(() => window.testSpeech.utterances.length), replayCount);

    await page.locator("[data-settings-toggle]").first().click();
    await page.getByLabel("Listening detail").selectOption("adapted");
    await page.locator("[data-settings-close]").first().click();
    await page.locator("a[data-footnote-ref]").first().click();
    await page.waitForFunction(() => window.testSpeech.current.text.includes("A note can preserve supporting evidence"));
    assert.equal(await page.locator("[data-audio-return]").isVisible(), true);
    await page.locator("[data-audio-return]").click();
    await page.waitForFunction(() => window.testSpeech.current.text.includes("Supporting material can live in a footnote"));
    assert.equal(await page.locator("[data-audio-return]").isVisible(), false);

    await page.evaluate(() => {
      const code = document.querySelector("#orders-by-country code");
      const range = document.createRange(); range.selectNodeContents(code);
      window.getSelection().removeAllRanges(); window.getSelection().addRange(range);
    });
    await page.locator("[data-audio-spell]").click();
    await page.waitForFunction(() => window.testSpeech.current.text.startsWith("Spelling selection."));
    assert.match(await page.evaluate(() => window.testSpeech.current.text), /capital S, capital E, capital L/);
    await page.evaluate(() => { window.testSpeech.current.onend(); window.getSelection().removeAllRanges(); });
    await page.waitForFunction(() => !window.testSpeech.current.text.startsWith("Spelling selection."));

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(200);
    const dock = await page.locator("[data-audio-dock]").boundingBox();
    assert.ok(dock.x >= 0 && dock.x + dock.width <= 390, "audio controls fit the mobile viewport");
    assert.ok(dock.y >= 0 && dock.y + dock.height <= 844, "audio controls stay vertically visible");
    await page.screenshot({ path: "/tmp/listening-mobile.png", fullPage: false });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.screenshot({ path: "/tmp/listening-desktop.png", fullPage: false });
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
