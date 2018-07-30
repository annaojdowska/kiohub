/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.Semester;

/**
 *
 * @author Aleksander Kania <kania>
 */
@Controller
@RequestMapping(path = "/project")
public class ProjectController extends MainController {

    @GetMapping(path = "/all")
    public ResponseEntity<Iterable<Project>>
            getAllProjects() {

        return new ResponseEntity<>(projectRepository.findAll(), HttpStatus.OK);

    }
            
    @GetMapping(path = "/semesters/all")
    public ResponseEntity<Iterable<Semester>> getAllSemesters() {
        return new ResponseEntity<>(semesterRepository.findAll(), HttpStatus.OK);
    }
}
