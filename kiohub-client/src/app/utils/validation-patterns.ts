import { ErrorInfoComponent } from '../error-info/error-info.component';
import { SemesterChooserComponent } from '../semester-chooser/semester-chooser.component';
import { FileUtils } from './file-utils';
import { AttachmentType } from '../model/attachment-type.enum';
import { isNullOrUndefined } from 'util';
import { InputListComponent } from '../input-list/input-list.component';
import { ValueUtils } from './value-utils';


export class Validation {
    fileUtils = new FileUtils();
    valueUtils = new ValueUtils();

    readonly MAX_SIZE_DESCRIPTION_PL = 2000;
    readonly MAX_SIZE_DESCRIPTION_EN = 2000;
    readonly MAX_SIZE_TAG = 30;
    readonly MAX_SIZE_SUPERVISOR = 50;
    readonly MAX_SIZE_TITLE = 255;
    readonly MAX_SIZE_EMAIL = 30;

    readonly MAX_FILENAME_LENGTH = 255;
    readonly MAX_FILE_SIZE = 1000000000; // in bytes

    readonly WRONG_EXTENSION = 'Niepoprawny typ pliku lub plik jest zbyt duży (maksymalny rozmiar to ' + this.getMaxFileSizeInMegaBytes() + '). '
        + 'Podaj plik z jednym z poniższych rozszerzeń: ';

    readonly errorStringSupervisor = 'Podane dane promotora muszą być krótsze niż ' + this.MAX_SIZE_SUPERVISOR + ' znaków.';
    readonly errorStringTag = 'Tag nie może zawierać znaków innych niż litery i cyfry. Maksymalna długość to ' + this.MAX_SIZE_TAG + ' znaków.';
    readonly errorStringStatus = 'Wybierz status projektu.';
    readonly errorStringType = 'Wybierz typ projektu.';
    readonly errorStringTitlePl = 'Podaj tytuł. Powinien mieć maksymalnie ' + this.MAX_SIZE_TITLE + ' znaków.';
    readonly errorStringTitleEn = 'Tytuł powinien mieć maksymalnie ' + this.MAX_SIZE_TITLE + ' znaków.';
    readonly errorStringDescriptionPl = 'Opis powinien mieć maksymalnie ' + this.MAX_SIZE_DESCRIPTION_PL + ' znaków.';
    readonly errorStringDescriptionEn = 'Opis powinien mieć maksymalnie' + this.MAX_SIZE_DESCRIPTION_EN + ' znaków.';
    readonly errorStringEmail = 'Podaj poprawny adres email. Akceptowanymi identyfikatorami są: s<nr_albumu>@student.pg.edu.pl.';
    readonly errorStringEmails = 'Podaj co najmniej jednego autora projektu.';
    readonly errorStringDatesOrder = 'Data publikacji w serwisie "od" powinna być starsza od daty "do".';
    readonly errorStringSendingInvitations = 'Wysłanie zaproszeń do studentów nie powiodło się.';
    // attachment
    readonly errorStringThesis = this.WRONG_EXTENSION + this.fileUtils.getThesisExtensions() + '.';
    readonly errorStringSourceCode = this.WRONG_EXTENSION + this.fileUtils.getSourceCodeExtensions() + '.';
    readonly errorStringImage = this.WRONG_EXTENSION + this.fileUtils.getImageExtensions() + '.';
    readonly errorStringManual = this.WRONG_EXTENSION + this.fileUtils.getManualExtensions() + '.';
    readonly errorStringManualStartup = this.WRONG_EXTENSION + this.fileUtils.getManualStartupExtensions() + '.';
    readonly errorStringOther = this.WRONG_EXTENSION + this.fileUtils.getOtherFileExtensions() + '.';

    // ******** ATTACHMENT VALIDATION ********
    validateAttachment(attachmentType: AttachmentType, event) {
        const file = event.target.files[0];
        if (!isNullOrUndefined(file.name) && !isNullOrUndefined(file.size) && !isNullOrUndefined(file.type)) {
            const name = file.name;
            const size = file.size;
            const type = file.type;

            let validationOk = true;
            validationOk = this.validateAttachmentsType(attachmentType, type) && validationOk;
            validationOk = this.validateAttachmentsNameAndSize(name, size) && validationOk;
            return validationOk;
        } else {
            return false;
        }
    }

