import { Injectable } from '../../../node_modules/@angular/core';

@Injectable()
export class SortingService {

  constructor() { }

  sortAlphabetically(a: string, b: string): number {
    if (a > b) {
      return 1;
    } else if (a === b) {
      return 0;
    }
    return -1;
  }

  sortByDate(a: Date, b: Date): number {
    if (a > b) {
      return -1;
    } else if (a === b) {
      return 0;
    }
    return 1;
  }

  sortByScore(a: number, b: number): number {
    if (a === b) {
        return 0;
      } else if (a > b) {
        return -1;
      }
      return 1;
  }
}
