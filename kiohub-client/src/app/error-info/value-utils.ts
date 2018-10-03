
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
}
