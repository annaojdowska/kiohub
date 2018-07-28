import { TestBed, inject } from '@angular/core/testing';

import { EmailInvitationService } from './email-invitation.service';

describe('EmailInvitationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailInvitationService]
    });
  });

  it('should be created', inject([EmailInvitationService], (service: EmailInvitationService) => {
    expect(service).toBeTruthy();
  }));
});
