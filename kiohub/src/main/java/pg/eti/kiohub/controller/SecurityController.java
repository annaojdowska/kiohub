
package pg.eti.kiohub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "/security")
public class SecurityController extends MainController {

    @PostMapping(path = "/isProjectPublishedOrUserIsCollaborator")
    public ResponseEntity<Boolean> isProjectPublishedOrUserIsCollaborator(
            @RequestParam("projectId") String projectId,
            HttpServletRequest request) {

        Long _projectId = Long.parseLong(projectId);

        boolean collaborator = securityService.isCollaborator(request, _projectId);
        boolean collaboratorAndSupervisor = securityService.isCollaboratorAndSupervisor(request, _projectId);
        boolean projectPublished = projectService.isProjectPublished(_projectId);

        if (projectPublished || collaborator || collaboratorAndSupervisor) {
            return new ResponseEntity<>(true, HttpStatus.OK);
        }
        return new ResponseEntity<>(false, HttpStatus.OK);
    }
}
