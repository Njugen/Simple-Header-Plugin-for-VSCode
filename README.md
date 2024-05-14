# Simple Header Plugin for VSCode (in development)

**Issue:** I just needed an easy way to prepend a textblock (e.g. copyright notice) onto a larger batch of files in my projects. Surprisingly, a lot of VSCode plugins for this purpose is either outdated or have very unclear instructions. This basic tool was created to get around that and make it simple to prepend textblocks to files without hassle.

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

- **startDirs (string[], optional):** The directories of the files you wish to prepend a textblock to (defaults to the workspace's root folder if not present). Files within all levels of subfolders are taken into consideration. Only specify folders relevant to your project. Careless use may mess up your system

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

- **ignoreItems (string[]):** A list of paths to specific items to ignore. E.g. __D:/vscode-header-plugin/src/utils/son-goku.js__. Ignoring a folder also means ignoring all files nested in that folder.


### Run
Hit Ctrl + Shift + P and select **Simple Header: Add headers to files** from the command bar. The plugin inserts a textblock based on settings in  __headerConfig.json__ -

### Warning!
Backup and/or commit your project - and make a proper assessment of the **headerConfig.json** file - before running this plugin. Careless use may mess up your project.

## Tests

Preliminary manual tests indicates the plugin works as expected on Windows 10. The plugin has not been tested in Linux nor Mac yet, so avoid using it on those systems for now...

Automated tests are located in __/test/__ along with necessary mocks. Currently there are only a very basic tests for certain features. More relevant tests will be added later to ensure high confidence in the plugin truly working as intended.

### Run tests

1. Open the project
2. In the project's terminal, run the following command:

```
    npm run test
```

The results shows up in the terminal once the tests have been completed.

## Todo

- Write tests to thoroughly cover important cases that occurs when changing headerConfig.json
- Configure bundling

# MIT License
This plugin falls under the MIT License (see LICENSE.md). Use it however you like, change it however you like and distribute it however you like. Contributions are appreciated, just keep it simple.