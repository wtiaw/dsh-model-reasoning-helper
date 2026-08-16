import test from "node:test";
import assert from "node:assert/strict";
import { knownReasoningFor } from "./catalog.mjs";

test("recognizes gpt-5.6 models with their supported wire levels", () => {
  assert.deepEqual(knownReasoningFor("gpt-5.6-sol"), {
    off: "none",
    low: "low",
    medium: "medium",
    high: "high",
    xhigh: "xhigh",
    max: "max",
  });
  assert.deepEqual(knownReasoningFor("GPT-5.6-SOL"), knownReasoningFor("gpt-5.6-sol"));
  assert.deepEqual(knownReasoningFor("gpt-5.6-terra"), knownReasoningFor("gpt-5.6-sol"));
  assert.deepEqual(knownReasoningFor(["gpt-5.6-", "luna"].join("")), knownReasoningFor("gpt-5.6-sol"));
});

test("recognizes o-series models conservatively", () => {
  assert.deepEqual(knownReasoningFor("o3"), {
    off: null,
    low: "low",
    medium: "medium",
    high: "high",
  });
});

test("does not infer reasoning from ordinary or unknown model IDs", () => {
  assert.equal(knownReasoningFor("gpt-4o"), undefined);
  assert.equal(knownReasoningFor("acme-gpt-thinking"), undefined);
  assert.equal(knownReasoningFor("acme-chat"), undefined);
});
