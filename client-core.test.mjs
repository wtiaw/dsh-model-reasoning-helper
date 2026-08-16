import test from "node:test";
import assert from "node:assert/strict";
import { registerReasoningSettings } from "./client-core.mjs";

test("registers a settings section and refresh listeners", () => {
  const registrations = [];
  const listeners = new Map();
  const ctx = {
    locale: { register: () => {} },
    slots: {
      inject: (name, factory) => registrations.push({ name, factory }),
      register: () => ({ id: "model-reasoning" }),
    },
    remote: {
      $on: (event, handler) => {
        listeners.set(event, handler);
        return () => listeners.delete(event);
      },
    },
  };
  const controller = { refreshes: 0, refresh() { this.refreshes += 1; } };
  const dispose = registerReasoningSettings(ctx, { controller, component: "Component", t: () => "" });

  assert.equal(registrations.length, 1);
  assert.equal(registrations[0].name, "settings.section");
  assert.equal(listeners.size, 3);
  listeners.get("settings/document-updated")();
  listeners.get("llm/adapters-updated")();
  listeners.get("connection/reset")();
  assert.equal(controller.refreshes, 3);
  dispose();
  assert.equal(listeners.size, 0);
});
