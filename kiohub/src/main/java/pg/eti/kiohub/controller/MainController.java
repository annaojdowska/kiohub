
package pg.eti.kiohub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.stereotype.Controller;
import pg.eti.kiohub.entity.repository.*;
import pg.eti.kiohub.security.SecurityService;
import pg.eti.kiohub.service.AttachmentService;
import pg.eti.kiohub.service.CollaboratorsService;
import pg.eti.kiohub.service.LoginService;
import pg.eti.kiohub.service.MailService;
import pg.eti.kiohub.service.ProjectService;
import pg.eti.kiohub.service.SearchService;
import pg.eti.kiohub.service.SemesterService;
import pg.eti.kiohub.service.TagService;
import pg.eti.kiohub.service.UserService;

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
    protected UserPinnedProjectRepository userPinnedProjectRepository;

    @Autowired
    protected AttachmentRepository attachmentRepository;

    @Autowired
    protected AttachmentFileRepository attachmentFileRepository;

    @Autowired
    protected UserEmailRepository userEmailRepository;

    @Autowired
    protected NoteRepository noteRepository;

    @Autowired
    protected ProjectService projectService;

    @Autowired
    protected TagService tagService;

    @Autowired
    protected MailService mailService;

    @Autowired
    protected UserService userService;

    @Autowired
    protected CollaboratorsService collaboratorsService;

    @Autowired
    protected SemesterService semesterService;

    @Autowired
    LoginService loginService;

    @Autowired
    SearchService searchService;

    @Autowired
    protected SecurityService securityService;
    
    @Autowired
    AttachmentService attachmentService;


//    @Configuration
//    @EnableGlobalMethodSecurity(prePostEnabled = true)
//    @Order()
//    protected static class SecurityConfiguration extends WebSecurityConfigurerAdapter {
//        @Override
//        protected void configure(HttpSecurity http) throws Exception {
//            http
//                .httpBasic()
//                .and()
//                .authorizeRequests()
//                    .antMatchers("/project/**").permitAll()
//                .anyRequest().permitAll()
//                    .and().csrf().disable();
//        }
//    }

}
