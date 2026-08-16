import test from "node:test";
import assert from "node:assert/strict";
import {
  LEVELS,
  normalizeReasoningEfforts,
  reasoningStateForModel,
  validateReasoningEfforts,
} from "./validation.mjs";

test("accepts supported partial reasoning levels and clones them", () => {
  assert.deepEqual(LEVELS, ["off", "minimal", "low", "medium", "high", "xhigh", "max"]);
  const input = { off: null, low: "low", high: "high" };
  assert.deepEqual(validateReasoningEfforts(input), { ok: true });
  const normalized = normalizeReasoningEfforts(input);
  assert.deepEqual(normalized, input);
  assert.notEqual(normalized, input);
});

test("rejects unknown levels, empty non-off values, and off-only maps", () => {
  assert.deepEqual(validateReasoningEfforts({ low: "" }), {
    ok: false,
    message: "non-off reasoning levels need a non-empty wire value",
  });
  assert.deepEqual(validateReasoningEfforts({ nope: "low" }), {
    ok: false,
    message: "unsupported reasoning level: nope",
  });
  assert.deepEqual(validateReasoningEfforts({ off: null }), {
    ok: false,
    message: "at least one non-off reasoning level is required",
  });
});

test("known model defaults enable reasoning while unknown models stay disabled", () => {
  assert.deepEqual(reasoningStateForModel("gpt-5.6-sol"), {
    mode: "enabled",
    efforts: { off: "none", low: "low", medium: "medium", high: "high", xhigh: "xhigh", max: "max" },
  });
  assert.deepEqual(reasoningStateForModel("acme-chat"), { mode: "disabled", efforts: undefined });
  assert.deepEqual(reasoningStateForModel("acme-chat", { mode: "enabled", efforts: { low: "low" } }), {
    mode: "enabled",
    efforts: { low: "low" },
  });
});
