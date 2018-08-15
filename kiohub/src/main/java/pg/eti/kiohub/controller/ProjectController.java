/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.Semester;
import pg.eti.kiohub.entity.model.Tag;

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
}
