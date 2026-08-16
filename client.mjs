import { createReasoningSettingsController, registerReasoningSettings } from "./client-core.mjs";
import { ReasoningSettingsSection } from "./view.mjs";

export const inject = [
  "slots",
  "locale",
  "connection",
  "remote",
];

export function apply(ctx) {
  const connection = ctx.get("connection");
  const controller = createReasoningSettingsController(connection.api);
  const t = ctx.locale.bind("dsh-model-reasoning-helper");
  const dispose = registerReasoningSettings(ctx, {
    controller,
    component: ReasoningSettingsSection,
    t,
  });
  ctx.effect(() => {
    controller.refresh();
    return dispose;
  }, "dsh-model-reasoning-helper.lifecycle");
}
