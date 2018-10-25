import { EditProjectGeneralTabComponent } from 'src/app/edit-project-general-tab/edit-project-general-tab.component';
import { ErrorType } from 'src/app/error-info/error-type.enum';
import { Component } from '@angular/core';
import { IUpdatableSpinner } from '../iupdatable-spinner';
import { SpinnerComponent } from '../spinner.component';

@Component({
    selector: 'app-spinner-update-project',
    templateUrl: '../spinner.component.html',
    styleUrls: ['../spinner.component.css']
  })
export class SpinnerUpdateProjectComponent extends SpinnerComponent implements IUpdatableSpinner {
    private editProjectComponent: EditProjectGeneralTabComponent;
    succesList: string[] = [];
    failedList: string[] = [];
    elementsToSave: number;
    savedElements: number;
    infoString = '';

    constructor() {
        super();
        console.log('dziecko!');
    }


    beginUpload(attachmentsToSave: number, editProjectComponent: EditProjectGeneralTabComponent, infoString: string) {
        console.log('begin!');
        this.savedElements = 0;
        this.elementsToSave = attachmentsToSave;
        this.editProjectComponent = editProjectComponent;
        this.succesList = [];
        this.failedList = [];
        this.infoString = infoString;
        this.setDisplay(true);
        this.setAttachmentUploadInfoText();
    }

    addSuccess(successedFileName: string) {
        this.succesList.push(successedFileName);
        this.savedElements++;
        this.updateSpinner();
    }

    addFail(failedFileName: string) {
        this.failedList.push(failedFileName);
        this.savedElements++;
        this.updateSpinner();
    }

    updateSpinner() {
        if (this.elementsToSave === this.savedElements) {
            this.setAttachmentUploadInfoText();
            this.onUpdateCompeted();
        } else {
            this.setAttachmentUploadInfoText();
        }
    }

    onUpdateCompeted() {
        const data = this.getDataToView();
        this.editProjectComponent.updateCompleted(data.text, data.type);
    }

    private getDataToView() {
        const errorAmount = this.failedList.length;
        let text: string;
        let errorType: ErrorType;

        if (errorAmount > 0) {
            if (errorAmount === this.elementsToSave) {
                errorType = ErrorType.ERROR;
                text = this.infoString + 'A załączniki? Nie udało się zapisać żadnego z załączników. ';
            } else {
                errorType = ErrorType.WARNING;
                // tslint:disable-next-line:max-line-length
                text = this.infoString + 'A załączniki? Zapisano ' + (this.elementsToSave - errorAmount) + ' załączników. Nie udało się zapisać następujących załączników: ' + this.valueUtils.formatStringArrayToView(this.failedList) + '. ';
            }
        } else {
            errorType = ErrorType.SUCCESS;
            text = this.infoString + 'A załączniki? Zapisano ' + (this.elementsToSave - errorAmount) + ' załączników.';
        }
        return { type: errorType, text: text };
    }

    private setAttachmentUploadInfoText() {
        this.text = this.infoString + 'Trwa dodawanie załączników (zapisano ' + this.savedElements + ' z ' + this.elementsToSave + '). ';
        if (this.succesList.length > 0) {
            this.text += '\nZapisane załączniki: ' + this.valueUtils.formatStringArrayToView(this.succesList) + '. ';
        }
        if (this.failedList.length > 0) {
            this.text += '\nWystąpiły problemy z dodaniem załączników:' + this.valueUtils.formatStringArrayToView(this.failedList) + '. ';
        }
    }
}
