export class ValidationPatterns {
    getString(from, to) {
        return '^.{' + from + ',' + to + '}';
    }

    isNullOrEmpty(value: string) {
        if (value === undefined || value === null || value.length === 0) {
            return true;
        } else {
            return false;
        }
    }
}
