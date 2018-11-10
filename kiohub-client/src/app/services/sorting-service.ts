import { Injectable } from '../../../node_modules/@angular/core';
import { Project } from '../model/project.interface';

@Injectable()
export class SortingService {
  alphabeticallyAZ = 'Alfabetycznie od A do Z';
  alphabeticallyZA = 'Alfabetycznie od Z do A';
  by_publication_date_descending = 'Od najnowszych';
  by_publication_date_ascending = 'Od najstarszych';
  by_relevancy = 'Najtrafniejsze';
  constructor() { }

  sortAlphabeticallyAZ(a: string, b: string): number {
    if (a > b) {
      return 1;
    } else if (a === b) {
      return 0;
    }
    return -1;
  }

  sortAlphabeticallyZA(a: string, b: string): number {
    if (a > b) {
      return -1;
    } else if (a === b) {
      return 0;
    }
    return 1;
  }

  sortByDateDescending(a: Date, b: Date): number {
    if (a > b) {
      return -1;
    } else if (a === b) {
      return 0;
    }
    return 1;
  }

  sortByDateAscending(a: Date, b: Date): number {
    if (a > b) {
      return 1;
    } else if (a === b) {
      return 0;
    }
    return -1;
  }

  sortByScore(a: number, b: number): number {
    if (a === b) {
        return 0;
      } else if (a > b) {
        return -1;
      }
      return 1;
  }

  sortByPinned(a: boolean, b: boolean): number {
    if (a === b) {
        return 0;
      } else if (a) {
        return -1;
      }
      return 1;
  }
}
