
import * as vscode from 'vscode';
import addHeaders from './addHeaders';

const contents = (webview: vscode.Webview): string => {
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
					const selectedFileTypes = [];

					const addFileType = () => {
						const fileTypesList = document.getElementById("selected-file-types-list");
						const fileTypesField = document.getElementById("file-types-field");
					
						const newType = fileTypesField.value;

						if(selectedFileTypes.includes(newType)){
							return;
						}

						selectedFileTypes.push(newType);

						const newListItem = document.createElement("li");
						newListItem.innerHTML = newType;

						fileTypesList.appendChild(newListItem);
					}
				
					const handleRun = () => {
						console.log("DEF");
						
						const textBlockField = document.getElementById("text-block-field");
						const rootPathField = document.getElementById("root-path-field");
						const skipItemsField = document.getElementById("skip-items-field");

						vscode.postMessage({
							command: 'run',
							data: {
								textBlockFieldValue: textBlockField.value,
								fileTypesField: selectedFileTypes,
								rootPathFieldValue: rootPathField.value,
								skipItemsFieldValue: skipItemsField.value 
							}
						})
					}
				</script>

				<label>Text block</label>
				<textarea id="text-block-field" width="500" height="200"></textarea>
				
				<label>File Types</label>
				<ul id="selected-file-types-list">
				</ul>
				<input id="file-types-field" type="text" defaultValue="" />
				<button onClick="addFileType()">Add</button>

				<label>Root path:</label>
				<input id="root-path-field" type="text" defaultValue="" />

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
	const addHeadersCMD = commands.registerCommand("vscode-header-plugin.add-headers-to-files", async () => {

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
				console.log("BBBB", e);
				const { command, data } = e;

				if (command === "run") {
					// Start appending headers
					addHeaders(data);

				} else if (command === "save") {
					// Save settings for later use
				}

			};



			// Messages from webview
			panel.webview.onDidReceiveMessage(messageHandler, undefined, ctx.subscriptions);
		}

	});

	ctx.subscriptions.push(addHeadersCMD);
}

// This method is called when your extension is deactivated
export function deactivate() { }