    private validateAttachmentsType(attachmentType: AttachmentType, fileType: string) {
        switch (attachmentType) {
            case AttachmentType.THESIS: {
                return this.fileUtils.isThesisType(fileType);
            }
            case AttachmentType.SOURCE_CODE: {
                return this.fileUtils.isSourceCodeType(fileType);
            }
            case AttachmentType.PHOTO: {
                return this.fileUtils.isImageType(fileType);
            }
            case AttachmentType.OTHER: {
                return this.fileUtils.isOtherFileType(fileType);
            }
            case AttachmentType.MANUAL_USAGE: {
                return this.fileUtils.isManualType(fileType);
            }
            case AttachmentType.MANUAL_STARTUP: {
                return this.fileUtils.isManualStartupType(fileType);
            }
            default: {
                return false;
            }
        }
    }

    private validateAttachmentsNameAndSize(name, size) {
        let validationOk = true;
        validationOk = (name.length <= this.MAX_FILENAME_LENGTH);
        validationOk = (size <= this.MAX_FILE_SIZE) && validationOk;
        return validationOk;
    }

    getMaxFileSizeInMegaBytes() {
        return 1000 + ' MB';
    }

    // ******** REGEX PATTERNS ********
    // creates pattern string allowing to write any character <from,to> times
    getString(from, to) {
        return '^.{' + from + ',' + to + '}';
    }

    getDescriptionPattern() {
        return this.getString(0, this.MAX_SIZE_DESCRIPTION_PL);
    }

    getTitlePattern() {
        return this.getString(0, this.MAX_SIZE_TITLE);
    }

    getSupervisorPattern() {
        return this.getString(0, this.MAX_SIZE_SUPERVISOR);
    }

    getStudentEmailPattern() {
        return this.getString(1, this.MAX_SIZE_EMAIL);
    }

    isLetterOrNumberPattern() {
        return '^[a-zA-Z0-9ęóąśżźćńł]*$';
    }

    // validates element and displays error if invalid
    validate(element: ErrorInfoComponent, validationOk: boolean) {
        element.setDisplay(!validationOk);
        return validationOk;
    }

    // ******** COMPONENT VALIDATION ********

    validateTitlePl(titlePlInput) {
        return this.validateMandatoryInputWithPattern(titlePlInput);
    }

    validateTitleEn(titleEnInput) {
        return this.validateInputWithPattern(titleEnInput);
    }

    validateDescriptionPl(descriptionPlTextArea) {
        return this.validateTextArea(descriptionPlTextArea, this.MAX_SIZE_DESCRIPTION_PL);
    }

    validateDescriptionEn(descriptionEnTextArea) {
        return this.validateTextArea(descriptionEnTextArea, this.MAX_SIZE_DESCRIPTION_EN);
    }

    validateProjectType(projectTypeSelect) {
        return this.validateSelectNotNull(projectTypeSelect);
    }

    validateProjectStatus(projectStatusSelect) {
        return this.validateSelectNotNull(projectStatusSelect);
    }

    validateSemesterChooser(semesterChooser) {
        return this.validateSemesterChooserElement(semesterChooser);
    }

    validateInputTag(tagsListComponent) {
        return this.validateInputWithPattern(tagsListComponent) && this.valueUtils.validateMaxSize(tagsListComponent.nativeElement.value, this.MAX_SIZE_TAG);
    }

    validateStudentEmail(emailInput) {
        return this.validateMandatoryInputWithPattern(emailInput);
    }

    validateStudentPGEmail(emailInput) {
        return emailInput.nativeElement.value.toString().match(/^[s]\d{4,8}@student\.pg\.edu\.pl$/);
    }

    validateListOfStudentsEmails(list: InputListComponent) {
        return list.elements.length > 0;
    }

    // ******** COMPONENT TYPE VALIDATION ********
    validateInputWithPattern(element) {
        return element.nativeElement.validity.valid;
    }

    validateMandatoryInputWithPattern(element) {
        return element.nativeElement.validity.valid && !this.valueUtils.isNullOrEmpty(element.nativeElement.value);
    }

    validateTextArea(element, maxSize: number) {
        return this.valueUtils.validateMaxSize(element.nativeElement.value, maxSize);
    }

    validateSelectNotNull(element) {
        return this.valueUtils.isNullOrEmpty(element.value) ? false : true;
    }

    validateSemesterChooserElement(element: SemesterChooserComponent) {
        return !this.valueUtils.isNullOrUndefined(element) && element.semesters.length > 0;
    }

    validateDatesOrderNotNull(olderDate: Date, newerDate: Date) {
        if (this.valueUtils.isNullOrUndefined(olderDate) || this.valueUtils.isNullOrUndefined(newerDate)) {
            return false;
        } else {
            return olderDate < newerDate;
        }
    }

    validateDatesOrder(olderDate: Date, newerDate: Date) {
        if (this.valueUtils.isNullOrUndefined(olderDate) || this.valueUtils.isNullOrUndefined(newerDate)) {
            return true;
        } else {
            return olderDate < newerDate;
        }
    }
}
