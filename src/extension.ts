
import * as vscode from 'vscode';

interface IProperties {
	startDirs?: string[],
	headerText: string[],
	fileTypes: string[],
	ignoreItems: string[]
}

// Run this when the extension is activated
const activate = (ctx: vscode.ExtensionContext) => {
	const { workspace, Uri, commands, FileSystemError, window } = vscode;

	// Run this when the user runs this command
	const addHeadersCMD = commands.registerCommand("vscode-header-plugin.add-headers-to-files", async () => {
		const { fs, rootPath } = workspace;

		// Work with the plugin's config file
		const configFileUri: vscode.Uri = Uri.file(`${rootPath}/headerConfig.json`);
		const configFile = await fs.readFile(configFileUri);
		const decodedFile: string = new TextDecoder().decode(configFile);

		// Decode file and get the settings
		let properties: IProperties = JSON.parse(decodedFile);
		const headerTextBlock: string = properties.headerText.join("\n");
		const { fileTypes, startDirs, ignoreItems } = properties;

		// Start looping through the folders in recursion, starting from startPath
		const dive = async (startDir?: string): Promise<void> => {
			// Read the directory and return all items (sub directories and files) in it
			const fullStartDirPath = startDir ? (rootPath + "/" + startDir) : rootPath;
			const srcURI: vscode.Uri = Uri.file(fullStartDirPath || rootPath || "");
			const items = await workspace.fs.readDirectory(srcURI);

			// Loop through the folder's items
			items.forEach(async (item) => {
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

				console.log("IGNORE ITEMS", String.raw`${fullStartDirPath}/${itemName}`);

				const ignoreItemsFullPaths = ignoreItems.map((item) => `${rootPath}/${item}`);

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

					await dive(`${rootPath}/${itemName}`);
				}
			});

		};

		if (startDirs && startDirs.length > 0) {
			startDirs.forEach((dir) => dive(dir));
		} else {
			dive();
		}

	});

	ctx.subscriptions.push(addHeadersCMD);
}

// This method is called when your extension is deactivated
export {
	activate
}