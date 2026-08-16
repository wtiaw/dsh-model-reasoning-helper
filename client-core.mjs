import { settingsMutation, updateModelReasoning } from "./settings.mjs";

export const SETTINGS_SECTION_ID = "model-reasoning";

export function registerReasoningSettings(ctx, { controller, component, t }) {
  ctx.locale?.register?.("dsh-model-reasoning-helper", {
    zh: { nav: "模型推理" },
    en: { nav: "Model reasoning" },
  });

  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: SETTINGS_SECTION_ID,
    order: 20,
    label: () => t?.("nav") ?? "Model reasoning",
    inject: () => ({ controller, t }),
  }, component));

  const disposers = [
    ctx.remote.$on("settings/document-updated", () => controller.refresh()),
    ctx.remote.$on("llm/adapters-updated", () => controller.refresh()),
    ctx.remote.$on("connection/reset", () => controller.refresh()),
  ];
  return () => disposers.forEach((dispose) => dispose());
}

export function createReasoningSettingsController(api) {
  let snapshot = { status: "idle", writable: false, revision: undefined, providers: {}, error: null };
  const listeners = new Set();
  const publish = (next) => {
    snapshot = next;
    for (const listener of listeners) listener();
  };
  const controller = {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    refresh: async () => {
      publish({ ...snapshot, status: "loading", error: null });
      try {
        const response = await api.settings.describe({});
        if (!response.result.ok) throw new Error(response.result.error.message);
        const namespace = response.result.value.namespaces.find((entry) => entry.ns === "llm-pi-ai");
        const providers = namespace?.value?.providers ?? {};
        publish({
          status: "ready",
          writable: response.result.value.writable === true,
          revision: namespace?.revision,
          providers,
          error: null,
        });
      } catch (error) {
        publish({ ...snapshot, status: "error", error: error instanceof Error ? error.message : String(error) });
      }
      return snapshot;
    },
    save: async (route, modelId, mode, efforts) => {
      const before = snapshot.providers[route];
      const after = updateModelReasoning(before, modelId, mode, efforts);
      const mutation = settingsMutation(route, before, after);
      const response = await api.settings.mutate({ ...mutation, expectedRevision: snapshot.revision });
      if (!response.result.ok) throw new Error(response.result.error.message);
      await controller.refresh();
    },
  };
  return controller;
}
