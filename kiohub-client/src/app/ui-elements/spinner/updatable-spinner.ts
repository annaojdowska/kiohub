import { SpinnerComponent } from './spinner.component';

export abstract class UpdatableSpinner extends SpinnerComponent {
    // list of successfully uploaded elements' names
    succesList: string[] = [];
    // list of badly uploaded elements' names
    failedList: string[] = [];
    // updatable info string to display in a view
    infoString = '';
    // view, on which element is being updated
    viewComponent;

    // how many elements to upload
    elementsToSave: number;
    // how many elements had been already uploaded
    savedElements: number;

    currentlyBeingSavedText: string;
    savedElementsText: string;
    failedElementsText: string;

    

    // actions taken when update has been completed
    protected abstract onUpdateCompleted();
    // initialize inherited elements
    protected abstract setInheritedElements();

    beginUpload(attachmentsToSave: number, view, infoString: string) {
        this.savedElements = 0;
        this.elementsToSave = attachmentsToSave;
        this.viewComponent = view;
        this.succesList = [];
        this.failedList = [];
        this.infoString = infoString;
        this.setDisplay(true);
        this.updateInfoText();
    }

    addSuccess(successedElementName: string) {
        this.succesList.push(successedElementName);
        this.savedElements++;
        this.updateSpinner();
    }

    addFail(failedElementName: string) {
        this.failedList.push(failedElementName);
        this.savedElements++;
        this.updateSpinner();
    }

    updateSpinner() {
        if (this.elementsToSave === this.savedElements) {
            this.updateInfoText();
            this.onUpdateCompleted();
        } else {
            this.updateInfoText();
        }
    }

    protected updateInfoText() {
        // ex. trwa dodawanie załączników (zapisano 1 z 3)
        this.text = this.infoString + this.currentlyBeingSavedText + ' (zapisano ' + this.savedElements + ' z ' + this.elementsToSave + '). ';
        if (this.succesList.length > 0) {
            // ex. zapisano załączniki: [lista]
            this.text += '\n' + this.savedElementsText + ' ' + this.valueUtils.formatStringArrayToView(this.succesList) + '. ';
        }
        if (this.failedList.length > 0) {
            // ex. wystąpiły problemy z zapisaniem załaczników: [lista]
            this.text += '\n' + this.valueUtils.formatStringArrayToView(this.failedList) + '. ';
        }
    }

}
