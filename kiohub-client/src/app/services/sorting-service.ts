import { Injectable } from '../../../node_modules/@angular/core';

@Injectable()
export class SortingService {
  alphabetical = 'Alfabetycznie';
  by_publication_date_descending = 'Od najnowszych';
  by_publication_date_ascending = 'Od najstarszych';
  by_relevancy = 'Najtrafniejsze';
  constructor() { }

  sortAlphabetically(a: string, b: string): number {
    if (a > b) {
      return 1;
    } else if (a === b) {
      return 0;
    }
    return -1;
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
}
