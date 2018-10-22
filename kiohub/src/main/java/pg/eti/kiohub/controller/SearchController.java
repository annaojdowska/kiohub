package pg.eti.kiohub.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pg.eti.kiohub.entity.search.QueryDescription;
import pg.eti.kiohub.entity.search.SearchResult;
import pg.eti.kiohub.service.SearchService;
import pg.eti.kiohub.entity.model.Project;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;

@Controller
@CrossOrigin
@RequestMapping(path = "/search")
public class SearchController extends MainController {

    @PostMapping(path = "/advanced")
    @PostAuthorize("@visibilityService.checkVisibilityOfSearchResults(returnObject, #request)")
    public ResponseEntity<List<SearchResult>> advancedSearch(@RequestBody QueryDescription query,
                                                             HttpServletRequest request){
        QueryDescription another = query;
        List<SearchResult> projects = searchService.findMatchingProjects(query);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }
}
