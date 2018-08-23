"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var email_invitation_service_1 = require("./email-invitation.service");
describe('EmailInvitationService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [email_invitation_service_1.EmailInvitationService]
        });
    });
    it('should be created', testing_1.inject([email_invitation_service_1.EmailInvitationService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=email-invitation.service.spec.js.map