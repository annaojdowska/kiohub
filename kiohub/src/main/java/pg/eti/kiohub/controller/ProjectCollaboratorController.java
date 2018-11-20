/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pg.eti.kiohub.entity.enums.Visibility;
import pg.eti.kiohub.entity.model.Attachment;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.ProjectCollaborator;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.entity.model.UserEmail;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "/collaborator")
public class ProjectCollaboratorController extends MainController {
    
    @GetMapping(path = "/project/{id}")
    @PostAuthorize("@visibilityService.checkCollaboratorsVisibilityByEmail(returnObject, #id, #request)")
    public ResponseEntity<Iterable<UserEmail>> getProjectCollaboratorsByProjectId(@PathVariable("id") Long id,
                                                                                  HttpServletRequest request) {
        List<Object[]> pc = collaboratorsRepository.getCollaborators(id);
        List<UserEmail> usersemails = new ArrayList<UserEmail>();
        for (Object[] r : pc) {
            User user = new User();
            user.setId(Long.parseLong(r[0].toString()));
            if(r[1] != null) {
                user.setFirstName(r[1].toString());
                user.setLastName(r[2].toString());
            } else
            {
                user.setFirstName("");
                user.setLastName("");
            }
            UserEmail useremail = new UserEmail();
            useremail.setUser(user);
            useremail.setEmail(r[3].toString());
            useremail.setId(Long.parseLong(r[0].toString()));
            usersemails.add(useremail);
            System.out.println(useremail.getEmail());
        }
        return new ResponseEntity<>(usersemails, HttpStatus.OK);
    }    
    
    @GetMapping(path = "/supervisor/project/{id}")
    @PostAuthorize("@visibilityService.checkUserAsCollaboratorVisibility(returnObject, #id, #request)")
    public ResponseEntity<User> getProjectSupervisorByProjectId(@PathVariable("id") Long id,
                                                                HttpServletRequest request) {
        return new ResponseEntity<>(collaboratorsRepository.getSupervisor(id), HttpStatus.OK);
    }  
    
    @GetMapping(path = "data/project/{id}")
    @PostAuthorize("@visibilityService.checkCollaboratorsVisibility(returnObject, #id, #request)")
    public ResponseEntity<Iterable<ProjectCollaborator>> getProjectCollaboratorsDataByProjectId(@PathVariable("id") Long id,
                                                                                                HttpServletRequest request) {
        return new ResponseEntity<>(collaboratorsRepository.getCollaboratorsData(id), HttpStatus.OK);
    }    
    
    @GetMapping(path = "data/supervisor/project/{id}")
    @PostAuthorize("@visibilityService.checkSingleCollaboratorVisibility(returnObject, #id, #request)")
    public ResponseEntity<ProjectCollaborator> getProjectSupervisorDataByProjectId(@PathVariable("id") Long id,
                                                                                   HttpServletRequest request) {
        return new ResponseEntity<>(collaboratorsRepository.getSupervisorData(id), HttpStatus.OK);
    }  
    
    @PostMapping(path = "/updateVisibility")
    @PreAuthorize("@securityService.isMyself(#request, #userId)")
    public ResponseEntity updateMetadata (
            @RequestParam("projectId") String projectId,
            @RequestParam("userId") String userId,
            @RequestParam("visibility") String visibility,
            HttpServletRequest request) {
        System.out.println("Aktualizuję ");
        List<ProjectCollaborator> projectCollaborators = collaboratorsRepository.getCollaboratorsData(Long.parseLong(projectId));
        projectCollaborators.add(collaboratorsRepository.getSupervisorData(Long.parseLong(projectId)));
        ProjectCollaborator projectCollaborator = projectCollaborators
                .stream()
                .filter(pc -> pc.getProjectId() == Long.parseLong(projectId) && pc.getUserId()== Long.parseLong(userId))
                .findFirst()
                .get();
        projectCollaborator.setUserDataVisible(Visibility.valueOf(visibility));
        collaboratorsRepository.save(projectCollaborator);
        return new ResponseEntity(HttpStatus.OK);
    }
    
    @GetMapping(path = "/project/byCollaborator/{id}")
    @PreAuthorize("@securityService.isMyself(#request, #id)")
    public ResponseEntity getProjectsByCollaboratorId(@PathVariable("id") Long id,
                                                      HttpServletRequest request){
        return new ResponseEntity<>(collaboratorsRepository.getListOfCollaboratorsProjects(id), HttpStatus.OK);
    }
    
    @PostMapping(path = "/add")
    public ResponseEntity addCollaborator (
            @RequestParam("email") String email,
            @RequestParam("visibility") String visibility,
            @RequestParam("projectId") Long projectId) {

        User user = userService.createNewUsersAndGetAllByEmails(Arrays.asList(email)).get(0);
        Project project = projectRepository.getOne(projectId);

        if (project != null && !collaboratorsService.isCollaboratorAlreadyAdded(projectId, email)) {
            collaboratorsService.createAndSaveCollaborator(project, user, false, Visibility.valueOf(visibility));
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    
    @PostMapping(path = "/remove")
    public ResponseEntity removeCollaborator (
            @RequestParam("collaboratorId") String collaboratorId,
            @RequestParam("projectId") String projectId) {
        try {
            collaboratorsRepository.deleteCollaborator(Long.parseLong(projectId), Long.parseLong(collaboratorId));
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
        
    @GetMapping(path = "loggedis/{projectid}")
    public ResponseEntity<Boolean> loggedIsCollaborator(@PathVariable("projectid") Long projectid, HttpServletRequest request) {
        User user = loginService.getLoggedUser(request);
        if (user != null) {
            ProjectCollaborator collaborator = null;
            try {
                collaborator = collaboratorsRepository.getCollaborator(projectid, user.getId());
                if (collaborator != null) {
                    return new ResponseEntity<>(true, HttpStatus.OK);
                }
            }
            catch (Exception e) {
                return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(false, HttpStatus.OK);
    }  
}
