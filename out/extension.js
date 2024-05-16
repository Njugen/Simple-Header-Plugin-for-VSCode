/**
*
*
*  Copyright (c) 2024, <Firstname Lastname>, MIT License
*  For more information, see the LICENSE file
*
*
**/


"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var activate = async (ctx) => {
  const { workspace, Uri, commands, window } = vscode;
  const addHeadersCMD = commands.registerCommand("vscode-header-plugin.add-headers-to-files", async (cmdArg) => {
    const { fs, rootPath } = workspace;
    if (!rootPath) {
      window.showInformationMessage("Failed to insert textblocks: No open workspace", { modal: false });
      return;
    }
    const root = cmdArg && cmdArg[0] || rootPath;
    const configFilePath = cmdArg && cmdArg[1] || `${root}/headerConfig.json`;
    const configFileUri = Uri.file(configFilePath);
    const configFile = await fs.readFile(configFileUri);
    const decodedFile = new TextDecoder().decode(configFile);
    let properties = JSON.parse(decodedFile);
    const { fileTypes, startDirs, ignoreItems, headerText } = properties;
    const headerTextBlock = headerText.join("\n");
    const ignoreItemsFullPaths = ignoreItems.map((item) => `${root}/${item}`);
    const dive = async (startDir) => {
      const fullStartDirPath = startDir ? root + "/" + startDir : root;
      const srcURI = Uri.file(fullStartDirPath || root || "");
      const items = await workspace.fs.readDirectory(srcURI);
      items.forEach(async (item, i) => {
        const itemName = item[0];
        const typeEnum = item[1];
        const ignore = [
          "node_modules",
          ".git"
        ];
        if (ignoreItemsFullPaths.includes(String.raw`${fullStartDirPath}/${itemName}`) || ignore.includes(itemName)) {
          return;
        }
        if (typeEnum === 1) {
          const fileTypesString = fileTypes.join("|");
          const extRegex = new RegExp(`^.*.(${fileTypesString})$`);
          if (itemName.match(extRegex)) {
            const fileUri = Uri.file(`${fullStartDirPath}/${itemName}`);
            const fileContents = await workspace.fs.readFile(fileUri);
            const contentsAsString = new TextDecoder().decode(fileContents);
            const updatedFileContents = `${headerTextBlock}


${contentsAsString}`;
            const encodedContents = new TextEncoder().encode(updatedFileContents);
            await workspace.fs.writeFile(fileUri, encodedContents);
          }
        } else if (typeEnum === 2) {
          await dive(`${startDir}/${itemName}`);
        }
        if (startDirs && startDirs[startDirs.length - 1] === itemName) {
          window.showInformationMessage("Textblocks have been added to targetted files", { modal: false });
        }
      });
    };
    if (startDirs && startDirs.length > 0) {
      startDirs.forEach((dir) => dive(dir));
    } else {
      dive("");
    }
    window.showInformationMessage("Textblocks have been added to targetted files", { modal: false });
  });
  ctx.subscriptions.push(addHeadersCMD);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
//# sourceMappingURL=extension.js.map
