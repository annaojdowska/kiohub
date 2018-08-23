/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import pg.eti.kiohub.entity.model.*;
import pg.eti.kiohub.service.ProjectService;

/**
 *
 * @author Aleksander Kania <kania>
 */
@Controller
@RequestMapping(path = "/project")
public class ProjectController extends MainController {

    @Autowired
    private ProjectService projectService;

    @GetMapping(path = "/all")
    public ResponseEntity<List<Project>>
    getAllProjects() {
        return new ResponseEntity<>( projectRepository.findAll(), HttpStatus.OK);
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
        Project project = new Project();
        project.setTitle(titlePl);
        project.setPublicationDate(new Date());
        project.setPublished(Boolean.FALSE);
        project = projectRepository.saveAndFlush(project);

        List<String> emails = Arrays.asList(emailsArray.split(", "));
        List<User> users = createNewUsersAndGetAllByEmails(emails);
        createAndSaveCollaborators(project, users);

        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    private void createAndSaveCollaborators(Project project, List<User> users) {
        for (User user : users) {
            ProjectCollaborator collaborator = new ProjectCollaborator();
            collaborator.setUserId(user.getId());
            collaborator.setProjectId(project.getId());
            collaborator.setIsSupervisor(Boolean.FALSE);
            collaboratorsRepository.saveAndFlush(collaborator);
        }
    }

    private User createNewUserUsingEmail(String email) {
        User user = new User();
        user.setEmail(email);
        user = userRepository.saveAndFlush(user);
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
    
    public static Map<String, String> getQueryMap(String query)
    {
        String[] params = query.split("&");
        Map<String, String> map = new HashMap<String, String>();
        for (String param : params)
            map.put(param.split("=")[0], param.split("=")[1]);
        return map;
    }
    
    @RequestMapping(value = "/addTag" , method = RequestMethod.POST)
    public ResponseEntity<HttpStatus> addTag(@RequestBody String params) {
        Map<String, String> parameters = getQueryMap(params);
        Set<String> keys = parameters.keySet();
        for (String key : keys)
            tagRepository.save(new Tag(parameters.get(key)));
        
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @GetMapping(path = "/licences/all")
    public ResponseEntity<Iterable<Licence>> getAllLicences() {
        return new ResponseEntity<>(licenceRepository.findAll(), HttpStatus.OK);
    }
    
    @GetMapping(path = "/types/all")
    public ResponseEntity<Iterable<ProjectType>> getAllProjectTypes() {
        return new ResponseEntity<>(projectTypeRepository.findAll(), HttpStatus.OK);
    }
    
    @GetMapping(path = "/statuses/all")
    public ResponseEntity<Iterable<ProjectStatus>> getAllProjectStatuses() {
        return new ResponseEntity<>(projectStatusRepository.findAll(), HttpStatus.OK);
    }
    
    @GetMapping(path = "/quick-search")
    public ResponseEntity<Iterable<Project>> getMatchingProjects(@RequestParam("phrase") String phrase) {
       return new ResponseEntity<>(projectService.getAllMatchingProjects(phrase), HttpStatus.OK);
    }
    
    @CrossOrigin
    @PostMapping(path = "/post")
    public ResponseEntity examplePost(@RequestBody Project project){
        
    return new ResponseEntity<>(project, HttpStatus.OK);
    }
    
    @CrossOrigin
    @PostMapping(path = "/post-multipart", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity examplePostMultipart(@RequestParam("File") MultipartFile project){
        
    return new ResponseEntity<>(HttpStatus.OK);
    }
}
