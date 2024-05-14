/**
*
*
*  Copyright (c) 2024, <Firstname Lastname>, MIT License
*  For more information, see the LICENSE file
*
*
**/







import * as vscode from 'vscode';

interface IAddHeaderProps {
	rootPathFieldValue: string,
	textBlockFieldValue: string,
	fileTypesField: Array<string>,
	skipItemsFieldValue: Array<string>
}

const addHeaders = (props: IAddHeaderProps): void => {
	const { workspace, Uri, commands, FileSystemError, window } = vscode;
	const { rootPathFieldValue, textBlockFieldValue, skipItemsFieldValue, fileTypesField } = props;

	// First, check whether or not the filesystem is editable
	const writingPermitted: boolean | undefined = workspace.fs.isWritableFileSystem("file");
	const initialPath: string = "D:\/gitlab\/vscode-header-plugin\/vscode-header-plugin\/src";
	//vscode-header-plugin.testcmd
	// Dive deeper into file tree

	console.log("AAAA", props);

	const dive = async (path: string): Promise<void> => {
		const srcURI: vscode.Uri = Uri.file(path);
		const items = await workspace.fs.readDirectory(srcURI);

		items.forEach(async (item) => {
			// item: [string, enum], e.g. ["extension.ts", 1], which means extension.ts is a folder
			// See: https://code.visualstudio.com/api/references/vscode-api#FileType

			const itemName = item[0];
			const typeEnum = item[1];

			const rootPath = rootPathFieldValue;
			const currentUri: vscode.Uri = Uri.file(rootPath);

			if (typeEnum === 1) {
				// This is a file

				// Proceed with this file if its extension matches this regex
				//const extRegex = /^.*\.(ts|js|tsx|jsx|css|scss|txt)$/;
				const fileTypesString = fileTypesField.join("|");
				const extRegex = new RegExp(`^.*\.(${fileTypesString})$`);

				if (itemName.match(extRegex)) {
					//	const fileContents = await workspace.fs.readFile(currentUri);
					//	const contentsAsString = new TextDecoder().decode(fileContents);

					//	const headerText = "\n\nThis is my\nfreakin header!\n\n";
					//	const updatedFileContents = `${textBlockFieldValue}\n\n\n${contentsAsString}`;

					//const encodedContents = new TextEncoder().encode(updatedFileContents);

					//await workspace.fs.writeFile(currentUri, encodedContents);'/'
				}

			} else if (typeEnum === 2) {
				// This is a directory
				// Continue the recursion

				dive(rootPath);
			}
		});

	};
};

export default addHeaders