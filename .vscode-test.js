const { defineConfig } = require('@vscode/test-cli');
module.exports = defineConfig({
    label: "basicTest",
    files: 'test/*.test.ts',
    workspaceFolder: 'D:\\gitlab\\vscode-header-plugin\\vscode-header-plugin'
});