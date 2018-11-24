import { SpinnerComponent } from './spinner.component';

export abstract class UpdatableSpinner extends SpinnerComponent {
    // list of successfully uploaded elements' names
    succesList: string[] = [];
    // list of badly uploaded elements' names
    failedList: string[] = [];
    // updatable info string to display in a view
    infoString = '';

    // how many elements to upload
    elementsToSave: number;
    // how many elements had been already uploaded
    savedElements: number;

    // ex. "trwa dodawanie załączników" / "rozpoczęto pobieranie plików"
    currentlyBeingSavedText: string;
    // ex. "zapisano następujące załączniki:" / "pobrano pliki:"
    savedElementsText: string;
    // ex. "nie udało się zapisać tych załączników: " / "wystąpił problem z plikami:"
    failedElementsText: string;

    // actions taken when update has been completed
    protected abstract onUpdateCompleted();
    // initialize inherited elements
    protected abstract setInheritedElements();
    // set view, on which element is being updated
    protected abstract setViewComponent(view);

    beginUpload(view, attachmentsToSave: number, infoString: string) {
        this.setViewComponent(view);
        this.savedElements = 0;
        this.elementsToSave = attachmentsToSave;
        this.succesList = [];
        this.failedList = [];
        this.infoString = infoString;
        this.setDisplay(true);
        this.updateSpinner();
    }

    resetSpinner() {
        this.savedElements = null;
        this.elementsToSave = null;
        this.succesList = [];
        this.failedList = [];
        this.infoString = '';
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
        if (this.isUpdateCompleted()) {
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

    protected isUpdateCompleted() {
        return this.elementsToSave === this.savedElements;
    }
}
