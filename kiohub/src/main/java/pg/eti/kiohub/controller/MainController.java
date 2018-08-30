/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.entity.repository.*;
import pg.eti.kiohub.service.MailService;
import pg.eti.kiohub.service.ProjectService;
import pg.eti.kiohub.service.TagService;

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

    @Autowired
    protected ProjectCollaboratorRepository collaboratorsRepository;


    @Autowired
    protected AttachmentRepository attachmentRepository;
    
    @Autowired
    protected AttachmentFileRepository attachmentFileRepository;   
    
    
    @Autowired
    protected ProjectService projectService;
    
    @Autowired
    protected TagService tagService;
    
    @Autowired
    protected MailService mailService;

    
    
    @RequestMapping(path = "/")
    public String homePage() {
        return "index.html";
    }
}
