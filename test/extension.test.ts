const assert = require("assert");
const vscode = require("vscode");

suite('Test Simple Header Plugin for VSCode', () => {
    const { commands, workspace, fs, Uri } = vscode;
    const { rootPath } = workspace;

    test("'Simple Header: Add headers to files' appends textblock to documents", () => {
        commands.executeCommand("vscode-header-plugin.add-headers-to-files");

        //const extensionsFile = Uri.file(`${workspace.rootPath}/src/extensions.ts`);
        //
        //isExportDeclaration()

        const fileUri = Uri.file(`${rootPath}/src/extension.ts`);
        const contents = fs.readFile(fileUri);

        const data = new TextDecoder().decode(contents);

        assert.ok(data.includes("Copyright"));
    });
});