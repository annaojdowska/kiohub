import { TestBed, async, inject } from '@angular/core/testing';

import { PublishedGuard } from './published.guard';

describe('PublishedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublishedGuard]
    });
  });

  it('should ...', inject([PublishedGuard], (guard: PublishedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
