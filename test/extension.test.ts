import * as assert from 'assert';
import * as vscode from 'vscode';
import * as ext from "../src/extension";


suite('Test Simple Header Plugin for VSCode', () => {
    const { Uri, commands } = vscode;

    test("'Simple Header: Add headers to files' appends textblock to documents", () => {
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

        commands.executeCommand("vscode-header-plugin.add-headers-to-files");
    })
});