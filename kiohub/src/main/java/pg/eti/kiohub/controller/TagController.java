/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.Tag;

/**
 *
 * @author Kasia
 */
@Controller
@RequestMapping(path = "/tag")
public class TagController extends MainController {
    @GetMapping(path = "/all")
    public ResponseEntity<Iterable<Tag>> getAllTags() {
        return new ResponseEntity<>(tagRepository.findAll(), HttpStatus.OK);
    }
}