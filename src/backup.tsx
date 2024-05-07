
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const { workspace, Uri, commands, FileSystemError, window } = vscode;


const prependHeaderCMD = async () => {
		// First, check whether or not the filesystem is editable
		const writingPermitted: boolean | undefined = workspace.fs.isWritableFileSystem("file");
		const initialPath: string = "D:\/gitlab\/vscode-header-plugin\/vscode-header-plugin\/src";
		//vscode-header-plugin.testcmd
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

				// If this file is in the ignore list, then end this iteration.
				if (0 === 0) { }

				if (typeEnum === 1) {
					// This is a file

					// Proceed with this file if its extension matches this regex
					const extRegex = /^.*\.(ts|js|tsx|jsx|css|scss|txt)$/;

					if (itemName.match(extRegex)) {
						const fileContents = await workspace.fs.readFile(currentUri);
						const contentsAsString = new TextDecoder().decode(fileContents);

						const headerText = "\n\nThis is my\nfreakin header!\n\n";
						const updatedFileContents = `/***${headerText}***/\n\n\n${contentsAsString}`;

						const encodedContents = new TextEncoder().encode(updatedFileContents);

						await workspace.fs.writeFile(currentUri, encodedContents);
					}

				} else if (typeEnum === 2) {
					// This is a directory
					// Continue the recursion

					dive(filename);
				}
			});

			// If there are no more folder, this function ends as there won't be more recursions
		};

		await dive(initialPath);



		const command = "";
	};

	prependHeaderCMD();
}
