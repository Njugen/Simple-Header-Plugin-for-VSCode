
import { provideVSCodeDesignSystem, vsCodeButton, allComponents } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(allComponents);

interface IFormData {
    rootPathFieldValue: string,
    textBlockFieldValue: string,
    fileTypesField: Array<string>,
    skipItemsList: Array<string>
}

const vscode = acquireVsCodeApi();

const main = () => {
    const textBlockField = document.querySelector('[name="text-block-field"]') as HTMLTextAreaElement;
    const rootPathField = document.querySelector('[name="root-path-field"]') as HTMLInputElement;
    let selectedFileTypes: Array<string> = [];

    const addTypeButton = document.querySelector('[name="add-type-button"]') as HTMLButtonElement;
    const runButton = document.querySelector('[name="run-button"]') as HTMLButtonElement;

    const addSkipPathButton = document.querySelector('[name="add-skip-path-button"]') as HTMLButtonElement;
    let skipPaths: Array<string> = [];

    const submitData = (cmd: string) => {
        const payload: IFormData = {
            textBlockFieldValue: textBlockField.value,
            rootPathFieldValue: rootPathField.value,
            skipItemsList: skipPaths,
            fileTypesField: selectedFileTypes
        };


        vscode.postMessage({
            command: cmd,
            data: payload
        });

    };

    const renderListItems = (section: HTMLElement, filledList: any[], listTag: string, newValue: any) => {
        if (filledList.includes(newValue) || newValue.length === 0) {
            return;
        }

        filledList.push(newValue);

        const newListItem = document.createElement(listTag);

        const listItemText = document.createElement("span");
        listItemText.innerHTML = newValue;

        const removeButton = document.createElement("button");
        removeButton.innerHTML = "x";
        removeButton.addEventListener("click", (e) => {
            e.stopPropagation();
            filledList = filledList.filter((target: string) => target !== newValue);
            const listItems = Array.from(section.getElementsByTagName(listTag));
            listItems.forEach((target, i) => {
                if (target.innerHTML.includes(newValue) === true) {
                    section.removeChild(target);
                }
            });

            submitData("save");
        });

        newListItem.appendChild(listItemText).appendChild(removeButton);

        section.appendChild(newListItem);

        submitData("save");
    }

    const addFileType = (e: any, presetFileTypes: Array<string> = []): void => {
        const fileTypesList = document.getElementById("selected-file-types-list") as HTMLDivElement;
        const fileTypesField = document.querySelector('[name="file-types-field"]') as HTMLInputElement;

        const process = (type: string): void => {
            if (fileTypesList && fileTypesField) {
                renderListItems(fileTypesList, selectedFileTypes, "vscode-tag", type);
            }
        };

        if (presetFileTypes.length > 0) {
            presetFileTypes.forEach((presetFileType: string) => {
                process(presetFileType);
            })
        } else {
            process(fileTypesField.value);
            fileTypesField.value = "";
        }
    };

    const addPath = (): void => {
        const skipPathList = document.getElementById("skip-path-list") as HTMLDivElement;
        const pathField = document.querySelector('[name="skip-path-field"]') as HTMLInputElement;

        if (skipPathList && pathField) {
            renderListItems(skipPathList, skipPaths, "li", pathField.value)


        }

        submitData("save");
    }

    textBlockField.addEventListener("change", (e: any) => submitData("save"));
    rootPathField.addEventListener("change", (e: any) => submitData("save"));
    runButton.addEventListener("click", (e: any) => submitData("run"));
    addTypeButton.addEventListener("click", addFileType);
    addSkipPathButton.addEventListener("click", addPath);

    window.addEventListener("message", (e) => {

        if (e.data.command === "delete-type") {
            selectedFileTypes = selectedFileTypes.filter((a, b) => a !== e.data.data.delete);
            submitData("save");
            return;
        } else if (e.data.command === "delete-path") {
            skipPaths = skipPaths.filter((a, b) => a !== e.data.data.delete);
            submitData("save");
            return;
        } else {
            selectedFileTypes = e.data.data.fileTypesField;
            textBlockField.value = e.data.data.textBlockFieldValue;
            rootPathField.value = e.data.data.rootPathFieldValue;
            skipPaths = e.data.data.skipItemsList;
        }

    });
};

window.addEventListener("load", main);

export { IFormData }