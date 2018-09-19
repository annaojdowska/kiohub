export class ValidationPatterns {
    getString(from, to) {
        return '^.{' + from + ',' + to + '}';
    }
}
