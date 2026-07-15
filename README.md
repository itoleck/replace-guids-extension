# Replace GUIDs

Right-click any file in the VS Code Explorer and choose **Replace GUIDs** to
write a copy of the file with every UUID/GUID replaced by a configurable
value. GUIDs embedded inside longer strings (ARM resource ids, machine
names, connection strings, ...) are replaced too. The original file is never
modified.

Useful for anonymizing Azure Migrate exports (subscription ids, appliance
ids, BIOS GUIDs) before sharing them or checking them in as test data.

## Usage

1. Right-click a file in the Explorer.
2. Choose **Replace GUIDs**.
3. A copy named `<prefix><original name>` (default `0guid-<original name>`)
   is written next to the original, and a notification reports how many
   GUIDs were replaced.

The command is also available from the Command Palette and then applies to
the file open in the active editor.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `replaceGuids.replacementGuid` | `00000000-0000-0000-0000-000000000000` | The value every detected UUID/GUID is replaced with. |
| `replaceGuids.filePrefix` | `0guid-` | Prefix added to the original file name for the scrubbed copy. |

## Building the VSIX

```sh
cd replace-guids-extension
npx --yes @vscode/vsce package
```

## Installing

```sh
code --install-extension replace-guids-0.0.1.vsix
```

Or in VS Code: Extensions view → `...` menu → **Install from VSIX...**
