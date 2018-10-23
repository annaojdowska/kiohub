import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { EditProjectGeneralTabComponent } from '../../edit-project-general-tab/edit-project-general-tab.component';
import { ErrorType } from '../../error-info/error-type.enum';
import { ValueUtils } from 'src/app/utils/value-utils';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  @Input() private text: string;
  private editProjectComponent: EditProjectGeneralTabComponent;
  private succesList: string[] = [];
  private failedList: string[] = [];
  private valueUtils = new ValueUtils();
  // how many attachments to upload
  private attachmentsToSave: number;
  // how many attachments had been already uploaded
  private savedAttachments: number;
  private display = 'none';
  private infoString = '';

  constructor() {
  }

  ngOnInit() { }

  beginUpload(attachmentsToSave: number, editProjectComponent: EditProjectGeneralTabComponent, infoString: string) {
    this.savedAttachments = 0;
    this.attachmentsToSave = attachmentsToSave;
    this.editProjectComponent = editProjectComponent;
    this.succesList = [];
    this.failedList = [];
    this.infoString = infoString;
    this.setDisplay(true);
    this.setAttachmentUploadInfoText();
  }

  addSuccess(successedFileName: string) {
    this.succesList.push(successedFileName);
    this.savedAttachments++;
    this.updateSpinner();
  }

  addFail(failedFileName: string) {
    this.failedList.push(failedFileName);
    this.savedAttachments++;
    this.updateSpinner();
  }

  updateSpinner() {
    if (this.attachmentsToSave === this.savedAttachments) {
      this.setAttachmentUploadInfoText();
      this.setAttachmentUploadCompleted();
    } else {
      this.setAttachmentUploadInfoText();
    }
  }

  private setAttachmentUploadCompleted() {
    const data = this.getDataToView();
    this.editProjectComponent.updateCompleted(data.text, data.type);
  }

  private getDataToView() {
    const errorAmount = this.failedList.length;
    let text: string;
    let errorType: ErrorType;

    if (errorAmount > 0) {
      if (errorAmount === this.attachmentsToSave) {
        errorType = ErrorType.ERROR;
        text = this.infoString + 'A załączniki? Nie udało się zapisać żadnego z załączników. ';
      } else {
        errorType = ErrorType.WARNING;
        // tslint:disable-next-line:max-line-length
        text = this.infoString + 'A załączniki? Zapisano ' + (this.attachmentsToSave - errorAmount) + ' załączników. Nie udało się zapisać następujących załączników: ' + this.valueUtils.formatStringArrayToView(this.failedList) + '. ';
      }
    } else {
      errorType = ErrorType.SUCCESS;
      text = this.infoString + 'A załączniki? Zapisano ' + (this.attachmentsToSave - errorAmount) + ' załączników.';
    }
    return { type: errorType, text: text };
  }

  private setAttachmentUploadInfoText() {
    this.text = this.infoString + 'Trwa dodawanie załączników (zapisano ' + this.savedAttachments + ' z ' + this.attachmentsToSave + '). ';
    if (this.succesList.length > 0) {
      this.text += '\nZapisane załączniki: ' +  this.valueUtils.formatStringArrayToView(this.succesList) + '. ';
    }
    if (this.failedList.length > 0) {
      this.text += '\nWystąpiły problemy z dodaniem załączników:' +  this.valueUtils.formatStringArrayToView(this.failedList) + '. ';
    }
  }
  setText(text: string) {
    this.text = text;
  }

  setDisplay(isVisible: boolean) {
    if (isVisible) {
      this.display = 'block';
    } else {
      this.display = 'none';
    }
  }
}
