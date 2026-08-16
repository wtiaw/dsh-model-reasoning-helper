# DSH Model Reasoning Helper

A DeepSeek Harness plugin that fixes the missing reasoning-depth selector for custom provider models.

[中文 README](./README.md)

## Features

- Adds a **Model reasoning** section to the DSH web settings page.
- Lets users edit custom `llm-pi-ai` models one provider/model at a time.
- Pre-fills conservative reasoning wire mappings for the GPT-5.6 family and OpenAI o-series.
- Keeps unknown models disabled until the user explicitly confirms reasoning support.
- Writes only the selected model's `reasoningEfforts` through `settings.mutate`.
- Does not read, send, or overwrite API keys, and does not change the built-in DeepSeek adapter.

The plugin does not probe provider APIs. Reasoning wire values differ between gateways, so unknown models require explicit confirmation and mapping.

## Installation

Install from GitHub with the DSH plugin manager:

```bash
dsh plugin --profile web add github:wtiaw/dsh-model-reasoning-helper
```

Install from a local checkout:

```bash
dsh plugin --profile web add ./dsh-model-reasoning-helper
```

After installation, reload the DSH web page and open **Settings -> Model reasoning**.

## Usage

1. Open **Model reasoning** in settings.
2. Find the custom provider and model.
3. Keep the prefilled levels for a known model, or switch an unknown model to **Enabled**.
4. Check the levels the gateway actually accepts and edit each wire value when needed.
5. Click **Save**.
6. Open the composer model picker. The model's reasoning-level submenu should now be available.

`gpt-image-2`, ordinary `gpt-4o`, and other unknown models remain disabled by default. This prevents DSH from sending reasoning parameters to a model that may reject them.

## Default Mappings

The initial catalog contains:

- GPT-5.6 family models: `off: none`, plus `low`, `medium`, `high`, `xhigh`, and `max`.
- OpenAI o-series IDs (`o1`, `o3`, `o4-mini` variants): `off: null`, plus `low`, `medium`, and `high`.

The catalog is intentionally conservative and every mapping can be overridden in the settings UI.

## Development and Verification

Requirements: Node.js 22 or newer.

```bash
npm install
npm test
npm pack --dry-run
node --input-type=module -e "const m=await import('./client.mjs'); console.log(typeof m.apply)"
```

The automated suite covers catalog matching, schema validation, minimal settings mutations, revision concurrency, and DSH settings-section lifecycle registration.

## Limitations

- The plugin handles custom provider settings only; built-in DeepSeek models already expose their own reasoning metadata.
- It cannot guarantee that a third-party gateway accepts the same wire values as the upstream model.
- A settings conflict requires reloading the page and saving again.
