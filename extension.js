"use strict";

const vscode = require("vscode");

const GUID_RE =
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

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

    try {
        const bytes = await vscode.workspace.fs.readFile(uri);
        const text = Buffer.from(bytes).toString("utf8");

        let count = 0;
        const scrubbed = text.replace(GUID_RE, () => {
            count += 1;
            return replacement;
        });

        const baseName = uri.path.split("/").pop();
        const outUri = vscode.Uri.joinPath(uri, "..", prefix + baseName);
        await vscode.workspace.fs.writeFile(
            outUri,
            Buffer.from(scrubbed, "utf8")
        );

        const message = `Replace GUIDs: replaced ${count} GUID(s), wrote ${
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
