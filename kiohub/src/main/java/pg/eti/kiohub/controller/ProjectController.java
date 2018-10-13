/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pg.eti.kiohub.entity.enums.Visibility;
import pg.eti.kiohub.entity.model.*;
import pg.eti.kiohub.utils.ExceptionHandlingUtils;

import java.util.*;
/**
 *
 * @author Aleksander Kania <kania>
 */
@Controller
@RequestMapping(path = "/project")
public class ProjectController extends MainController {
    
    @CrossOrigin
    @GetMapping(path = "/all")
    public ResponseEntity<List<Project>>
    getAllProjects() {
        return new ResponseEntity<>( projectRepository.findAll(), HttpStatus.OK);
    }

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
    
    @CrossOrigin
    @PostMapping(path = "/update")
    public ResponseEntity updateProject(@RequestBody Project project){
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
    
    @CrossOrigin
    @PostMapping(path = "/post-multipart", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity examplePostMultipart(@RequestParam("File") MultipartFile project){
        
    return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @CrossOrigin
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

    @CrossOrigin
    @PostMapping(path = "/publish/{id}")
    public ResponseEntity publishProject(@PathVariable("id") Long id){
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
