/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;


import lombok.extern.jbosslog.JBossLog;
import org.hibernate.tool.schema.internal.exec.GenerationTargetToDatabase;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
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

    @GetMapping(path = "/all")
    //@PreAuthorize("@securityService.hasPermission(#http)")
    public ResponseEntity<List<Project>> getAllProjects(HttpServletRequest  http) {
        return new ResponseEntity<>( projectRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping(path = "/published")
    public ResponseEntity<List<Project>> getAllPublishedProjects(HttpServletRequest http){
        List<Project> publishedProjects = projectRepository.findAll()
                .stream().filter(project -> project.getPublished()).collect(Collectors.toList());
        return new ResponseEntity<>(publishedProjects, HttpStatus.OK);
    }

    //@PreAuthorize("@securityService.isCollaborator(#http)")
    @GetMapping(path = "/{id}")
    public ResponseEntity<Optional<Project>> getProjectById(@PathVariable("id") Long id) {
        Optional<Project> p = projectRepository.findById(id);
        return new ResponseEntity<>(p, HttpStatus.OK);
    }    
    
    @GetMapping(path = "/checkTitleUniqueness")
    public ResponseEntity checkTitleuniqueness(
            @RequestParam("titlePl") String titlePl) {
        Long rowsMatchingTitle = projectRepository.checkIfUniqueTitle(titlePl);

        if (rowsMatchingTitle > 0) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @PostMapping(path = "/add")
    public ResponseEntity<Project> addProject(
            @RequestParam("titlePl") String titlePl,
            @RequestParam("collaborators") String emailsArray) {
        try {
            Project project = new Project();
            project.setTitle(titlePl);
            project.setPublicationDate(new Date());
            project.setPublished(Boolean.FALSE);
            project = projectRepository.saveAndFlush(project);

            List<String> emails = Arrays.asList(emailsArray.split(", "));
            List<User> users = createNewUsersAndGetAllByEmails(emails);
            createAndSaveCollaborators(project, users);

            return new ResponseEntity<>(project, HttpStatus.CREATED);
        } catch(Exception e) {
            e.printStackTrace();
            return ExceptionHandlingUtils.handleException(e);
        }
    }

    private void createAndSaveCollaborators(Project project, List<User> users) {
        for (User user : users) {
            ProjectCollaborator collaborator = new ProjectCollaborator();
            collaborator.setUserId(user.getId());
            collaborator.setProjectId(project.getId());
            collaborator.setIsSupervisor(Boolean.FALSE);
            collaborator.setUserDataVisible(Visibility.EVERYONE);
            collaboratorsRepository.saveAndFlush(collaborator);
        }
    }

    private User createNewUserUsingEmail(String email) {
        User user = new User();
        user.setIsSupervisor(true);
        // FIXME #2
        user = userRepository.saveAndFlush(user);

        UserEmail userEmail = new UserEmail(email, user);
        userEmailRepository.save(userEmail);
        return user;
    }

    private List<User> createNewUsersAndGetAllByEmails(List<String> emails) {
        List<User> users = new ArrayList<>();
        for (String email : emails) {
            User user = null;
            if (userRepository.checkIfUserExistsByEmail(email) > 0) {
                user = userRepository.findUserByEmail(email);
            } else {
                user = createNewUserUsingEmail(email);
            }
            users.add(user);
        }
        return users;
    }
    
    @GetMapping(path = "/quick-search")
    public ResponseEntity<Iterable<Project>> getMatchingProjects(@RequestParam("phrase") String phrase) {
       return new ResponseEntity<>(projectService.getAllMatchingProjects(phrase), HttpStatus.OK);
    }

    @PreAuthorize("@securityService.isCollaborator(#http)")
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

    @PostMapping(path = "/post-multipart", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity examplePostMultipart(@RequestParam("File") MultipartFile project){
        
    return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity delete(@PathVariable("id") Long id) {
        Optional<Project> projectToDelete = this.projectRepository.findById(id);
        if (projectToDelete.isPresent()) {
            projectToDelete.get().getAttachments().forEach((att) -> {
                this.attachmentFileRepository.deleteById(att.getId());
            });	
            this.collaboratorsRepository.deleteAllCollaborators(id);
            this.userPinnedProjectRepository.deleteAllPinnedProject(id);
            this.projectRepository.delete(projectToDelete.get());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PreAuthorize("@securityService.isCollaborator(#http)")
    @RequestMapping(path = "/publish/{id}", method = RequestMethod.POST)
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


}
