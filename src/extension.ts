import * as vscode from 'vscode';

interface IProperties {
	startDirs?: string[],
	headerText: string[],
	fileTypes: string[],
	ignoreItems: string[]
}

// Run this when the extension is activated
const activate = async (ctx: vscode.ExtensionContext) => {
	const { workspace, Uri, commands, FileSystemError, window } = vscode;

	// Run this when the user runs this command
	const addHeadersCMD = commands.registerCommand("vscode-header-plugin.add-headers-to-files", async (cmdArg: any[]) => {
		const { fs, rootPath } = workspace;

		const root = (cmdArg && cmdArg[0]) || rootPath;
		const configFilePath = (cmdArg && cmdArg[1]) || `${root}/headerConfig.json`;

		// Work with the plugin's config file
		const configFileUri: vscode.Uri = Uri.file(configFilePath);
		const configFile = await fs.readFile(configFileUri);
		const decodedFile: string = new TextDecoder().decode(configFile);

		// Decode file and get the settings
		let properties: IProperties = JSON.parse(decodedFile);
		const headerTextBlock: string = properties.headerText.join("\n");
		const { fileTypes, startDirs, ignoreItems } = properties;
		const ignoreItemsFullPaths = ignoreItems.map((item) => `${root}/${item}`);

		// Start looping through the folders in recursion, starting from startPath
		const dive = async (startDir?: string): Promise<void> => {
			// Read the directory and return all items (sub directories and files) in it
			const fullStartDirPath = startDir ? (root + "/" + startDir) : root;
			const srcURI: vscode.Uri = Uri.file(fullStartDirPath || root || "");
			const items = await workspace.fs.readDirectory(srcURI);

			// Loop through the folder's items
			items.forEach(async (item, i) => {
				// item: [string, enum], e.g. ["extension.ts", 1], which means extension.ts is a file
				// See: https://code.visualstudio.com/api/references/vscode-api#FileType

				const itemName = item[0];
				const typeEnum = item[1];

				// Mandatory ignore these items
				const ignore = [
					"node_modules",
					".git",
				];

				// If the current item's path equals either those listed in mandatory list above, or the ignoreItems
				// property in the config file, then proceed to the next iteration
				if (ignoreItemsFullPaths.includes(String.raw`${fullStartDirPath}/${itemName}`) || ignore.includes(itemName)) {
					return;
				}

				if (typeEnum === 1) {
					// This is a file

					// Proceed with this file if its extension matches this regex
					// const extRegex = /^.*\.(ts|js|tsx|jsx|css|scss|txt)$/;
					const fileTypesString = fileTypes.join("|");
					const extRegex = new RegExp(`^.*\.(${fileTypesString})$`);

					if (itemName.match(extRegex)) {
						// The file type matches those stated in the config file,
						// start the writing process and insert the text block at the top of the file
						const fileUri: vscode.Uri = Uri.file(`${fullStartDirPath}/${itemName}`);
						const fileContents = await workspace.fs.readFile(fileUri);

						const contentsAsString = new TextDecoder().decode(fileContents);
						const updatedFileContents = `${headerTextBlock}\n\n\n${contentsAsString}`;

						const encodedContents = new TextEncoder().encode(updatedFileContents);
						await workspace.fs.writeFile(fileUri, encodedContents);
					}

				} else if (typeEnum === 2) {
					// This is a directory
					// Continue the recursion

					await dive(`${startDir}/${itemName}`);
				}

				// If the last item in startDirs has the filename "itemName", then show this message
				if (startDirs && startDirs[startDirs.length - 1] === itemName) {
					vscode.window.showInformationMessage('Textblocks have been added to targetted files', { modal: false });
				}
			});
		};

		if (startDirs && startDirs.length > 0) {
			startDirs.forEach((dir) => dive(dir));
		} else {
			dive("");

		}
		vscode.window.showInformationMessage('Textblocks have been added to targetted files', { modal: false });
	});

	ctx.subscriptions.push(addHeadersCMD);
}

// This method is called when your extension is deactivated
export {
	activate
}