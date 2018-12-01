
package pg.eti.kiohub.controller;


import java.io.IOException;
import lombok.extern.jbosslog.JBossLog;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pg.eti.kiohub.entity.enums.Visibility;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.Semester;
import pg.eti.kiohub.entity.model.Tag;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.utils.ExceptionHandlingUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import pg.eti.kiohub.entity.model.Attachment;

@JBossLog
@CrossOrigin
@Controller
@RequestMapping(path = "/project")
public class ProjectController extends MainController {

    @GetMapping(path = "/published")
    @PostAuthorize("@visibilityService.checkVisibilityOfProjects(returnObject, #request)")
    public ResponseEntity<List<Project>> getAllPublishedProjects(HttpServletRequest request) {
        List<Project> publishedProjects = projectService.getAllPublishedProjects();
        return new ResponseEntity<>(publishedProjects, HttpStatus.OK);
    }

    @GetMapping(path = "/{id}")
    @PostAuthorize("@visibilityService.checkVisibilityOfSingleProject(returnObject, #request)")
    public ResponseEntity<Optional<Project>> getProjectById(@PathVariable("id") Long id,
                                                            HttpServletRequest request) {
        Optional<Project> p = projectRepository.findById(id);
        return new ResponseEntity<>(p, HttpStatus.OK);
    }

    @GetMapping(path = "/checkTitleUniqueness")
    @PreAuthorize("@securityService.isLoggedAndSupervisor(#request)")
    public ResponseEntity checkTitleUniqueness(
            @RequestParam("titlePl") String titlePl, HttpServletRequest request) {
        Long rowsMatchingTitle = projectRepository.checkIfUniqueTitle(titlePl);

        if (rowsMatchingTitle > 0) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @PostMapping(path = "/add")
    @PreAuthorize("@securityService.isLoggedAndSupervisor(#request)")
    public ResponseEntity<Project> addProject(
            @RequestParam("titlePl") String titlePl,
            @RequestParam("collaborators") String emailsArray,
            HttpServletRequest request) {
        try {
            Project project = new Project();
            project.setTitle(titlePl);
            project.setPublished(Boolean.FALSE);
            project.setProjectStatus(projectStatusRepository.findProjectStatusByName("W trakcie"));
            project = projectRepository.saveAndFlush(project);

            List<String> emails = Arrays.asList(emailsArray.split(", "));
            List<User> users = userService.createNewUsersAndGetAllByEmails(emails);
            collaboratorsService.createAndSaveCollaborators(project, users);

            User supervisor = loginService.getLoggedUser(request);
            collaboratorsService.createAndSaveCollaborator(project, supervisor, Boolean.TRUE, Visibility.EVERYONE);

            return new ResponseEntity<>(project, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ExceptionHandlingUtils.handleException(e);
        }
    }

    @PostMapping(path = "/update")
    @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    public ResponseEntity updateProject(
            @RequestBody Project project,
            @RequestParam("projectId") Long projectId,
            HttpServletRequest request) {
        try {
            List<Tag> tags = tagService.addTags(project.getTags());
            project.setTags(tags);
            List<Semester> semesters = semesterService.findSemestersId(project.getSemesters());
            project.setSemesters(semesters);
            super.projectRepository.saveAndFlush(project);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "/set-related/{id}")
    @PreAuthorize("@securityService.isCollaborator(#request, #id)")
    public ResponseEntity setRelatedProjects(@PathVariable("id") Long id,
                                             @RequestBody List<Project> projects,
                                             HttpServletRequest request) {
        this.projectRepository.deleteAllRelatedProjects(id);
        for (Project pr : projects) {
            this.projectRepository.addRelatedProjects(id, pr.getId());
            this.projectRepository.addRelatedProjects(pr.getId(), id);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @DeleteMapping(value = "/delete/{id}")
    @PreAuthorize("@securityService.isCollaboratorAndSupervisor(#request, #id)")
    public ResponseEntity delete(@PathVariable("id") Long id, HttpServletRequest request) {
        Optional<Project> projectToDelete = this.projectRepository.findById(id);
        if (projectToDelete.isPresent()) {
            for (Attachment attachment : projectToDelete.get().getAttachments()) {
                try {
                    this.attachmentService.remove(attachment);
                } catch (IOException ex) {
                    Logger.getLogger(ProjectController.class.getName()).log(Level.SEVERE, null, ex);
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
                
            };
            this.collaboratorsRepository.deleteAllCollaborators(id);
            this.userPinnedProjectRepository.deleteAllPinnedProject(id);
            this.projectRepository.deleteAllRelatedProjects(id);
            this.projectRepository.delete(projectToDelete.get());
            return new ResponseEntity<>(HttpStatus.OK);
        } else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping(path = "/publish/{id}")
    @PreAuthorize("@securityService.isCollaboratorAndSupervisor(#request, #id)")
    public ResponseEntity publishProject(@PathVariable("id") Long id, HttpServletRequest request) {
        return projectService.setProjectPublished(id, true) ? new ResponseEntity<>(HttpStatus.OK) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping(path = "/unpublish/{id}")
    @PreAuthorize("@securityService.isCollaboratorAndSupervisor(#request, #id)")
    public ResponseEntity unpublishProject(@PathVariable("id") Long id, HttpServletRequest request) {
        return projectService.setProjectPublished(id, false) ? new ResponseEntity<>(HttpStatus.OK) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping(path = "/relatedTo/{id}")
    @PostAuthorize("@visibilityService.checkVisibilityOfProjects(returnObject, #request)")
    public ResponseEntity<List<Project>> getRelatedProjectsById(@PathVariable("id") Long id,
                                                                HttpServletRequest request) {
        Optional<Project> p = projectRepository.findById(id);
        if (p.isPresent()) {
            List<Project> relatedProjects = p.get().getRelatedToProjects();
            return new ResponseEntity<>(relatedProjects, HttpStatus.OK);
        } else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
