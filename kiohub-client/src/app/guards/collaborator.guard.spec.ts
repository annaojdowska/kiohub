import { TestBed, async, inject } from '@angular/core/testing';

import { CollaboratorGuard } from './collaborator.guard';

describe('CollaboratorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollaboratorGuard]
    });
  });

  it('should ...', inject([CollaboratorGuard], (guard: CollaboratorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
