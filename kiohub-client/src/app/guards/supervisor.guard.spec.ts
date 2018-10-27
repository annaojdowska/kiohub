import { TestBed, async, inject } from '@angular/core/testing';

import { SupervisorGuard } from './supervisor.guard';

describe('SupervisorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupervisorGuard]
    });
  });

  it('should ...', inject([SupervisorGuard], (guard: SupervisorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
