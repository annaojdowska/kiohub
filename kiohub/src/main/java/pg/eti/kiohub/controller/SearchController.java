package pg.eti.kiohub.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.search.QueryDescription;

/**
 *
 * @author Anna
 */
@Controller
@RequestMapping(path = "/search")
public class SearchController extends MainController {
    
    @CrossOrigin
    @PostMapping(path = "/advanced")
    public ResponseEntity advancedSearch(@RequestBody QueryDescription query){
        QueryDescription another = query;
        List<Project> projects = projectRepository.findAll();
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }
}
