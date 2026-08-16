# DSH Model Reasoning Helper

A DeepSeek Harness plugin that fixes the missing reasoning-depth selector for custom provider models.

## What It Does

- Adds a **Model reasoning** section to the DSH web settings page.
- Shows custom `llm-pi-ai` provider models one by one.
- Pre-fills conservative mappings for the GPT-5.6 family and OpenAI o-series.
- Leaves unknown models disabled until the user explicitly enables them.
- Writes only the selected model's `reasoningEfforts` through `settings.mutate`.
- Keeps API keys and unrelated provider fields out of the plugin's write path.

The plugin does not probe provider APIs. Reasoning wire values vary between gateways, so unknown models require explicit user confirmation.

## Install

From GitHub with the DSH plugin manager:

```bash
dsh plugin --profile web add github:wtiaw/dsh-model-reasoning-helper
```

For a local checkout:

```bash
dsh plugin --profile web add ./dsh-model-reasoning-helper
```

Reload the DSH web page after installation, then open **Settings -> Model reasoning**.

## Usage

1. Open **Model reasoning** in settings.
2. Find the custom provider and model.
3. Keep the prefilled levels for a known model, or switch an unknown model to **Enabled**.
4. Check the levels the gateway accepts and edit each wire value when necessary.
5. Click **Save**.
6. Open the composer model picker. The model's reasoning-level submenu should now be available.

`gpt-image-2`, ordinary `gpt-4o`, and other unknown models remain disabled by default. This prevents DSH from sending reasoning parameters to a model that may reject them.

## Default Mappings

The initial catalog contains:

- GPT-5.6 family models: `off: none`, `low`, `medium`, `high`, `xhigh`, and `max`.
- OpenAI o-series IDs (`o1`, `o3`, `o4-mini` variants): `off: null`, `low`, `medium`, and `high`.

The catalog is intentionally conservative and can be overridden in the settings UI.

## Development

Requirements: Node.js 22 or newer.

```bash
npm install
npm test
npm pack --dry-run
node --input-type=module -e "const m=await import('./client.mjs'); console.log(typeof m.apply)"
```

The automated suite covers catalog matching, schema validation, minimal settings mutations, controller revisions, and DSH settings-section lifecycle registration.

## Limitations

- The plugin handles custom provider settings only; built-in DeepSeek models already expose their own reasoning metadata.
- It cannot guarantee that a third-party gateway accepts the same wire values as the upstream model.
- A settings conflict requires reloading the page and saving again.
