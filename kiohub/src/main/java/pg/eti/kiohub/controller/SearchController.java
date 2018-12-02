package pg.eti.kiohub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.entity.search.QueryDescription;
import pg.eti.kiohub.entity.search.SearchResult;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequestMapping(path = "/search")
public class SearchController extends MainController {

    @PostMapping(path = "/advanced")
    @PostAuthorize("@visibilityService.checkVisibilityOfSearchResults(returnObject, #request)")
    public ResponseEntity<List<SearchResult>> advancedSearch(@RequestBody QueryDescription query,
                                                             HttpServletRequest request){
        List<SearchResult> projects = searchService.findMatchingProjects(query);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }
}
