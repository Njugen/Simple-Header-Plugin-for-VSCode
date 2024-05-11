
/*
*
* CODE BLOCK
*
*/


import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { IFormData } from "../webview/main";

export class AddHeaderPanel {
    public static currentPanel: AddHeaderPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    private _presetFormData: IFormData = {
        textBlockFieldValue: "",
        rootPathFieldValue: "",
        skipItemsList: [],
        fileTypesField: ["test"]
    }

    private constructor(panel: vscode.WebviewPanel, ctx: vscode.ExtensionContext) {
        this._panel = panel;

        this._panel.webview.html = this._getWebviewContent(this._panel.webview, ctx.extensionUri);
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._setWebviewMessageListener(ctx, this._panel.webview);

        const storedFormData: any = ctx.workspaceState.get("form-data");
        if (storedFormData) {
            this._presetFormData = storedFormData;
        }
        console.log("STORED", storedFormData);
        // Make a preset
        panel.webview.postMessage({
            command: "preset",
            data: storedFormData || this._presetFormData
        });

        //this._addHeader(this._presetFormData);
    }

    public static render(ctx: vscode.ExtensionContext) {
        if (AddHeaderPanel.currentPanel) {
            AddHeaderPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
        } else {
            const options = {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(ctx.extensionUri, 'out')]
            };
            const panel = vscode.window.createWebviewPanel("vscode-header-plugin", "VSCode Header Plugin", vscode.ViewColumn.One, options);

            AddHeaderPanel.currentPanel = new AddHeaderPanel(panel, ctx);
        }
    }

    public dispose() {
        AddHeaderPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _addHeader(props: IFormData) {
        const { workspace, Uri, commands, FileSystemError, window } = vscode;
        const { rootPathFieldValue, textBlockFieldValue, skipItemsList, fileTypesField } = props;

        // First, check whether or not the filesystem is editable
        const writingPermitted: boolean | undefined = workspace.fs.isWritableFileSystem("file");
        const initialPath: string = "D:\/gitlab\/vscode-header-plugin\/vscode-header-plugin\/src";
        //vscode-header-plugin.testcmd
        // Dive deeper into file tree

        // console.log("AAAA", props);

        const workspaceFolders = workspace.workspaceFolders;
        // console.log("WWWWW", workspace.rootPath);
        const dive = async (path: string): Promise<void> => {
            const srcURI: vscode.Uri = Uri.file(path);
            const items = await workspace.fs.readDirectory(srcURI);

            if (path === "node_modules") {
                return;
            }

            //   console.log("PATH", path);
            items.forEach(async (item) => {
                // item: [string, enum], e.g. ["extension.ts", 1], which means extension.ts is a folder
                // See: https://code.visualstudio.com/api/references/vscode-api#FileType

                const itemName = item[0];
                const typeEnum = item[1];
                const rootPath = path;
                const currentUri: vscode.Uri = Uri.file(rootPath);

                // console.log("ITEM", itemName, typeEnum);

                //   console.log("ITEM NAME", itemName);
                //   console.log("PATH", rootPath);
                console.log("SKIP", skipItemsList, String.raw`${path}/${itemName}`);
                const ignore = [
                    "node_modules",
                    ".git",
                ];

                if (skipItemsList.includes(String.raw`${path}/${itemName}`) || ignore.includes(itemName)) {
                    return;
                }

                if (typeEnum === 1) {
                    // This is a file

                    // Proceed with this file if its extension matches this regex
                    //const extRegex = /^.*\.(ts|js|tsx|jsx|css|scss|txt)$/;
                    const fileTypesString = fileTypesField.join("|");
                    const extRegex = new RegExp(`^.*\.(${fileTypesString})$`);
                    //  console.log("REGEX", extRegex);
                    //  console.log("MATCH");
                    if (itemName.match(extRegex)) {
                        //    console.log("FILE", itemName);
                        const fileUri: vscode.Uri = Uri.file(`${rootPath}/${itemName}`);
                        const fileContents = await workspace.fs.readFile(fileUri);
                        //  console.log("FILE CONTENTS", fileContents);
                        const contentsAsString = new TextDecoder().decode(fileContents);

                        //console.log("CONTENTS AS STRING", fileContents);
                        const updatedFileContents = `${textBlockFieldValue}\n\n\n${contentsAsString}`;


                        const encodedContents = new TextEncoder().encode(updatedFileContents);
                        //console.log("ENDODED", encodedContents);
                        await workspace.fs.writeFile(fileUri, encodedContents);
                    }

                } else if (typeEnum === 2) {
                    // This is a directory
                    // Continue the recursion

                    await dive(`${rootPath}/${itemName}`);
                }
            });

        };

        dive(rootPathFieldValue || workspace.rootPath || "");
    };


    private _setWebviewMessageListener(ctx: vscode.ExtensionContext, webview: vscode.Webview) {
        webview.onDidReceiveMessage(
            (message: any) => {
                console.log("RECEIVED", message);
                const { data, command } = message;

                if (command === "run") {
                    this._addHeader(data);
                } else if (command === "save") {
                    const prevData: any = ctx.workspaceState.get("form-data");
                    console.log("PREV", prevData);
                    const newData: IFormData = {
                        textBlockFieldValue: data.textBlockFieldValue || prevData.textBlockFieldValue || "",
                        rootPathFieldValue: data.rootPathFieldValue || prevData.rootPathFieldValue || "",
                        skipItemsList: data.skipItemsList || prevData.skipItemsList || [],
                        fileTypesField: data.fileTypesField || prevData.fileTypesField || []
                    };

                    ctx.workspaceState.update("form-data", newData);
                    this._presetFormData = newData;
                }
            },
            undefined,
            this._disposables
        );
    }

    private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
        const webviewUri = getUri(webview, extensionUri, ["out", "webview.js"]);
        const nonce = getNonce();

        return `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8"><
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; font-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
                    <title>Cat Coding</title>

                    <style>
                        section#wrapper {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                        }

                        div.field-container {
                            width: 60%;
                            max-width: 800px;
                            margin: 1rem 0;
                        }

                        label {
                            font-weight: bold;
                        }

                        vscode-text-area {
                            width: 100%;
                            display: block;
                        }

                        vscode-text-field {
                            width: 100%;
                            display: block;
                        }

                        [name="add-type-button"] {

                        }

                        div#field-grid {
                            display: flex;
                            align-items: center
                        }

                        div#field-grid vscode-button {
                            margin-left: 1rem;
                        }

                        vscode-tag {
                            margin: 0.25rem
                        }

                        vscode-tag {
                            margin-top: 0.5rem;
                            margin-bottom: 0.5rem;
                        }

                        vscode-tag button {
                            margin-left: 0.5rem;
                            cursor: pointer;
                            opacity: 0.75;
                        } 

                        vscode-tag button:hover {
                            opacity: 0.5 
                        } 

                        div#selected-file-types-list {
                            margin: 1rem 0;
                        }

                        ul#skip-path-list {
                            padding: 0;
                            margin: 1rem 0;
                        }

                        ul#skip-path-list > li {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            padding: 0.75rem 0rem;
                        }

                        ul#skip-path-list > li:not(:last-child){
                            border-bottom: 1px solid rgba(255, 255, 255, 0.2)
                        }

                        ul#skip-path-list > li > button {
                            cursor: pointer;
                            opacity: 0.75;
                        }

                        ul#skip-path-list > li > button:hover {
                            opacity: 1
                        }
                    </style>
                </head>
                <body> 
                    <section id="wrapper">
                        <h1>Add file header</h1>
                        <div class="field-container">
                            <label>Text block</label>
                            <vscode-text-area name="text-block-field" rows="15" value="${this._presetFormData.textBlockFieldValue}"></vscode-text-area>
                        </div>
                        <div class="field-container">
                            <label>File types</label>
                            <div id="field-grid">
                                <vscode-text-field name="file-types-field" value=""></vscode-text-field>
                                <vscode-button name="add-type-button" appearance="primary">Add</vscode-button>
                            </div>
                            <div id="selected-file-types-list"></div>
                        </div>
                        <div class="field-container">
                            <label>Root directory</label>
                            <p>All files found in this directory and its sub directories</p>
                            <vscode-text-field name="root-path-field" value="${vscode.workspace.rootPath || `e.g c:\\folder1/folder2/project-folder`}"></vscode-text-field>
                        </div>

                        <div class="field-container">
                            <label>Skip items</label>
                            <p>Ignore certain files or folders by adding their relative path with regards to the root directory.</p>
                            <div id="field-grid">
                                <vscode-text-field name="skip-path-field" value="" placeholder="e.g. /styling/sidebar.css"></vscode-text-field>
                                <vscode-button name="add-skip-path-button" appearance="primary">Add</vscode-button>
                            </div>
                            <ul id="skip-path-list"></ul>
                        </div>

                        <em>
                            Warning: Make sure to backup and/or commit your project - and verify that all the fields are
                            filled accordingly to your needs - before hitting "Run". Running this carelessly may result in files
                            getting messed up.
                        </em>

                        <vscode-button name="run-button" appearance="primary">Run</vscode-button>
                    </section>

                    <script type="module" src="${webviewUri}"></script>
                    <script>
                        window.addEventListener("message", (e) => {
                            console.log("MY:", e);
                            if(e.data.fileTypesField){
                                return;
                            }
                            const { fileTypesField } = e.data.data;
                            const fileTypesList = document.getElementById("selected-file-types-list");
                            
                            console.log("FILETYPESFIELD", fileTypesField);
                            fileTypesField.forEach((type) => {
                                const newListItem = document.createElement("vscode-tag");

                                const listItemText = document.createElement("span");
                                listItemText.innerHTML = type;

                                const removeButton = document.createElement("button");
                                removeButton.innerHTML = "x";
                                removeButton.addEventListener("click", (e) => {
                                    e.stopPropagation();
                                    selectedFileTypes = selectedFileTypes.filter((target) => target !== newType);
                                    const tags = Array.from(fileTypesList.getElementsByTagName("vscode-tag"));
                                    const updatedListDOM = tags.forEach((target, i) => {
                                        if (target.innerHTML.includes(newType) === true) {
                                            fileTypesList.removeChild(target);
                                        }
                                    });
                                    console.log(updatedListDOM);
                                    console.log(newType);
                                });

                                newListItem.appendChild(listItemText).appendChild(removeButton);

                                fileTypesList.appendChild(newListItem);
                            })
                            
                        })
                    </script>
                </body>
            </html>
        `;
    }
}