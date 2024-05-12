
import * as vscode from 'vscode';

import { AddHeaderPanel } from './panels/AddHeaderPanel';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(ctx: vscode.ExtensionContext) {
	const { workspace, Uri, commands, FileSystemError, window } = vscode;

	let panel: vscode.WebviewPanel | undefined;
	// Find out whether or not this panel is in the background or not

	const addHeadersCMDLegacy = commands.registerCommand("vscode-header-plugin.add-headers-to-files-LEGACY", () => {

		// If panel exists then, then focus on it.

		AddHeaderPanel.render(ctx);
	});

	const addHeadersCMD = commands.registerCommand("vscode-header-plugin.add-headers-to-files", () => {
		const { fs, rootPath } = workspace;

		const configFileUri: vscode.Uri = Uri.file(`${rootPath}/headerConfig.json`);
		workspace.fs.readFile(configFileUri);
	});

	ctx.subscriptions.push(addHeadersCMDLegacy);
}

// This method is called when your extension is deactivated
export function deactivate() { }
