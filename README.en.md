# dsh-long-input

A long-form Markdown editor dialog for the DeepSeek Harness Web composer. A "Long Input" button in the composer toolbar opens a split-pane dialog — write Markdown on the left, preview it live on the right, then write the result back to the composer in one action.

[简体中文](./README.md) | English

![English UI](assets/en.jpg)

## Features

- A "Long Input" button appears in the composer toolbar (to the right of the permission/plan controls); its label follows the UI locale.
- Opening the dialog imports the current draft from the composer; after that both sides edit independently, with no reverse syncing.
- Plain-text editing on the left, live Markdown rendering on the right (GitHub Flavored Markdown, line breaks honored), powered by a bundled copy of marked.
- Drag the divider to resize the two panes (20%–80%); the ratio is remembered.
- Writing back preserves slash commands (e.g. `/goal`) and `@file` references from the original draft — they are re-attached as a fixed prefix rather than dropped.
- Closing (X / Cancel / `Esc`) asks whether to discard or write back, with a "remember my choice" option; the same behavior can be preset in the plugin settings or reset to always ask.
- Follows light/dark theme and UI locale with no configuration.

## Shortcuts

| Action | Keys |
| --- | --- |
| New line | `Enter` |
| Write back to composer | `Ctrl+Enter` / `Cmd+Enter` |
| Close dialog | `Esc` |

## Install

The package is published on npm as `dsh-long-input` and ships a prebuilt bundle — **no build step is required after install**.

### From npm (recommended)

```sh
dsh plugin --profile web add dsh-long-input
```

On Desktop, target the desktop profile instead:

```sh
dsh plugin --profile desktop add dsh-long-input
```

### From GitHub

```sh
dsh plugin --profile web add github:DingL0312/dsh-long-input-window
```

### From a local folder

```sh
dsh plugin --profile web add ./dsh_md_input_window
```

### GUI

Settings → Plugins → "+ Add plugin" → enter `dsh-long-input` → Install → restart DeepSeek Harness.

### After installing

Restart DSH (`Ctrl+C` then `dsh web` again, or restart the Desktop app) and refresh the browser — the button then appears in the composer toolbar.

## Update & uninstall

```sh
dsh plugin --profile web add dsh-long-input@latest   # update to latest
dsh plugin --profile web remove dsh-long-input       # uninstall
```

## Settings

Settings → Plugins → dsh-long-input:

- **On close**: choose "Exit without writing back" or "Exit and write back"; select neither to be asked every time.
- **Restore defaults** clears the choice and resets the split ratio to 50%.

## Notes

- Writing back replaces the whole composer draft; slash commands and `@` references are preserved and moved in front of the body text.
- The preview does not sanitize raw HTML — do not paste untrusted third-party HTML.
- Switching sessions while the dialog is open closes it, so content is never written to the wrong session.
- Once "remember my choice" is saved, closing no longer asks; unset it in the plugin settings (or use "Restore defaults") to ask again.
- Web UI only.

## License

MIT. Copyright and license information for `marked` is in `THIRD_PARTY_NOTICES.md`.
