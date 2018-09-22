import { ErrorInfoComponent } from './error-info.component';
import { SemesterChooserComponent } from '../semester-chooser/semester-chooser.component';

export class Validation {
    // creates pattern string allowing to write any character <from,to> times
    getString(from, to) {
        return '^.{' + from + ',' + to + '}';
    }

    isLetterOrNumberPattern() {
        return '^[a-zA-Z0-9ęóąśżźćńł]*$';
    }

    // validates element and displays error if invalid
    validateElementAndHandleError(element: ErrorInfoComponent, validationOk: boolean) {
        element.setDisplay(!validationOk);
        return validationOk;
    }

    // ******** validate components
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

    validateSemesterChooser(element: SemesterChooserComponent) {
        return !this.isNullOrUndefined(element) && element.semesters.length > 0;
    }

     // ******** validate values
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
