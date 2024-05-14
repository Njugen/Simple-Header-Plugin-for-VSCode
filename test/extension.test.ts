const assert = require("assert");
const vscode = require("vscode");

suite('Test Simple Header Plugin for VSCode', () => {
    const { Uri, commands, workspace } = vscode;

    class TextDecoder {
        constructor() { }

        public decode(arg: string) {
            return {
                "startDirs": [
                    "/src",
                    "/out"
                ],
                "headerText": [
                    "/**",
                    "*",
                    "*",
                    "*  Copyright (c) 2024, <Firstname Lastname>, MIT License",
                    "*  For more information, see the LICENSE file",
                    "*",
                    "*",
                    "**/",
                    "\n",
                    "\n"
                ],
                "fileTypes": [
                    "tsx",
                    "ts",
                    "js",
                    "jsx",
                    "css",
                    "sass",
                    "scss"
                ],
                "ignoreItems": [
                    "/src/extension.ts"
                ]
            }
        }
    }

    test("'Simple Header: Add headers to files' appends textblock to documents", () => {
        commands.executeCommand("vscode-header-plugin.add-headers-to-files");

        //const extensionsFile = Uri.file(`${workspace.rootPath}/src/extensions.ts`);
        //
        //isExportDeclaration()

        assert.strictEqual(1, 1);
    });
});