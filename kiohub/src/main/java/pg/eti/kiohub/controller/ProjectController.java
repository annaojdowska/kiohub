/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;


import lombok.extern.jbosslog.JBossLog;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pg.eti.kiohub.entity.enums.Visibility;
import pg.eti.kiohub.entity.model.*;
import pg.eti.kiohub.utils.ExceptionHandlingUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

/**
 *
 * @author Aleksander Kania <kania>
 */
@JBossLog
@CrossOrigin
@Controller
@RequestMapping(path = "/project")
public class ProjectController extends MainController {

    @GetMapping(path = "/published")
    public ResponseEntity<List<Project>> getAllPublishedProjects(HttpServletRequest http){
        List<Project> publishedProjects = projectService.getAllPublishedProjects();
        return new ResponseEntity<>(publishedProjects, HttpStatus.OK);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<Optional<Project>> getProjectById(@PathVariable("id") Long id) {
        Optional<Project> p = projectRepository.findById(id);
        return new ResponseEntity<>(p, HttpStatus.OK);
    }

    @PreAuthorize("@securityService.isLoggedAndSupervisor(#request)")
    @GetMapping(path = "/checkTitleUniqueness")
    public ResponseEntity checkTitleUniqueness(
            @RequestParam("titlePl") String titlePl, HttpServletRequest request) {
        Long rowsMatchingTitle = projectRepository.checkIfUniqueTitle(titlePl);

        if (rowsMatchingTitle > 0) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @PreAuthorize("@securityService.isLoggedAndSupervisor(#request)")
    @PostMapping(path = "/add")
    public ResponseEntity<Project> addProject(
            @RequestParam("titlePl") String titlePl,
            @RequestParam("collaborators") String emailsArray,
            HttpServletRequest request) {
        try {
            Project project = new Project();
            project.setTitle(titlePl);
            project.setPublicationDate(new Date());
            project.setPublished(Boolean.FALSE);
            project = projectRepository.saveAndFlush(project);

            List<String> emails = Arrays.asList(emailsArray.split(", "));
            List<User> users = userService.createNewUsersAndGetAllByEmails(emails);
            collaboratorsService.createAndSaveCollaborators(project, users);

            return new ResponseEntity<>(project, HttpStatus.CREATED);
        } catch(Exception e) {
            e.printStackTrace();
            return ExceptionHandlingUtils.handleException(e);
        }
    }

    @PreAuthorize("@securityService.isCollaborator(#request, #project.getId())")
    @PostMapping(path = "/update")
    public ResponseEntity updateProject(@RequestBody Project project, HttpServletRequest http){
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

    @PreAuthorize("@securityService.isCollaborator(#request, #id)")
    @PostMapping(path = "/set-related/{id}")
    public ResponseEntity setRelatedProjects(@PathVariable("id") Long id, @RequestBody List<Project> projects,
                                             HttpServletRequest request){
        this.projectRepository.deleteAllRelatedProjects(id);
        for (Project pr : projects) {
            this.projectRepository.addRelatedProjects(id, pr.getId());
            this.projectRepository.addRelatedProjects(pr.getId(), id);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @PreAuthorize("@securityService.isCollaboratorAndSupervisor(#request, #id)")
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity delete(@PathVariable("id") Long id, HttpServletRequest request) {
        Optional<Project> projectToDelete = this.projectRepository.findById(id);
        if (projectToDelete.isPresent()) {
            projectToDelete.get().getAttachments().forEach((att) -> {
                this.attachmentFileRepository.deleteById(att.getId());
            });	
            this.collaboratorsRepository.deleteAllCollaborators(id);
            this.userPinnedProjectRepository.deleteAllPinnedProject(id);
            this.projectRepository.deleteAllRelatedProjects(id);
            this.projectRepository.delete(projectToDelete.get());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PreAuthorize("@securityService.isCollaboratorAndSupervisor(#request, #id)")
    @PostMapping(path = "/publish/{id}")
    public ResponseEntity publishProject(@PathVariable("id") Long id, HttpServletRequest http){
        Optional<Project> projectToPublish = this.projectRepository.findById(id);
        if (projectToPublish.isPresent()) {
            Project project = projectToPublish.get();
            project.setPublished(true);
            project.setProjectStatus(this.projectStatusRepository.findProjectStatusByName("Zakończony"));
            this.projectRepository.save(project);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

    }

    @GetMapping(path = "/relatedTo/{id}")
    public ResponseEntity<List<Project>> getRelatedProjectsById(@PathVariable("id") Long id) {
        Optional<Project> p = projectRepository.findById(id);
        if(p.isPresent()) {
            List<Project> relatedProjects = p.get().getRelatedToProjects();
            return new ResponseEntity<>(relatedProjects, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
