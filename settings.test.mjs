import test from "node:test";
import assert from "node:assert/strict";
import { settingsMutation, updateModelReasoning } from "./settings.mjs";

test("updates only the selected model and preserves unrelated fields", () => {
  const before = {
    api: "openai-responses",
    baseURL: "https://gateway.example",
    models: [
      { id: "gpt-5.6-sol", name: "Sol", maxTokens: 1000 },
      { id: "gpt-image-2", name: "Image", input: ["text", "image"] },
    ],
  };
  const after = updateModelReasoning(before, "gpt-5.6-sol", "enabled", { low: "low", high: "high" });
  assert.deepEqual(after.models[0], {
    id: "gpt-5.6-sol",
    name: "Sol",
    maxTokens: 1000,
    reasoningEfforts: { low: "low", high: "high" },
  });
  assert.deepEqual(after.models[1], before.models[1]);
  assert.equal(after.baseURL, before.baseURL);
  assert.notEqual(after, before);
});

test("writes a minimal models path operation for an existing provider", () => {
  const before = { models: [{ id: "a" }, { id: "b" }] };
  const after = updateModelReasoning(before, "b", "disabled");
  assert.deepEqual(settingsMutation("aiwtiaw", before, after), {
    ns: "llm-pi-ai",
    ops: [{ op: "set", path: ["providers", "aiwtiaw", "models"], value: after.models }],
  });
});

test("rejects missing and duplicate model IDs", () => {
  assert.throws(() => updateModelReasoning({ models: [{ id: "a" }] }, "missing", "disabled"), /model not found/);
  assert.throws(() => updateModelReasoning({ models: [{ id: "a" }, { id: "a" }] }, "a", "disabled"), /duplicate model ID/);
});
