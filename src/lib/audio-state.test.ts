import assert from "node:assert/strict";
import { test } from "node:test";
import { audioReducer, initialAudioPlayback } from "./audio-state.ts";

test("play starts from the supplied index", () => {
  const next = audioReducer(initialAudioPlayback, { type: "play", from: 4 });
  assert.equal(next.speaking, true);
  assert.equal(next.paused, false);
  assert.equal(next.finished, false);
  assert.equal(next.idx, 4);
});

test("pause and resume keep the index", () => {
  const playing = audioReducer(initialAudioPlayback, { type: "play", from: 2 });
  const paused = audioReducer(playing, { type: "pause" });
  const resumed = audioReducer(paused, { type: "resume" });
  assert.equal(paused.paused, true);
  assert.equal(paused.idx, 2);
  assert.equal(resumed.paused, false);
  assert.equal(resumed.idx, 2);
});

test("seek moves the index while speaking", () => {
  const playing = audioReducer(initialAudioPlayback, { type: "play", from: 1 });
  const sought = audioReducer(playing, { type: "seek", idx: 9 });
  assert.equal(sought.speaking, true);
  assert.equal(sought.idx, 9);
});

test("finish clears speaking and marks finished", () => {
  const playing = audioReducer(initialAudioPlayback, { type: "play", from: 0 });
  const finished = audioReducer(playing, { type: "finish" });
  assert.equal(finished.speaking, false);
  assert.equal(finished.finished, true);
  assert.equal(finished.idx, 0);
});

test("stop and reset return to the initial state", () => {
  const playing = audioReducer(initialAudioPlayback, { type: "play", from: 5 });
  assert.deepEqual(audioReducer(playing, { type: "stop" }), initialAudioPlayback);
  assert.deepEqual(audioReducer(playing, { type: "reset" }), initialAudioPlayback);
});
