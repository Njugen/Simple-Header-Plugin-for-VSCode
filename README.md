# Simple Header Plugin 1.0.0

**Issue:** I just needed a simple-to-use plugin that could append a header block (a copyright notice in my case) onto a large batch of files in my other projects. Unfortunately - and surprisingly - a lot of existing plugins for this purpose is either outdated, unmaintained or have unclear usage instructions. The only purpose of this tool is just to give me and other developers a straight forward way to append a text block into targetted files without hassle... nothing more, nothning less.

## Usage

The idea is to place a text block into targetted files inside a project folder. The plugin uses recursion for this purpose, and only target filetypes stated in the configuration. Specific items can be ignored as well

### Config

1. Create a file **headerConfig.json** in your workspace's root directory. E.g. __D:\my-files\my-project\headerConfig.json__


2. Place this code block into the JSON-file

```
{
    "startDir": "D:/vscode-header-plugin/src",
    "headerText": [],
    "fileTypes": [],
    "ignoreItems": [
        "utilities/blablabla.ts"
    ]
}
```

- **startDir (string | null):** The directory of the files you wish to append a text block to (default's to the workspace's root folder if null). Only specify a folder relevant to your project. Careless use may mess up your system

- **headerText (Array<string>):** Chunks of strings that makes up the text block you wish to append. E.g.

```
    [
        "/**",
        "*",
        "*",
        "*  Hahaha",
        "*",
        "*",
        "**/"
    ]
```

Should result in the following to be appended into your files:

```
/**
*
*
*  Hahaha
*
*
**/
```

- **fileTypes (Array<string>)**: Allow files of certain extensions to have the text block appended. Other files are ignored. E.g. __["tsx", "ts", "js", "jsx", "css", "sass","scss"]__

- **ignoreItems (Array<string>):** A list of paths to specific items to ignore. Paths are relative to **startDir**. E.g. __["/utils/son-goku.js", "/limit-break"]__. This ignores the file __D:/vscode-header-plugin/src/utils/son-goku.js__, as well as all files located in the __D:/vscode-header-plugin/src/limit-break__ folder


### Run
1. Install this plugin into visual studio code
2. Hit Ctrl + Shift + Enter and select **Simple Header: Add headers to files** from the command bar

### Warning!
Backup and/or commit your project, and make a proper assessment of **headerConfig.json** file before running the plugin. Careless use may mess up your project.

# MIT License
This plugin falls under the MIT License (see LICENSE.md). Use it however you like, change it however you like.