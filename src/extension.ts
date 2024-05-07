
import * as vscode from 'vscode';

const contents = (webview: vscode.Webview): string => {
	const { cspSource } = webview;

	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				
				<title>Cat Coding</title>
			</head>
			<body>
				<script>
					console.log("abc");
					const vscode = acquireVsCodeApi();
				
					const handleRun = (e) => {
						console.log("DEF");
						
						const textBlockField = document.getElementById("text-block-field");
						const targetPathField = document.getElementById("target-path-field");
						const skipItemsField = document.getElementById("skip-items-field");

						console.log("textBlockField", textBlockField.value);
						console.log("targetPathField", targetPathField.value);
						console.log("skipItemsField", skipItemsField.value);

						vscode.postMessage({
							command: 'run',
							data: {
								textBlockFieldValue: textBlockField.value,
								targetPathFieldValue: targetPathField.value,
								skipItemsFieldValue: skipItemsField.value 
							}
						})
					}
				</script>

				<label>Text block</label>
				<textarea id="text-block-field" width="500" height="200"></textarea>
				
				<label>Target path:</label>
				<input id="target-path-field" type="text" defaultValue="" />

				<label>Skip items:</label>
				<textarea id="skip-items-field" width="500" height="200"></textarea>

				<button onClick="handleRun()">Run</button>
				<button>Save</button>
			</body>
		</html>		
	`;
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(ctx: vscode.ExtensionContext) {
	const { workspace, Uri, commands, FileSystemError, window } = vscode;

	let panel: vscode.WebviewPanel | undefined;
	// Find out whether or not this panel is in the background or not
	const activeInColumn: vscode.ViewColumn | undefined = vscode.window.activeTextEditor && vscode.window.activeTextEditor.viewColumn;
	const prependHeaderCMD = commands.registerCommand("vscode-header-plugin.testcmd", async () => {

		// If panel exists then, then focus on it.
		if (panel) {
			panel.reveal(activeInColumn);
		} else {
			// If no such panel exists, then create it
			const options = {
				enableScripts: true
			};

			panel = window.createWebviewPanel("vscode-header-plugin", "VSCode Header Plugin", vscode.ViewColumn.Two, options);
			panel.webview.html = contents(panel.webview);
			console.log("ABC");
			const messageHandler = (e: any): void => {
				const { command, data } = e;

				if (command === "run") {
					// Start appending headers
				} else if (command === "save") {
					// Save settings for later use
				}

			};



			// Messages from webview
			panel.webview.onDidReceiveMessage(messageHandler, undefined, ctx.subscriptions);
		}

	});

	ctx.subscriptions.push(prependHeaderCMD);
}

// This method is called when your extension is deactivated
export function deactivate() { }
