# dsh-long-input

DeepSeek Harness Web 输入框的**长内容 Markdown 编辑弹窗**插件。

在输入框底部的工具栏、权限选择器右侧加一个「长内容输入」按钮。点击后打开一个左右分栏的弹窗：左侧用纯 `textarea` 编写 Markdown，右侧用 vendored `marked` 实时渲染；确定后把 Markdown 原文**覆盖写回**当前 DSH 输入框。

## 功能（v0.2.0 最小闭环）

- 按钮位于 `conversation.input.left`，即输入框底部工具栏、权限选择器/计划按钮右侧；随 Session / 语言切换自动更新。
- 按钮文字跟随 DSH locale：中文为「长内容输入」，英文为「Long Input」。
- 打开弹窗时把原生输入框当前草稿一次性带入编辑区，之后两边互不同步。
- 原生草稿中的指令 chip（如 `/goal`）与 `@文件` 引用 chip 不进入编辑区；写回时按原顺序作为固定前缀重新附加，不会被清空。编辑区会显示一条「指令 / 引用已保留在编辑区外」的提示。
- 弹窗渲染在 `shell.overlay`（框架级浮层），不污染输入框 DOM。
- 左侧纯 `textarea`，右侧 `marked` v12.0.2 实时渲染（GFM + line breaks）。
- 弹窗底部 token 估算代码已保留，但当前默认不显示（`SHOW_TOKEN_COUNT = false`）。
- 编辑区和预览区统一使用原生输入框的字体族、字号和行高变量（`--dsw-font-family`、`--dsh-content-font-size`、`--dsh-content-font-delta`）。
- 中线可拖拽调整左右宽度，范围 20%–80%；比例保存在 `localStorage`。
- 快捷键：`Enter` 换行、`Ctrl+Enter` / `Cmd+Enter` 确定写回、`Esc` 关闭；点击蒙版后快捷键仍然有效。
- 关闭窗口（X / 取消 / `Esc`）时弹出确认框：
  - 左：退出窗口不写回
  - 右：退出并写回
  - 底部可勾选「记住我的选择」，记住后下次关闭直接按该选择执行
- 「确定」仍直接调用 `inputActions.setDraft(text)` 整体覆盖输入框草稿。
- 插件信息页（设置 → 插件 → 本插件）提供「关闭窗口时」配置：
  - 可分别选择「退出窗口不写回」或「退出并写回」，修改即时生效；
  - 两个选项都不选时，每次关闭都会弹出确认框；
  - 默认两个都不选；
  - 提供「恢复默认设置」按钮：重置关闭行为，并把分栏比例恢复为 50%。
- 明暗主题使用 DSH 的 `--dsw-alias-*` 主题变量自适应。
- 中英文界面随 DSH locale 切换。

## 安装

本工作区已经在当前 `desktop` profile 中安装并生效：

```text
C:\Users\<user>\.dsh\profiles\desktop
```

如需在别的 profile 安装，使用插件管理器的本地目录安装：

```text
plugin_manager install_bundle D:\work\projects\dsh\dsh_md_input_window
```

安装后无需构建：`client.js` 是已经包含插件代码与 `marked` 的完整浏览器产物。

## 文件

| 文件 | 作用 |
| --- | --- |
| `package.json` | bundle / `dsh.client` 清单、显示资源导出 |
| `cordis.patch.yml` | 插入 `dsh-long-input` Host 行 |
| `index.js` | Host 半边，空 `apply()` |
| `client.js` | 浏览器产物：vendored marked + 插件代码 |
| `src/app.js` | 插件源码（便于维护；发布时已拼入 `client.js`） |
| `lib/marked.min.js` | marked v12.0.2，MIT，离线 vendored |
| `locale/en.json`、`locale/zh.json` | 插件管理器显示用标题/描述 |
| `icon.svg` | 插件图标（原创） |

## 实现要点

- **按钮与弹窗解耦**：按钮注册在 `conversation.input.left`，弹窗注册在 `shell.overlay`；两者通过模块内一个很小的 external store 共享开关状态。
- **写回走公开输入动作**：普通文本使用 `InputActions.setDraft(text)`；存在指令或引用时使用结构化草稿 `{ text, references, command }`，保留 chip 身份并重新定位，不依赖 Lexical 内部模块或 DOM 选择器。
- **打开时一次性带入**：点击按钮时读取当前 `InputState`，剥离指令与引用后填入编辑区；之后不监听、不反向同步原生输入框。
- **指令 / 引用保留策略**：写回时把指令 token 放在最前，随后按原顺序放回引用 chip，再接编辑区文本。也就是说它们会被移动到编辑内容之前，而不会被删除。
- **关闭确认**：X / 取消 / `Esc` 先弹出选择框；若已记住选择则直接执行。记住值保存在 `dsh-long-input:closeChoice`，可在插件信息页修改，或执行 `localStorage.removeItem('dsh-long-input:closeChoice')` 恢复询问。
- **插件信息页配置**：注册到 `plugins.bundle.config`（key 为本 bundle 的包名）。两个可切换选项分别对应「不写回」和「写回」；都取消选择即恢复每次询问。配置通过 `localStorage` 即时同步到弹窗，「恢复默认设置」会清除选择并将分栏比例重置为 50%。
- **全局快捷键**：弹窗打开期间在 `window` 捕获阶段监听 `Esc` / `Ctrl+Enter` / `Tab`，因此点击蒙版导致焦点离开后仍然有效。
- **比例记忆**：`dsh-long-input:split`，读取时限制在 20%–80%。
- **Token 估算（暂未显示）**：`src/app.js` 保留 `estimateDraftTokens`、footer 计数 UI 和本地化文案，但由 `SHOW_TOKEN_COUNT = false` 关闭；当前界面上不显示 token 数。公式为 `Math.ceil(text.length / 4)`，只统计编辑区 Markdown 原文。
- **主题与字体**：容器和控件只使用 DSH 主题 token；编辑区与预览区使用原生输入框的字体变量。

## 已知边界

- 普通文本覆盖写回；指令与 `@引用` 会以结构化草稿保留并移到编辑内容之前。
- `marked` 不对用户输入的原始 HTML 做消毒。预览内容来自用户本人输入；不要粘贴不可信的第三方 HTML。
- 弹窗打开期间切换 Session 会关闭弹窗，避免把内容写回错误的会话。
- 「记住我的选择」一旦保存，后续关闭不再弹确认框；需要重新启用询问时清除 `dsh-long-input:closeChoice`。
- 仅面向 Web 平台；未提供独立的 Host 业务逻辑。

## License

MIT。`marked` 的版权与许可信息见 `THIRD_PARTY_NOTICES.md` 和 `lib/marked.min.js` 文件头。
