"use strict";

const vscode = require("vscode");

const GUID_RE =
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

// GUIDs are compared case-insensitively and tolerate the {...} wrapper
// so the exclusion list matches however the user pasted the value in.
function normalizeGuid(value) {
    return String(value).trim().replace(/^\{|\}$/g, "").toLowerCase();
}

async function replaceGuidsInFile(uri) {
    // Explorer context menu passes the clicked uri; fall back to the
    // active editor so the command also works from the palette.
    if (!uri && vscode.window.activeTextEditor) {
        uri = vscode.window.activeTextEditor.document.uri;
    }
    if (!uri) {
        vscode.window.showErrorMessage("Replace GUIDs: no file selected.");
        return;
    }

    const config = vscode.workspace.getConfiguration("replaceGuids");
    const replacement = config.get(
        "replacementGuid",
        "00000000-0000-0000-0000-000000000000"
    );
    const prefix = config.get("filePrefix", "0guid-");
    const excluded = new Set(
        (config.get("excludedGuids", []) || [])
            .map(normalizeGuid)
            .filter((guid) => guid.length > 0)
    );

    try {
        const bytes = await vscode.workspace.fs.readFile(uri);
        const text = Buffer.from(bytes).toString("utf8");

        let count = 0;
        let skipped = 0;
        const scrubbed = text.replace(GUID_RE, (match) => {
            if (excluded.has(normalizeGuid(match))) {
                skipped += 1;
                return match;
            }
            count += 1;
            return replacement;
        });

        const baseName = uri.path.split("/").pop();
        const outUri = vscode.Uri.joinPath(uri, "..", prefix + baseName);
        await vscode.workspace.fs.writeFile(
            outUri,
            Buffer.from(scrubbed, "utf8")
        );

        const excludedNote = skipped ? `, kept ${skipped} excluded GUID(s)` : "";
        const message = `Replace GUIDs: replaced ${count} GUID(s)${excludedNote}, wrote ${
            prefix + baseName
        }`;
        const open = "Open file";
        vscode.window.showInformationMessage(message, open).then((choice) => {
            if (choice === open) {
                vscode.window.showTextDocument(outUri);
            }
        });
    } catch (err) {
        vscode.window.showErrorMessage(
            `Replace GUIDs failed: ${err && err.message ? err.message : err}`
        );
    }
}

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "replaceGuids.replaceInFile",
            replaceGuidsInFile
        )
    );
}

function deactivate() {}

module.exports = { activate, deactivate };
