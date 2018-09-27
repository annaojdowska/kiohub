import { ErrorInfoComponent } from './error-info.component';
import { SemesterChooserComponent } from '../semester-chooser/semester-chooser.component';


export class Validation {
    readonly MAX_SIZE_DESCRIPTION_PL = 2000;
    readonly MAX_SIZE_DESCRIPTION_EN = 2000;
    readonly MAX_SIZE_TAG = 30;
    readonly MAX_SIZE_SUPERVISOR = 50;
    readonly MAX_SIZE_TITLE = 255;
    readonly MAX_SIZE_EMAIL = 30;

    readonly errorStringSupervisor = 'Podane dane promotora muszą być krótsze niż ' + this.MAX_SIZE_SUPERVISOR + 'znaków.';
    readonly errorStringTag = 'Tag nie może zawierać znaków innych niż litery i cyfry. Maksymalna długość to ' + this.MAX_SIZE_TAG + ' znaków.';
    readonly errorStringStatus = 'Wybierz status projektu.';
    readonly errorStringType = 'Wybierz typ projektu.';
    readonly errorStringTitlePl = 'Podaj tytuł. Powinien mieć maksymalnie ' + this.MAX_SIZE_TITLE + ' znaków.';
    readonly errorStringTitleEn = 'Tytuł powinien mieć maksymalnie ' + this.MAX_SIZE_TITLE + ' znaków.';
    readonly errorStringDescriptionPl = 'Opis powinien mieć maksymalnie ' + this.MAX_SIZE_DESCRIPTION_PL + ' znaków.';
    readonly errorStringDescriptionEn = 'Opis powinien mieć maksymalnie' + this.MAX_SIZE_DESCRIPTION_EN + ' znaków.';
    readonly errorStringEmail = 'Podaj poprawny adres email. Powinien mieć maksymalnie ' + this.MAX_SIZE_EMAIL + ' znaków.';
    // readonly errorStringTag = '';
    // readonly errorStringTag = '';
    // readonly errorStringTag = '';
    // readonly errorStringTag = '';


    // ******** REGEX PATTERNS ********
    // creates pattern string allowing to write any character <from,to> times
    getString(from, to) {
        return '^.{' + from + ',' + to + '}';
    }

    getTitlePattern() {
        return this.getString(0, this.MAX_SIZE_TITLE);
    }

    getStudentEmailPattern() {
        // TODO
        return ''; // ^\w+(-+.\w+)*@\w+(-.\w+)*\.\w+(-.\w+)*$';
    }

    isLetterOrNumberPattern() {
        return '^[a-zA-Z0-9ęóąśżźćńł]*$';
    }

    // validates element and displays error if invalid
    validateElementAndHandleError(element: ErrorInfoComponent, validationOk: boolean) {
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
        return this.validateInputWithPattern(tagsListComponent) && this.validateMaxSize(tagsListComponent.nativeElement.value, this.MAX_SIZE_TAG);
    }

    validateStudentEmail(emailInput) {
        console.log(emailInput);
        // const regexp = new RegExp(this.getStudentEmailPattern());
        return this.validateMandatoryInputWithPattern(emailInput); // && regexp.test(emailInput.nativeElement.value);
    }

    // ******** COMPONENT TYPE VALIDATION ********

    validateInputWithPattern(element) {
        return element.nativeElement.validity.valid;
    }

    validateMandatoryInputWithPattern(element) {
        return element.nativeElement.validity.valid && !this.isNullOrEmpty(element.nativeElement.value);
    }

    validateTextArea(element, maxSize: number) {
        return this.validateMaxSize(element.nativeElement.value, maxSize);
    }

    validateSelectNotNull(element) {
        return this.isNullOrEmpty(element.value) ? false : true;
    }

    validateSemesterChooserElement(element: SemesterChooserComponent) {
        return !this.isNullOrUndefined(element) && element.semesters.length > 0;
    }

    // ******** VALUE VALIDATION ********
    validateMaxSize(stringValue, maxSize) {
        return stringValue.length < maxSize;
    }

    isNullOrEmpty(value: string) {
        if (this.isNullOrUndefined(value) || value.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    isNullOrUndefined(value) {
        return value === undefined || value === null;
    }
}
