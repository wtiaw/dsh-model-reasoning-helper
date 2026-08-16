# DSH 模型推理深度助手

一个 DeepSeek Harness 插件，用于修复自定义模型缺少“推理深度”选项的问题。

[English README](./README.en.md)

## 功能

- 在 DSH Web 设置中增加“模型推理”页面。
- 按 provider 和模型逐项编辑自定义 `llm-pi-ai` 模型。
- 为 GPT-5.6 系列和 OpenAI o-series 预填保守的推理线值映射。
- 未知模型默认关闭推理，避免误向不支持的模型发送参数。
- 只通过 `settings.mutate` 写入当前模型的 `reasoningEfforts`。
- 不读取、发送或覆盖 API key，也不会修改内置 DeepSeek 适配器行为。

插件不会主动探测 provider API。不同网关的推理参数可能不同，未知模型必须由用户确认并填写线值。

## 安装

使用 DSH 插件管理器从 GitHub 安装：

```bash
dsh plugin --profile web add github:wtiaw/dsh-model-reasoning-helper
```

从本地源码安装：

```bash
dsh plugin --profile web add ./dsh-model-reasoning-helper
```

安装后刷新 DSH Web 页面，打开 **设置 -> 模型推理**。

## 使用方法

1. 打开设置中的“模型推理”。
2. 找到对应的自定义 provider 和模型。
3. 已知模型可以直接保留预填等级；未知模型需要切换为“启用”。
4. 勾选网关实际支持的等级，并按需要修改每个等级的 wire value。
5. 点击“保存”。
6. 打开输入框的模型选择器，模型菜单中应出现“推理等级”子菜单。

`gpt-image-2`、普通 `gpt-4o` 和其他未知模型默认保持关闭，防止 DSH 发送模型不接受的推理参数。

## 默认映射

初始目录包含：

- GPT-5.6 系列：`off: none`，以及 `low`、`medium`、`high`、`xhigh`、`max`。
- OpenAI o-series（`o1`、`o3`、`o4-mini` 及其变体）：`off: null`，以及 `low`、`medium`、`high`。

目录有意保持保守，所有映射都可以在设置页面中修改。

## 开发与验证

要求 Node.js 22 或更高版本。

```bash
npm install
npm test
npm pack --dry-run
node --input-type=module -e "const m=await import('./client.mjs'); console.log(typeof m.apply)"
```

自动化测试覆盖模型目录识别、schema 校验、最小设置变更、revision 并发控制和 DSH 设置区生命周期注册。

## 限制

- 插件只处理自定义 provider；内置 DeepSeek 模型已经由适配器提供推理元数据。
- 无法保证第三方网关接受与上游模型完全相同的 wire value。
- 设置发生并发冲突时，需要重新加载页面后再次保存。
