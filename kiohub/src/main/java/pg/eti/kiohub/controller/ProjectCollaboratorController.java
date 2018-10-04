/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.entity.model.ProjectCollaborator;
import pg.eti.kiohub.entity.model.User;

/**
 *
 * @author Kasia
 */

@Controller
@RequestMapping(path = "/collaborator")
public class ProjectCollaboratorController extends MainController {
    
    @GetMapping(path = "/project/{id}")
    public ResponseEntity<Iterable<User>> getProjectCollaboratorsByProjectId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(collaboratorsRepository.getCollaborators(id), HttpStatus.OK);
    }    
    
    @GetMapping(path = "/supervisor/project/{id}")
    public ResponseEntity<User> getProjectSupervisorByProjectId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(collaboratorsRepository.getSupervisor(id), HttpStatus.OK);
    }  
    
//    @GetMapping(path = "data/project/{id}")
//    public ResponseEntity<Iterable<ProjectCollaborator>> getProjectCollaboratorsDataByProjectId(@PathVariable("id") Long id) {
//        return new ResponseEntity<>(collaboratorsRepository.getCollaboratorsData(id), HttpStatus.OK);
//    }    
//    
//    @GetMapping(path = "data/supervisor/project/{id}")
//    public ResponseEntity<ProjectCollaborator> getProjectSupervisorDataByProjectId(@PathVariable("id") Long id) {
//        return new ResponseEntity<>(collaboratorsRepository.getSupervisorData(id), HttpStatus.OK);
//    }  
}
