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

    const addFileType = (): void => {
        const fileTypesList = document.getElementById("selected-file-types-list") as HTMLDivElement;
        const fileTypesField = document.querySelector('[name="file-types-field"]') as HTMLInputElement;

        if (fileTypesList && fileTypesField) {
            const newType = fileTypesField.value;

            if (selectedFileTypes.includes(newType) || newType.includes(" ") === true || newType.length === 0) {
                return;
            }

            selectedFileTypes.push(newType);

            const newListItem = document.createElement("vscode-tag");

            const listItemText = document.createElement("span");
            listItemText.innerHTML = newType;

            const removeButton = document.createElement("button");
            removeButton.innerHTML = "x";
            removeButton.addEventListener("click", (e) => {
                e.stopPropagation();
                selectedFileTypes = selectedFileTypes.filter((target: string) => target !== newType);
                const tags = Array.from(fileTypesList.getElementsByTagName("vscode-tag"));
                const updatedListDOM = tags.forEach((target, i) => {
                    //console.log("AAAA", target.innerHTML.includes(newType));
                    if (target.innerHTML.includes(newType) === true) {
                        fileTypesList.removeChild(target);
                    }
                });
                console.log(updatedListDOM);
                console.log(newType);
                //fileTypesList.childNodes = updatedListDOM;
            });

            newListItem.appendChild(listItemText).appendChild(removeButton);

            fileTypesList.appendChild(newListItem);
            fileTypesField.value = "";
        }

    };

    const addPath = (): void => {
        const skipPathList = document.getElementById("skip-path-list") as HTMLDivElement;
        const pathField = document.querySelector('[name="skip-path-field"]') as HTMLInputElement;

        if (skipPathList && pathField) {
            const newPath = pathField.value;

            if (skipPaths.includes(newPath) || newPath.length === 0) {
                return;
            }

            skipPaths.push(newPath);

            const newListItem = document.createElement("li");

            const listItemText = document.createElement("span");
            listItemText.innerHTML = newPath;

            const removeButton = document.createElement("button");
            removeButton.innerHTML = "x";
            removeButton.addEventListener("click", (e) => {
                e.stopPropagation();
                skipPaths = skipPaths.filter((target: string) => target !== newPath);
                const tags = Array.from(skipPathList.getElementsByTagName("li"));
                const updatedListDOM = tags.forEach((target, i) => {
                    //console.log("AAAA", target.innerHTML.includes(newPath));
                    if (target.innerHTML.includes(newPath) === true) {
                        skipPathList.removeChild(target);
                    }
                });
                console.log(updatedListDOM);
                console.log(newPath);
                //skipPathList.childNodes = updatedListDOM;
            });


            newListItem.appendChild(listItemText)
            newListItem.appendChild(removeButton);

            skipPathList.appendChild(newListItem);
            pathField.value = "";
        }

    }

    const submitData = () => {
        console.log("ROOOT", rootPathField.value);
        const payload: IFormData = {
            textBlockFieldValue: textBlockField.value,
            rootPathFieldValue: rootPathField.value,
            skipItemsList: skipPaths,
            fileTypesField: selectedFileTypes
        };

        vscode.postMessage({
            command: "run",
            data: payload
        });
    };

    runButton.addEventListener("click", submitData);
    addTypeButton.addEventListener("click", addFileType);
    addSkipPathButton.addEventListener("click", addPath);
};

window.addEventListener("load", main);

export { IFormData }