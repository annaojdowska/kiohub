import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { EditProjectGeneralTabComponent } from '../../edit-project-general-tab/edit-project-general-tab.component';
import { ErrorType } from '../../error-info/error-type.enum';

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
  // how many attachments to upload
  private attachmentsToSave: number;
  // how many attachments had been already uploaded
  private savedAttachments: number;
  private display = 'none';

  constructor() {
  }

  ngOnInit() { }

  beginUpload(attachmentsToSave: number, editProjectComponent: EditProjectGeneralTabComponent) {
    this.savedAttachments = 0;
    this.attachmentsToSave = attachmentsToSave;
    this.editProjectComponent = editProjectComponent;
    this.succesList = [];
    this.failedList = [];
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
        text = 'Nie udało się zapisać żadnego z załączników.';
      } else {
        errorType = ErrorType.WARNING;
        text = 'Zapisano ' + (this.attachmentsToSave - errorAmount) + ' załączników. Nie udało się zapisać następujących załączników: ' + this.failedList.toString();
      }
    } else {
      errorType = ErrorType.SUCCESS;
      text = 'Zapisano ' + (this.attachmentsToSave - errorAmount) + ' załączników.';
    }
    return { type: errorType, text: text };
  }

  private setAttachmentUploadInfoText() {
    this.text = 'Trwa dodawanie załączników (zapisano ' + this.savedAttachments + ' z ' + this.attachmentsToSave + ')';
    if (this.succesList.length > 0) {
      this.text += 'Zapisane załączniki: ' + this.succesList.toString();
    }
    if (this.failedList.length > 0) {
      this.text += 'Wystąpiły problemy z dodaniem załączników:' + this.failedList.toString();
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
