# <img width="128" height="128" alt="replace_guids" src="https://github.com/user-attachments/assets/53a262ad-092d-4276-8162-49e3d9e9c59d" /> Replace GUIDs

Right-click any file in the VS Code Explorer and choose **Replace GUIDs** to
write a copy of the file with every UUID/GUID replaced by a configurable
value. GUIDs embedded inside longer strings (ARM resource ids, machine
names, connection strings, ...) are replaced too. The original file is never
modified.

Useful for anonymizing Azure resource/template exports (subscription ids, appliance
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
| `replaceGuids.excludedGuids` | `[]` | GUIDs that are left untouched instead of being replaced. |

### Excluding GUIDs

Some GUIDs are well-known and worth keeping readable — Azure built-in role
definition ids, tenant ids of public services, fixed schema/namespace ids.
Add them to `replaceGuids.excludedGuids` and they survive the scrub.

Settings UI: **Settings → Extensions → Replace GUIDs → Excluded Guids →
Add Item**. Or edit `settings.json` directly to paste a batch:

```jsonc
"replaceGuids.excludedGuids": [
    "00000000-0000-0000-0000-000000000000",
    "b24988ac-6180-42a0-ab88-20f7382dd24c", // Azure Contributor role
    "{8e3af657-a8ff-443c-a75c-2fe8c4bcb635}" // braces are fine
]
```

Matching ignores case and optional `{}` braces, so a GUID only needs to be
listed once no matter how it is formatted in your files. The notification
reports how many GUIDs were kept because of this list.

## Building the VSIX from Github source

```sh
cd replace-guids-extension
npx --yes @vscode/vsce package
```

## Installing the VSIX from Github source

```sh
code --install-extension replace-guids.vsix
```

Or in VS Code: Extensions view → `...` menu → **Install from VSIX...**

## Requirements

VS Code `^1.85.0`.

## License

MIT