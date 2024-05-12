
import * as vscode from 'vscode';

import { AddHeaderPanel } from './panels/AddHeaderPanel';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(ctx: vscode.ExtensionContext) {
	const { workspace, Uri, commands, FileSystemError, window } = vscode;

	let panel: vscode.WebviewPanel | undefined;
	// Find out whether or not this panel is in the background or not

	const addHeadersCMD = commands.registerCommand("vscode-header-plugin.add-headers-to-files-ui", () => {

		// If panel exists then, then focus on it.

		AddHeaderPanel.render(ctx);
	});

	const runHeader = commands.registerCommand("vscode-header-plugin.add-headers-to-files", () => {

	});

	ctx.subscriptions.push(addHeadersCMD);
}

// This method is called when your extension is deactivated
export function deactivate() { }
