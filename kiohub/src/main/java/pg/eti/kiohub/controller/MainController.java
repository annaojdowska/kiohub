/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.entity.repository.LicenceRepository;
import pg.eti.kiohub.entity.repository.ProjectRepository;
import pg.eti.kiohub.entity.repository.ProjectStatusRepository;
import pg.eti.kiohub.entity.repository.ProjectTypeRepository;
import pg.eti.kiohub.entity.repository.SemesterRepository;
import pg.eti.kiohub.entity.repository.TagRepository;
import pg.eti.kiohub.entity.repository.UserRepository;

/**
 *
 * @author Aleksander Kania <kania>
 */
@Controller
public class MainController {

    @Autowired
    protected ProjectRepository projectRepository;

    @Autowired
    protected ProjectTypeRepository projectTypeRepository;

    @Autowired
    protected ProjectStatusRepository projectStatusRepository;
    
    @Autowired
    protected UserRepository userRepository;
    
    @Autowired
    protected SemesterRepository semesterRepository;
    
    @Autowired
    protected TagRepository tagRepository;
    
    @Autowired
    protected LicenceRepository licenceRepository;
    
    @RequestMapping(path = "/")
    public String homePage() {
        return "index.html";
    }
}
