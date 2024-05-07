// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const { workspace, Uri, commands, FileSystemError } = vscode;

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-header-plugin" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	/*let disposable = vscode.commands.registerCommand('vscode-header-plugin.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscode-header-plugin!');
	});*/

	const prependHeaderCMD = commands.registerCommand("vscode-header-plugin.testcmd", async () => {
		// First, check whether or not the filesystem is editable
		const writingPermitted: boolean | undefined = workspace.fs.isWritableFileSystem("file");
		const initialPath: string = "D:\/gitlab\/vscode-header-plugin\/vscode-header-plugin\/src";

		// Dive deeper into file tree
		const dive = async (path: string): Promise<void> => {
			const srcURI: vscode.Uri = Uri.file(path);
			const items = await workspace.fs.readDirectory(srcURI);


			items.forEach(async (item) => {
				// item: [string, enum], e.g. ["extension.ts", 1], which means extension.ts is a folder
				// See: https://code.visualstudio.com/api/references/vscode-api#FileType

				const itemName = item[0];
				const typeEnum = item[1];

				const filename = `${path}/${itemName}`;
				const currentUri: vscode.Uri = Uri.file(filename);

				if (typeEnum === 1) {
					// This is a file

					// Proceed with this file if its extension matches this regex
					const extRegex = /^.*\.(ts|js|tsx|jsx|css|scss|txt)$/;

					if (itemName.match(extRegex)) {
						const fileContents = await workspace.fs.readFile(currentUri);
						const contentsAsString = new TextDecoder().decode(fileContents);

						const header = "This is my\nfreakin header!\n\n\n";
						const payload = `
						/***
							${header}${contentsAsString}
						***/
						`;

						console.log(payload);
					}

				} else if (typeEnum === 2) {
					// This is a directory
					// Continue the recursion

					dive(filename);
				} else {
					// Everything looped through. Resolve this promise

				}
			});


		};

		await dive(initialPath);



		const command = "";
	});

	context.subscriptions.push(prependHeaderCMD);
}

// This method is called when your extension is deactivated
export function deactivate() { }
