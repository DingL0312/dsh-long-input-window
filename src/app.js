/* global __DSH_LONG_INPUT_MARKED__ */
/**
 * dsh-long-input — the Client half.
 *
 * The trigger button and the dialog live in two different slots:
 *   - conversation.input.left: the compact button in the composer tool row;
 *   - shell.overlay: the frame-wide dialog layer.
 * A tiny external store joins them. The dialog is intentionally independent of
 * the composer: it starts empty, and only "Insert" writes the Markdown source
 * back, replacing the whole draft through inputActions.setDraft().
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-long-input',
  factory(require) {
    'use strict';

    const React = require('react');
    const h = React.createElement;
    const marked = window.__DSH_LONG_INPUT_MARKED__;

    const NS = 'dsh-long-input';
    const SPLIT_KEY = 'dsh-long-input:split';
    const CLOSE_CHOICE_KEY = 'dsh-long-input:closeChoice';
    const SPLIT_MIN = 20;
    const SPLIT_MAX = 80;
    const SPLIT_DEFAULT = 50;
    /** Keep the token-count implementation in-tree, but hide it for now. */
    const SHOW_TOKEN_COUNT = false;

    const DICT_EN = {
      button: 'Long Input',
      openHint: 'Open the long content editor',
      title: 'Long Input',
      subtitle: 'Markdown editor',
      close: 'Close',
      editorLabel: 'Markdown source',
      placeholder: 'Write your Markdown here…',
      previewEmpty: 'Rendered Markdown appears here as you type.',
      cancel: 'Cancel',
      confirm: 'Insert',
      hint: 'Enter for newline · Ctrl+Enter to insert · Esc to close',
      resize: 'Drag to resize the editor and preview',
      writeFailed: 'Could not write to the composer. The dialog stays open.',
      closeTitle: 'Close window',
      closeMessage: 'Write the current content back to the composer?',
      discardAndClose: 'Discard and close',
      saveAndClose: 'Save and close',
      rememberChoice: 'Remember my choice',
      settingsTitle: 'When closing',
      settingsDesc: 'Choose the default close behavior. With neither selected, every close shows the confirmation dialog. Changes apply immediately.',
      settingsDiscard: 'Discard and close',
      settingsDiscardHint: 'Close without changing the composer draft.',
      settingsSave: 'Save and close',
      settingsSaveHint: 'Replace the composer draft with the editor content.',
      settingsNoneHint: 'No default selected: each close asks first.',
      settingsCurrentDiscard: 'Current: close without writing back.',
      settingsCurrentSave: 'Current: write back on close.',
      settingsReset: 'Restore defaults',
      settingsResetDone: 'Defaults restored.',
      preservedHint: 'Command / references kept outside the editor',
      tokenCountPrefix: '~',
      tokenCountSuffix: ' tokens',
      tokenCountTitle: 'Estimated at 4 characters per token; CJK may be undercounted.',
    };

    const DICT_ZH = {
      button: '长内容输入',
      openHint: '打开长内容编辑器',
      title: '长内容输入',
      subtitle: 'Markdown 编辑',
      close: '关闭',
      editorLabel: 'Markdown 原文',
      placeholder: '在这里用 Markdown 编写长内容…',
      previewEmpty: '右侧会实时显示 Markdown 渲染结果。',
      cancel: '取消',
      confirm: '确定',
      hint: 'Enter 换行 · Ctrl+Enter 确定写回 · Esc 关闭',
      resize: '拖动调整编辑区与预览区宽度',
      writeFailed: '写回输入框失败，弹窗保持打开。',
      closeTitle: '关闭窗口',
      closeMessage: '要把当前内容写回输入框吗？',
      discardAndClose: '退出窗口不写回',
      saveAndClose: '退出并写回',
      rememberChoice: '记住我的选择',
      settingsTitle: '关闭窗口时',
      settingsDesc: '选择关闭弹窗时的默认行为。都不选时，每次关闭都会显示确认框。修改即时生效。',
      settingsDiscard: '退出窗口不写回',
      settingsDiscardHint: '直接关闭，不修改输入框内容。',
      settingsSave: '退出并写回',
      settingsSaveHint: '用编辑区内容覆盖写回输入框。',
      settingsNoneHint: '当前未选择默认行为：每次关闭都会弹出确认框。',
      settingsCurrentDiscard: '当前：关闭时不写回。',
      settingsCurrentSave: '当前：关闭时写回。',
      settingsReset: '恢复默认设置',
      settingsResetDone: '已恢复默认设置。',
      preservedHint: '指令 / 引用已保留在编辑区外',
      tokenCountPrefix: '约 ',
      tokenCountSuffix: ' 个 token',
      tokenCountTitle: '按每 4 个字符约 1 token 估算；中文可能偏低。',
    };

    const CSS = `
.dli-trigger {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 6px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}
.dli-trigger:hover {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
}
.dli-trigger:focus-visible,
.dli-button:focus-visible,
.dli-close:focus-visible,
.dli-divider:focus-visible,
.dli-settings-reset:focus-visible,
.dli-setting-option:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}
.dli-trigger svg {
  flex: none;
  display: block;
}

.dli-scrim {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.42);
  pointer-events: auto;
}
.dli-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(1120px, calc(100vw - 48px));
  height: min(760px, calc(100vh - 48px));
  min-height: 280px;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-bg-overlay);
  color: var(--dsw-alias-label-primary);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.34);
}
.dli-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex: none;
  padding: 11px 16px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
}
.dli-head-text {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}
.dli-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
}
.dli-subtitle {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  white-space: nowrap;
}
.dli-preserved-note {
  padding: 1px 6px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 999px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 1.5;
  white-space: nowrap;
}
.dli-close {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.dli-close:hover {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
}

.dli-body {
  display: flex;
  flex: 1;
  min-height: 0;
}
.dli-editor-pane {
  display: flex;
  flex: none;
  width: 50%;
  min-width: 0;
  background: var(--dsw-alias-bg-base);
}
.dli-textarea {
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  margin: 0;
  padding: 16px 18px;
  border: 0;
  outline: 0;
  resize: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  caret-color: var(--dsw-alias-brand-primary);
  font-family: var(--dsw-font-family);
  font-size: var(--dsh-content-font-size, 14px);
  line-height: calc(24px + var(--dsh-content-font-delta, 0px));
  tab-size: 2;
}
.dli-textarea::placeholder {
  color: var(--dsw-alias-label-secondary);
  opacity: 0.8;
}
.dli-divider {
  position: relative;
  flex: none;
  width: 11px;
  border: 0;
  padding: 0;
  background: var(--dsw-alias-bg-layer-1);
  cursor: col-resize;
  touch-action: none;
  user-select: none;
}
.dli-divider::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 5px;
  width: 1px;
  background: var(--dsw-alias-border-l1);
}
.dli-divider:hover::before,
.dli-divider:focus-visible::before {
  background: var(--dsw-alias-brand-primary);
}
.dli-preview-pane {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 16px 20px 22px;
  border-left: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-base);
}
.dli-empty {
  color: var(--dsw-alias-label-secondary);
  font-family: var(--dsw-font-family);
  font-size: var(--dsh-content-font-size, 14px);
  line-height: calc(24px + var(--dsh-content-font-delta, 0px));
}
.dli-md {
  color: var(--dsw-alias-label-primary);
  font-family: var(--dsw-font-family);
  font-size: var(--dsh-content-font-size, 14px);
  line-height: calc(24px + var(--dsh-content-font-delta, 0px));
  overflow-wrap: anywhere;
}
.dli-md > :first-child {
  margin-top: 0;
}
.dli-md > :last-child {
  margin-bottom: 0;
}
.dli-md h1,
.dli-md h2,
.dli-md h3,
.dli-md h4,
.dli-md h5,
.dli-md h6 {
  margin: 1.25em 0 0.55em;
  font-weight: 600;
  line-height: 1.35;
}
.dli-md h1 {
  padding-bottom: 0.28em;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  font-size: 1.7em;
}
.dli-md h2 {
  padding-bottom: 0.24em;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  font-size: 1.4em;
}
.dli-md h3 { font-size: 1.18em; }
.dli-md p,
.dli-md ul,
.dli-md ol,
.dli-md blockquote,
.dli-md pre,
.dli-md table {
  margin: 0 0 0.9em;
}
.dli-md ul,
.dli-md ol {
  padding-left: 1.55em;
}
.dli-md li + li {
  margin-top: 0.22em;
}
.dli-md a {
  color: var(--dsw-alias-brand-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.dli-md blockquote {
  padding: 0.1em 0 0.1em 1em;
  border-left: 3px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-secondary);
}
.dli-md code {
  padding: 0.12em 0.36em;
  border-radius: 4px;
  background: var(--dsw-alias-bg-layer-2);
  font: 0.9em/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
}
.dli-md pre {
  overflow: auto;
  padding: 12px 14px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-1);
}
.dli-md pre code {
  padding: 0;
  background: transparent;
  font-size: 0.88em;
}
.dli-md hr {
  margin: 1.3em 0;
  border: 0;
  border-top: 1px solid var(--dsw-alias-border-l1);
}
.dli-md table {
  width: max-content;
  max-width: 100%;
  border-collapse: collapse;
  font-size: 0.94em;
}
.dli-md th,
.dli-md td {
  padding: 5px 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  text-align: left;
  vertical-align: top;
}
.dli-md th {
  background: var(--dsw-alias-bg-layer-1);
  font-weight: 600;
}
.dli-md img {
  max-width: 100%;
  height: auto;
}
.dli-md input[type="checkbox"] {
  margin: 0 0.35em 0 0;
  vertical-align: middle;
}

.dli-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex: none;
  padding: 10px 16px;
  border-top: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
}
.dli-hint {
  min-width: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.5;
}
.dli-hint.is-error {
  color: var(--dsw-alias-state-error-primary);
}
.dli-foot-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: none;
  min-width: 0;
}
.dli-token-count {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  user-select: none;
}
.dli-actions {
  display: flex;
  flex: none;
  gap: 8px;
}
.dli-button {
  height: 32px;
  padding: 0 16px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
}
.dli-button:hover {
  border-color: var(--dsw-alias-border-l2);
}
.dli-button.is-primary {
  border-color: var(--dsw-alias-brand-primary);
  background: var(--dsw-alias-brand-primary);
  color: #ffffff;
}
.dli-button.is-primary:hover {
  opacity: 0.9;
}

.dli-confirm-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.42);
}
.dli-confirm-card {
  width: min(460px, 100%);
  padding: 18px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
  background: var(--dsw-alias-bg-overlay);
  color: var(--dsw-alias-label-primary);
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.3);
}
.dli-confirm-title {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}
.dli-confirm-text {
  margin: 0 0 16px;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 1.6;
}
.dli-confirm-actions {
  display: flex;
  gap: 10px;
}
.dli-confirm-actions .dli-button {
  flex: 1 1 0;
  min-width: 0;
  height: 36px;
  padding: 0 12px;
  white-space: normal;
}
.dli-confirm-remember {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.5;
  cursor: pointer;
  user-select: none;
}
.dli-confirm-remember input {
  flex: none;
  width: 14px;
  height: 14px;
  margin: 0;
  accent-color: var(--dsw-alias-brand-primary);
}

.dli-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1);
}
.dli-settings-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.dli-settings-heading {
  min-width: 0;
}
.dli-settings-title {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
}
.dli-settings-desc {
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.6;
}
.dli-settings-reset {
  flex: none;
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
}
.dli-settings-reset:hover {
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
}
.dli-settings-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.dli-setting-option {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  min-width: 0;
  padding: 11px 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
}
.dli-setting-option:hover {
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
}
.dli-setting-option.is-selected {
  border-color: var(--dsw-alias-brand-primary);
  background: var(--dsw-alias-bg-layer-2);
}
.dli-setting-check {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 5px;
  background: transparent;
  color: #ffffff;
}
.dli-setting-option.is-selected .dli-setting-check {
  border-color: var(--dsw-alias-brand-primary);
  background: var(--dsw-alias-brand-primary);
}
.dli-setting-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dli-setting-label {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
}
.dli-setting-hint {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.5;
}
.dli-settings-current,
.dli-settings-notice {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}
.dli-settings-current {
  color: var(--dsw-alias-label-secondary);
}
.dli-settings-notice {
  color: var(--dsw-alias-state-success-primary);
}

@media (max-width: 720px) {
  .dli-scrim {
    padding: 8px;
  }
  .dli-dialog {
    width: calc(100vw - 16px);
    height: calc(100vh - 16px);
    border-radius: 9px;
  }
  .dli-subtitle,
  .dli-preserved-note,
  .dli-hint {
    display: none;
  }
  .dli-foot {
    justify-content: flex-end;
  }
  .dli-settings-head {
    flex-direction: column;
    gap: 10px;
  }
  .dli-settings-options {
    grid-template-columns: 1fr;
  }
  .dli-settings-reset {
    align-self: flex-start;
  }
}
`;

    function clampSplit(value) {
      if (!Number.isFinite(value)) return SPLIT_DEFAULT;
      return Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, Math.round(value * 10) / 10));
    }

    function estimateDraftTokens(text) {
      if (typeof text !== 'string' || text.length === 0) return 0;
      return Math.ceil(text.length / 4);
    }

    function readSplit() {
      try {
        const raw = window.localStorage.getItem(SPLIT_KEY);
        if (raw === null) return SPLIT_DEFAULT;
        const parsed = Number.parseFloat(raw);
        return clampSplit(parsed);
      } catch (error) {
        return SPLIT_DEFAULT;
      }
    }

    function saveSplit(value) {
      try {
        window.localStorage.setItem(SPLIT_KEY, String(clampSplit(value)));
      } catch (error) {
        /* Storage may be unavailable; the dialog still works for this open. */
      }
    }

    const closeChoiceListeners = new Set();

    function readCloseChoice() {
      try {
        const raw = window.localStorage.getItem(CLOSE_CHOICE_KEY);
        return raw === 'discard' || raw === 'writeback' ? raw : null;
      } catch (error) {
        return null;
      }
    }

    function notifyCloseChoice() {
      for (const listener of closeChoiceListeners) listener();
    }

    function subscribeCloseChoice(listener) {
      closeChoiceListeners.add(listener);
      return () => closeChoiceListeners.delete(listener);
    }

    function setCloseChoice(choice) {
      const normalized = choice === 'discard' || choice === 'writeback' ? choice : null;
      try {
        if (normalized === null) window.localStorage.removeItem(CLOSE_CHOICE_KEY);
        else window.localStorage.setItem(CLOSE_CHOICE_KEY, normalized);
      } catch (error) {
        /* Storage may be unavailable; the choice still applies to this open. */
      }
      notifyCloseChoice();
      return normalized;
    }

    function saveCloseChoice(choice) {
      return setCloseChoice(choice);
    }

    function useCloseChoice() {
      return React.useSyncExternalStore(subscribeCloseChoice, readCloseChoice, readCloseChoice);
    }

    function copyStructuredReference(occurrence) {
      if (
        !occurrence
        || typeof occurrence.clipboardText !== 'string'
        || occurrence.clipboardText.length === 0
      ) {
        return null;
      }
      return {
        source: occurrence.source,
        ref: occurrence.ref,
        label: occurrence.label,
        clipboardText: occurrence.clipboardText,
        ...occurrence.appearance === undefined ? {} : { appearance: occurrence.appearance },
        ...occurrence.invalid === undefined ? {} : { invalid: occurrence.invalid },
      };
    }

    function stripStructuredDraft(draft, commandToken, occurrences) {
      const ranges = [];
      if (commandToken && draft.startsWith(commandToken)) {
        ranges.push([0, commandToken.length]);
      }
      for (const occurrence of occurrences) {
        if (
          Number.isInteger(occurrence.offset)
          && Number.isInteger(occurrence.length)
          && occurrence.offset >= 0
          && occurrence.length > 0
        ) {
          ranges.push([occurrence.offset, occurrence.offset + occurrence.length]);
        }
      }
      ranges.sort((left, right) => left[0] - right[0]);
      const merged = [];
      for (const range of ranges) {
        const previous = merged[merged.length - 1];
        if (previous && range[0] <= previous[1]) {
          previous[1] = Math.max(previous[1], range[1]);
        } else {
          merged.push([range[0], range[1]]);
        }
      }

      let plain = '';
      let cursor = 0;
      for (const [start, end] of merged) {
        plain += draft.slice(cursor, start);
        cursor = end;
      }
      plain += draft.slice(cursor);
      return plain.replace(/^\s+/, '');
    }

    function buildStructuredDraft(text, structured) {
      if (
        !structured
        || (
          !structured.commandToken
          && (!Array.isArray(structured.references) || structured.references.length === 0)
        )
      ) {
        return text;
      }

      let fullText = '';
      const references = [];
      if (structured.commandToken) fullText += `${structured.commandToken} `;
      for (const reference of structured.references) {
        const offset = fullText.length;
        fullText += reference.clipboardText;
        references.push({
          ...reference,
          offset,
          length: reference.clipboardText.length,
        });
        fullText += ' ';
      }
      fullText += text;

      return {
        text: fullText,
        references,
        ...structured.commandToken === undefined || structured.commandToken === null
          ? {}
          : { command: { token: structured.commandToken } },
      };
    }

    /* ---------------- shared open state ---------------- */

    const dialogState = {
      open: false,
      inputActions: null,
      sessionId: null,
      initialText: '',
      structured: null,
      opener: null,
    };
    let revision = 0;
    const listeners = new Set();

    function subscribeDialog(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    function dialogRevision() {
      return revision;
    }

    function publishDialog() {
      revision += 1;
      for (const listener of listeners) listener();
    }

    function resetDialogState() {
      dialogState.open = false;
      dialogState.inputActions = null;
      dialogState.sessionId = null;
      dialogState.initialText = '';
      dialogState.structured = null;
      dialogState.opener = null;
    }

    function openDialog(inputActions, sessionId, inputState) {
      if (dialogState.open) return;
      const draft = typeof inputState?.draft === 'string' ? inputState.draft : '';
      const occurrences = Array.isArray(inputState?.occurrences) ? inputState.occurrences : [];
      const claimedToken = typeof inputState?.claim?.token === 'string'
        ? inputState.claim.token
        : null;
      const commandToken = claimedToken !== null && draft.startsWith(claimedToken)
        ? claimedToken
        : null;
      const references = occurrences
        .map(copyStructuredReference)
        .filter((reference) => reference !== null);

      dialogState.open = true;
      dialogState.inputActions = inputActions;
      dialogState.sessionId = sessionId;
      dialogState.initialText = stripStructuredDraft(draft, commandToken, occurrences);
      dialogState.structured = commandToken === null && references.length === 0
        ? null
        : { commandToken, references };
      dialogState.opener = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      publishDialog();
    }

    function closeDialog() {
      if (!dialogState.open) return;
      const opener = dialogState.opener;
      resetDialogState();
      publishDialog();
      if (opener && typeof opener.focus === 'function' && opener.isConnected) {
        window.requestAnimationFrame(() => {
          if (opener.isConnected) opener.focus();
        });
      }
    }

    function useDialogRevision() {
      return React.useSyncExternalStore(subscribeDialog, dialogRevision, dialogRevision);
    }

    /* ---------------- small icons ---------------- */

    function TriggerIcon() {
      return h('svg', {
        width: 14,
        height: 14,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
      h('path', { d: 'M9 4H4v5' }),
      h('path', { d: 'M15 4h5v5' }),
      h('path', { d: 'M9 20H4v-5' }),
      h('path', { d: 'M15 20h5v-5' }),
      h('path', { d: 'M8 9h8M8 12.5h8M8 16h5' }));
    }

    function CloseIcon() {
      return h('svg', {
        width: 16,
        height: 16,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        'aria-hidden': 'true',
      },
      h('path', { d: 'M6 6l12 12M18 6L6 18' }));
    }

    function CheckIcon() {
      return h('svg', {
        width: 12,
        height: 12,
        viewBox: '0 0 16 16',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2.2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
      h('path', { d: 'M3 8.5l3.2 3.2L13 4.8' }));
    }

    function CloseBehaviorSettings({ t }) {
      const choice = useCloseChoice();
      const [notice, setNotice] = React.useState('');

      function choose(next) {
        setCloseChoice(readCloseChoice() === next ? null : next);
        setNotice('');
      }

      function resetDefaults() {
        setCloseChoice(null);
        saveSplit(SPLIT_DEFAULT);
        setNotice(t('settingsResetDone'));
      }

      const current = choice === 'discard'
        ? t('settingsCurrentDiscard')
        : choice === 'writeback'
          ? t('settingsCurrentSave')
          : t('settingsNoneHint');

      return h('section', {
        className: 'dli-settings',
        'aria-label': t('settingsTitle'),
      },
      h('div', { className: 'dli-settings-head' },
        h('div', { className: 'dli-settings-heading' },
          h('h3', { className: 'dli-settings-title' }, t('settingsTitle')),
          h('p', { className: 'dli-settings-desc' }, t('settingsDesc'))),
        h('button', {
          type: 'button',
          className: 'dli-settings-reset',
          onClick: resetDefaults,
        }, t('settingsReset'))),
      h('div', { className: 'dli-settings-options' },
        h('button', {
          type: 'button',
          role: 'checkbox',
          'aria-checked': choice === 'discard',
          className: choice === 'discard'
            ? 'dli-setting-option is-selected'
            : 'dli-setting-option',
          onClick: () => choose('discard'),
        },
        h('span', {
          className: 'dli-setting-check',
          'aria-hidden': 'true',
        }, choice === 'discard' ? h(CheckIcon) : null),
        h('span', { className: 'dli-setting-copy' },
          h('span', { className: 'dli-setting-label' }, t('settingsDiscard')),
          h('span', { className: 'dli-setting-hint' }, t('settingsDiscardHint')))),
        h('button', {
          type: 'button',
          role: 'checkbox',
          'aria-checked': choice === 'writeback',
          className: choice === 'writeback'
            ? 'dli-setting-option is-selected'
            : 'dli-setting-option',
          onClick: () => choose('writeback'),
        },
        h('span', {
          className: 'dli-setting-check',
          'aria-hidden': 'true',
        }, choice === 'writeback' ? h(CheckIcon) : null),
        h('span', { className: 'dli-setting-copy' },
          h('span', { className: 'dli-setting-label' }, t('settingsSave')),
          h('span', { className: 'dli-setting-hint' }, t('settingsSaveHint'))))),
      h('p', {
        className: 'dli-settings-current',
        role: 'status',
      }, current),
      notice
        ? h('p', {
          className: 'dli-settings-notice',
          role: 'status',
        }, notice)
        : null);
    }

    /* ---------------- components ---------------- */

    function Dialog({ t }) {
      const [text, setText] = React.useState(() => dialogState.initialText || '');
      const [split, setSplit] = React.useState(readSplit);
      const [error, setError] = React.useState('');
      const [closePromptOpen, setClosePromptOpen] = React.useState(false);
      const [rememberChoice, setRememberChoice] = React.useState(false);
      const dialogRef = React.useRef(null);
      const bodyRef = React.useRef(null);
      const textareaRef = React.useRef(null);
      const stopDragRef = React.useRef(null);
      const closePromptRef = React.useRef(null);
      const closePrimaryRef = React.useRef(null);
      const closePromptOpenRef = React.useRef(false);
      const commitRef = React.useRef(null);
      const requestCloseRef = React.useRef(null);
      closePromptOpenRef.current = closePromptOpen;

      const deferredText = typeof React.useDeferredValue === 'function'
        ? React.useDeferredValue(text)
        : text;

      const html = React.useMemo(() => {
        if (!deferredText.trim()) return '';
        if (!marked || typeof marked.parse !== 'function') return '';
        try {
          return marked.parse(deferredText, { gfm: true, breaks: true });
        } catch (parseError) {
          return '';
        }
      }, [deferredText]);

      const tokenCount = SHOW_TOKEN_COUNT ? estimateDraftTokens(text) : 0;
      const tokenText = SHOW_TOKEN_COUNT
        ? `${tokenCount === 0 ? '' : t('tokenCountPrefix')}${tokenCount.toLocaleString()}${t('tokenCountSuffix')}`
        : '';

      React.useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.focus();
          try {
            const end = textarea.value.length;
            textarea.setSelectionRange(end, end);
          } catch (selectionError) {
            /* Selection may be unavailable in an unusual host; focus still works. */
          }
        }
        return () => {
          if (stopDragRef.current) {
            stopDragRef.current();
            stopDragRef.current = null;
          }
        };
      }, []);

      function writeBackToComposer() {
        const inputActions = dialogState.inputActions;
        if (!inputActions || typeof inputActions.setDraft !== 'function') {
          setError(t('writeFailed'));
          return false;
        }
        try {
          inputActions.setDraft(buildStructuredDraft(text, dialogState.structured));
          return true;
        } catch (writeError) {
          setError(t('writeFailed'));
          return false;
        }
      }

      function commit() {
        if (writeBackToComposer()) closeDialog();
      }
      commitRef.current = commit;

      function cancelClosePrompt() {
        setClosePromptOpen(false);
        window.requestAnimationFrame(() => textareaRef.current?.focus());
      }

      function requestClose() {
        const remembered = readCloseChoice();
        if (remembered === 'discard') {
          closeDialog();
          return;
        }
        if (remembered === 'writeback') {
          commit();
          return;
        }
        setRememberChoice(false);
        setClosePromptOpen(true);
      }
      requestCloseRef.current = requestClose;

      function resolveCloseChoice(choice) {
        if (choice === 'writeback') {
          if (!writeBackToComposer()) {
            setClosePromptOpen(false);
            window.requestAnimationFrame(() => textareaRef.current?.focus());
            return;
          }
          if (rememberChoice) saveCloseChoice('writeback');
          closeDialog();
          return;
        }
        if (rememberChoice) saveCloseChoice('discard');
        closeDialog();
      }

      React.useEffect(() => {
        if (closePromptOpen) {
          const primary = closePrimaryRef.current;
          if (primary) primary.focus();
        }
      }, [closePromptOpen]);

      React.useEffect(() => {
        function onGlobalKeyDown(event) {
          if (event.isComposing) return;

          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            if (closePromptOpenRef.current) cancelClosePrompt();
            else if (requestCloseRef.current) requestCloseRef.current();
            return;
          }

          if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            if (closePromptOpenRef.current) return;
            event.preventDefault();
            event.stopPropagation();
            if (commitRef.current) commitRef.current();
            return;
          }

          if (event.key !== 'Tab') return;
          const root = closePromptOpenRef.current ? closePromptRef.current : dialogRef.current;
          if (!root) return;
          const focusable = Array.from(root.querySelectorAll(
            'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
          )).filter((element) => element.getClientRects().length > 0);
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (!root.contains(document.activeElement)) {
            event.preventDefault();
            first.focus();
            return;
          }
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }

        window.addEventListener('keydown', onGlobalKeyDown, true);
        return () => window.removeEventListener('keydown', onGlobalKeyDown, true);
      }, []);

      function updateSplitFromPointer(clientX, bodyRect) {
        if (!bodyRect || bodyRect.width <= 0) return split;
        const next = clampSplit(((clientX - bodyRect.left) / bodyRect.width) * 100);
        setSplit(next);
        return next;
      }

      function startDrag(event) {
        if (event.button !== 0) return;
        event.preventDefault();
        const divider = event.currentTarget;
        const body = bodyRef.current;
        if (!body) return;
        const bodyRect = body.getBoundingClientRect();
        let latest = split;

        let onMove = null;
        let onUp = null;
        const stop = () => {
          if (onMove) divider.removeEventListener('pointermove', onMove);
          if (onUp) {
            divider.removeEventListener('pointerup', onUp);
            divider.removeEventListener('pointercancel', onUp);
          }
          try {
            if (divider.hasPointerCapture && divider.hasPointerCapture(event.pointerId)) {
              divider.releasePointerCapture(event.pointerId);
            }
          } catch (releaseError) {
            /* The pointer may already be gone; nothing else to release. */
          }
          stopDragRef.current = null;
        };
        onMove = (moveEvent) => {
          latest = updateSplitFromPointer(moveEvent.clientX, bodyRect);
        };
        onUp = () => {
          saveSplit(latest);
          stop();
        };

        stopDragRef.current = stop;
        if (divider.setPointerCapture) divider.setPointerCapture(event.pointerId);
        divider.addEventListener('pointermove', onMove);
        divider.addEventListener('pointerup', onUp);
        divider.addEventListener('pointercancel', onUp);
      }

      function onDividerKeyDown(event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const next = clampSplit(split + (event.key === 'ArrowLeft' ? -2 : 2));
        setSplit(next);
        saveSplit(next);
      }

      return h('div', {
        className: 'dli-scrim',
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) event.preventDefault();
        },
      },
        h('div', {
          ref: dialogRef,
          className: 'dli-dialog',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-labelledby': 'dsh-long-input-title',
        },
        h('div', { className: 'dli-head' },
          h('div', { className: 'dli-head-text' },
            h('h2', {
              id: 'dsh-long-input-title',
              className: 'dli-title',
            }, t('title')),
            h('span', { className: 'dli-subtitle' }, t('subtitle')),
            dialogState.structured
              ? h('span', { className: 'dli-preserved-note' }, t('preservedHint'))
              : null),
          h('button', {
            type: 'button',
            className: 'dli-close',
            'aria-label': t('close'),
            title: t('close'),
            onClick: requestClose,
          }, h(CloseIcon))),
        h('div', { className: 'dli-body', ref: bodyRef },
          h('div', {
            className: 'dli-editor-pane',
            style: { width: `${split}%` },
          },
          h('textarea', {
            ref: textareaRef,
            className: 'dli-textarea',
            'aria-label': t('editorLabel'),
            placeholder: t('placeholder'),
            spellCheck: false,
            value: text,
            onChange: (event) => {
              setText(event.target.value);
              if (error) setError('');
            },
          })),
          h('div', {
            className: 'dli-divider',
            role: 'separator',
            tabIndex: 0,
            'aria-label': t('resize'),
            'aria-orientation': 'vertical',
            'aria-valuemin': SPLIT_MIN,
            'aria-valuemax': SPLIT_MAX,
            'aria-valuenow': Math.round(split),
            onPointerDown: startDrag,
            onKeyDown: onDividerKeyDown,
          }),
          h('div', { className: 'dli-preview-pane' },
            html
              ? h('div', {
                className: 'dli-md',
                dangerouslySetInnerHTML: { __html: html },
              })
              : h('div', { className: 'dli-empty' }, t('previewEmpty')))),
        h('div', { className: 'dli-foot' },
          h('span', {
            className: error ? 'dli-hint is-error' : 'dli-hint',
            role: error ? 'alert' : undefined,
          }, error || t('hint')),
          h('div', { className: 'dli-foot-right' },
            SHOW_TOKEN_COUNT
              ? h('span', {
                className: 'dli-token-count',
                title: t('tokenCountTitle'),
              }, tokenText)
              : null,
            h('div', { className: 'dli-actions' },
              h('button', {
                type: 'button',
                className: 'dli-button',
                onClick: requestClose,
              }, t('cancel')),
              h('button', {
                type: 'button',
                className: 'dli-button is-primary',
                onClick: commit,
              }, t('confirm'))))),
        closePromptOpen
          ? h('div', { className: 'dli-confirm-overlay' },
            h('div', {
              ref: closePromptRef,
              className: 'dli-confirm-card',
              role: 'alertdialog',
              'aria-modal': 'true',
              'aria-labelledby': 'dsh-long-input-close-title',
              'aria-describedby': 'dsh-long-input-close-message',
            },
            h('h3', {
              id: 'dsh-long-input-close-title',
              className: 'dli-confirm-title',
            }, t('closeTitle')),
            h('p', {
              id: 'dsh-long-input-close-message',
              className: 'dli-confirm-text',
            }, t('closeMessage')),
            h('div', { className: 'dli-confirm-actions' },
              h('button', {
                type: 'button',
                className: 'dli-button',
                onClick: () => resolveCloseChoice('discard'),
              }, t('discardAndClose')),
              h('button', {
                ref: closePrimaryRef,
                type: 'button',
                className: 'dli-button is-primary',
                onClick: () => resolveCloseChoice('writeback'),
              }, t('saveAndClose'))),
            h('label', { className: 'dli-confirm-remember' },
              h('input', {
                type: 'checkbox',
                checked: rememberChoice,
                onChange: (event) => setRememberChoice(event.target.checked),
              }),
              h('span', null, t('rememberChoice')))))
          : null));
    }

    function DialogHost({ t }) {
      useDialogRevision();
      if (!dialogState.open) return null;
      return h(Dialog, { t });
    }

    function TriggerButton({ inputActions, sessionId, inputState, t }) {
      if (!inputActions || typeof inputActions.setDraft !== 'function') return null;
      return h('button', {
        type: 'button',
        className: 'dli-trigger',
        title: t('openHint'),
        'aria-label': t('openHint'),
        'aria-haspopup': 'dialog',
        onClick: () => openDialog(inputActions, sessionId, inputState),
      }, h(TriggerIcon), h('span', null, t('button')));
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        resetDialogState();

        ctx.effect(() => {
          const style = document.createElement('style');
          style.dataset.dshLongInput = 'styles';
          style.textContent = CSS;
          document.head.appendChild(style);
          return () => style.remove();
        });
        ctx.effect(() => ctx.locale.register(NS, 'en', DICT_EN));
        ctx.effect(() => ctx.locale.register(NS, 'zh', DICT_ZH));
        ctx.effect(() => {
          const onStorage = (event) => {
            if (event.key === CLOSE_CHOICE_KEY || event.key === null) {
              notifyCloseChoice();
            }
          };
          window.addEventListener('storage', onStorage);
          return () => window.removeEventListener('storage', onStorage);
        });

        const locale = ctx.locale;

        function useT() {
          React.useSyncExternalStore(
            (listener) => locale.subscribe(listener),
            () => locale.getSnapshot(),
            () => locale.getSnapshot(),
          );
          return locale.bind(NS);
        }

        function TriggerEntry(props) {
          const t = useT();
          const inputState = props.useInput((state) => state);
          React.useEffect(() => {
            if (dialogState.open && dialogState.sessionId !== props.sessionId) {
              closeDialog();
            }
            return () => {
              if (dialogState.open) closeDialog();
            };
          }, [props.sessionId]);
          return h(TriggerButton, {
            inputActions: props.inputActions,
            sessionId: props.sessionId,
            inputState,
            t,
          });
        }

        function OverlayEntry() {
          return h(DialogHost, { t: useT() });
        }

        function ConfigEntry(props) {
          const t = useT();
          if (props.view === 'summary') return null;
          return h(CloseBehaviorSettings, { t });
        }

        ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
          name: 'conversation.input.left',
          id: 'long-input',
          order: 0,
        }, TriggerEntry));

        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'long-input-dialog',
          order: 900,
        }, OverlayEntry));

        ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
          name: 'plugins.bundle.config',
          key: '@local/dsh-long-input',
        }, ConfigEntry));
      },
    };
  },
});
