export interface IUpdatableSpinner {
    // list of successfully uploaded elements' names
    succesList: string[];
    // list of badly uploaded elements' names
    failedList: string[];
    // updatable info string to display in a view
    infoString: string;

    // how many elements to upload
    elementsToSave: number;
    // how many elements had been already uploaded
    savedElements: number;

    // actions taken when upload begins
    beginUpload(elementsToSave: number, viewComponent, infoString: string);
    // actions taken when sucessfully saved element
    addSuccess(elementName: string);
    // actions taken when badly saved element
    addFail(elementName: string);
    // actions taken when file has been saved (successfully or not)
    updateSpinner();
    // actions taken when update has been completed
    onUpdateCompeted();
}
