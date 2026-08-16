import test from "node:test";
import assert from "node:assert/strict";
import { createReasoningSettingsController } from "./client-core.mjs";

test("loads custom providers and saves one model with the namespace revision", async () => {
  const calls = [];
  const api = {
    settings: {
      describe: async () => ({ result: { ok: true, value: {
        writable: true,
        namespaces: [{ ns: "llm-pi-ai", revision: 7, value: {
          providers: { aiwtiaw: { models: [{ id: "gpt-5.6-sol", name: "Sol" }] } },
        } }],
      } } }),
      mutate: async (request) => {
        calls.push(request);
        return { result: { ok: true, value: {} } };
      },
    },
  };
  const controller = createReasoningSettingsController(api);
  await controller.refresh();
  assert.deepEqual(controller.getSnapshot().providers, {
    aiwtiaw: { models: [{ id: "gpt-5.6-sol", name: "Sol" }] },
  });
  await controller.save("aiwtiaw", "gpt-5.6-sol", "enabled", { low: "low" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].ns, "llm-pi-ai");
  assert.equal(calls[0].expectedRevision, 7);
  assert.deepEqual(calls[0].ops[0].path, ["providers", "aiwtiaw", "models"]);
});
