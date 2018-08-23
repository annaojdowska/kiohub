"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var email_invitation_service_1 = require("../email-invitation-service/email-invitation.service");
var project_service_1 = require("../services/project.service");
var AddProjectComponent = /** @class */ (function () {
    function AddProjectComponent(router, emailInvitationService, projectService) {
        this.router = router;
        this.emailInvitationService = emailInvitationService;
        this.projectService = projectService;
        this.semesters = [];
        this.projects = [];
    }
    AddProjectComponent.prototype.ngOnInit = function () {
    };
    AddProjectComponent.prototype.addAuthor = function (author) {
        this.authorInput.nativeElement.value = '';
        this.authorsList.add(author);
    };
    AddProjectComponent.prototype.recieveElements = function ($event) {
        this.recipients = $event;
    };
    AddProjectComponent.prototype.createProjectClick = function () {
        var title = this.titleInput.nativeElement.value;
        console.log(title);
        var httpStatus = this.projectService.getTitleUnique(title).subscribe(function (res) {
            console.log(res);
        }, function (err) {
            console.log('error');
        });
        console.log('stat' + httpStatus);
        // alert('Tytuł: ' + title + '\n' + 'Odbiorcy: ' + this.recipients);
        // let projectTitle: string = data.title;
        // this.projectService.getAllProjects().subscribe(result => this.projects = result);
        // this.projects.forEach(element => {
        //   console.log(element.title);
        // });
        // console.log(this.projectService.getAllProjects());
        // console.log(this.projects);
        // this.emailInvitationService.send(title, this.recipients)
        // .subscribe(
        //   (response: any) => {
        //     this.router.navigateByUrl('edit-project');
        //   },
        //   error => {
        //     this.router.navigateByUrl('edit-project');
        //   }
        // )
    };
    __decorate([
        core_1.ViewChild('authorsList'),
        __metadata("design:type", Object)
    ], AddProjectComponent.prototype, "authorsList", void 0);
    __decorate([
        core_1.ViewChild('authorInput'),
        __metadata("design:type", Object)
    ], AddProjectComponent.prototype, "authorInput", void 0);
    __decorate([
        core_1.ViewChild('titleInput'),
        __metadata("design:type", Object)
    ], AddProjectComponent.prototype, "titleInput", void 0);
    AddProjectComponent = __decorate([
        core_1.Component({
            selector: 'app-add-project',
            templateUrl: './add-project.component.html',
            styleUrls: ['./add-project.component.css']
        }),
        __param(0, core_1.Inject(router_1.Router)),
        __param(1, core_1.Inject(email_invitation_service_1.EmailInvitationService)),
        __param(2, core_1.Inject(project_service_1.ProjectService)),
        __metadata("design:paramtypes", [router_1.Router,
            email_invitation_service_1.EmailInvitationService,
            project_service_1.ProjectService])
    ], AddProjectComponent);
    return AddProjectComponent;
}());
exports.AddProjectComponent = AddProjectComponent;
//# sourceMappingURL=add-project.component.js.map