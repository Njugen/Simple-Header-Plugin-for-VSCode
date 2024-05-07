import * as vscode from 'vscode';

// Run this when activating the extension. This registers various commands that can be used in the extension
export function activate(context: vscode.ExtensionContext) {
	//console.log('Congratulations, your extension "vscode-header-plugin" is now active!');

	// The command "helloWorld" is defined here, but also needs to be defined in package.json in order to work
	let disposable = vscode.commands.registerCommand('vscode-header-plugin.helloWorld', () => {
		vscode.window.showInformationMessage('wooho');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
