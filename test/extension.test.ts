const assert = require("assert");
const vscode = require("vscode");

suite('Test Simple Header Plugin for VSCode', () => {
    const { commands, workspace, Uri } = vscode;
    const { rootPath, fs } = workspace;

    const wait = async () => new Promise((resolve, reject) => {
        setTimeout(resolve, 5000);
    });

    test("'Simple Header: Add headers to files' command prepends textblock to documents", async function () {
        this.timeout(15000);
        const mockRootPath = `${rootPath}/test/mocks/`;
        const mockConfigFilePath = `${rootPath}/test/mocks/headerConfig.json`;

        // Work with the mock config file
        const configFileUri = Uri.file(mockConfigFilePath);
        const configFile = await fs.readFile(configFileUri);
        const decodedFile = new TextDecoder().decode(configFile);

        // Decode file and get the settings
        let properties = JSON.parse(decodedFile);
        const headerTextBlock = properties.headerText.join("\n");

        commands.executeCommand("vscode-header-plugin.add-headers-to-files", [mockRootPath, mockConfigFilePath]);
        await wait();

        const fileUri = Uri.file(`${mockRootPath}/testfile.js`);
        const contents = await fs.readFile(fileUri);
        const data = new TextDecoder().decode(contents);

        assert.ok(data.includes(headerTextBlock));
    });
});