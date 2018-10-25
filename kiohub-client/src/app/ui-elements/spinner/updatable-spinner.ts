import { SpinnerComponent } from './spinner.component';

export abstract class UpdatableSpinner extends SpinnerComponent {
    // list of successfully uploaded elements' names
    succesList: string[];
    // list of badly uploaded elements' names
    failedList: string[];
    // updatable info string to display in a view
    infoString: string;
    // view, on which element is being updated
    viewComponent;

    // how many elements to upload
    elementsToSave: number;
    // how many elements had been already uploaded
    savedElements: number;

    // actions taken when upload begins
    abstract beginUpload(elementsToSave: number, viewComponent, infoString: string);
    // actions taken when sucessfully saved element
    abstract addSuccess(elementName: string);
    // actions taken when badly saved element
    abstract addFail(elementName: string);
    // actions taken when file has been saved (successfully or not)
    abstract updateSpinner();
    // actions taken when update has been completed
    abstract onUpdateCompeted();
}
