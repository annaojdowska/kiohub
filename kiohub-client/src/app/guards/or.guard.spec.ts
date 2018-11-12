import { TestBed, async, inject } from '@angular/core/testing';

import { OrGuard } from './or.guard';

describe('OrGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrGuard]
    });
  });

  it('should ...', inject([OrGuard], (guard: OrGuard) => {
    expect(guard).toBeTruthy();
  }));
});
