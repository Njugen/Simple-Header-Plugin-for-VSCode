# Simple Header Plugin for VSCode

**Issue:** I just needed an easy way to prepend a textblock onto a larger batch of files in my projects. Surprisingly, a lot of VSCode plugins for this purpose is either outdated, unmaintained or have very unclear instructions. This tool was created to get around that and make it simple to prepend textblocks to files without hassle.

The plugin recursively loops through the workspace's directories and prepends a textblock to files of specific filetypes and ignores certain files stated in the configuration. 

## Geting started

### Config

1. Open **Visual Studio Code** and install this plugin.
2. Open your workspace's (project) root directory in VSCode
3. Create a file **headerConfig.json** in your workspace directory. E.g. __D:\my-files\my-project\headerConfig.json__


4. Place this code block into the JSON-file and save

```
{
    "startDir": "D:/vscode-header-plugin/src",
    "headerText": [],
    "fileTypes": [],
    "ignoreItems": []
}
```

### Explanation of headerConfig.json

- **startDir (string | null):** The directory of the files you wish to prepend a textblock to (defaults to the workspace's root folder if null). Only specify a folder relevant to your project. Careless use may mess up your system

- **headerText (string[]):** Chunks of strings that makes up the textblock you wish to prepend. E.g.

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

Should result in the following being prepended to your files:

```
/**
*
*
*  Hahaha
*
*
**/
```

- **fileTypes (string[])**: Allow files of certain extensions to have the textblock prepended, e.g. __["tsx", "ts", "js", "jsx", "css", "sass","scss"]__. Other files are ignored. 

- **ignoreItems (string[]):** A list of paths to specific items to ignore. Paths are relative to **startDir**. E.g. __["/utils/son-goku.js", "/limit-break"]__ ignores the file __D:/vscode-header-plugin/src/utils/son-goku.js__, as well as all files located in the __D:/vscode-header-plugin/src/limit-break__ folder


### Run
Hit Ctrl + Shift + P and select **Simple Header: Add headers to files** from the command bar. The plugin inserts a textblock based on settings in  __headerConfig.json__ -

### Warning!
Backup and/or commit your project - and make a proper assessment of the **headerConfig.json** file - before running this plugin. Careless use may mess up your project.

## Tests

Automated tests will be added soon. Basic manual tests indicates the extension works with Windows 10. Mac and Linux

### Windows 10

### MacOS

### Linux

# MIT License
This plugin falls under the MIT License (see LICENSE.md). Use it however you like, change it however you like and distribute it however you like. Contributions are appreciated, just keep it simple.