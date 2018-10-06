
export class ValueUtils {
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

    validateMaxSize(stringValue, maxSize) {
        return stringValue.length < maxSize;
    }

    findElementsToSaveInArray(array) {
        return array.elements.filter(e => (!e.id));
    }

    formatStringArrayToView(array: string[]) {
        let text = '\n';
        let i = 0;
        for (const s of array) {
            if (i++ !== array.length - 1) {
                text += s + ', ';
            } else {
                text += s;
            }
        }
        return text;
    }

    setDisplay(isVisible: boolean) {
        if (isVisible) {
           return 'block';
        } else {
           return 'none';
        }
    }
}
