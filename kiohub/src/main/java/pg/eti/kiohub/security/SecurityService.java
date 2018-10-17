package pg.eti.kiohub.security;

import lombok.extern.jbosslog.JBossLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import pg.eti.kiohub.controller.LoginController;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.service.CollaboratorsService;
import pg.eti.kiohub.service.LoginService;

import javax.servlet.http.HttpServletRequest;

@JBossLog
@Component("securityService")
public class SecurityService {
    @Autowired
    LoginService loginService;
    @Autowired
    CollaboratorsService collaboratorsService;

    public boolean isLogged(HttpServletRequest request) {
        return loginService.isUserLogged(request);
    }

    public boolean isLoggedAndSupervisor(HttpServletRequest request){
        User user = loginService.getLoggedUser(request);
        if(user == null)
            return false;

        return user.getIsSupervisor();
    }

    public boolean isCollaborator(HttpServletRequest request, long projectId){
        User user = loginService.getLoggedUser(request);
        if(user == null)
            return false;

        return collaboratorsService.isProjectCollaborator(user.getId(), projectId);
    }

    public boolean isCollaboratorAndSupervisor(HttpServletRequest request, long projectId){
        User user = loginService.getLoggedUser(request);
        if(user == null)
            return false;

        return collaboratorsService.isSupervisorOfProject(user.getId(), projectId);
    }

//    public boolean isAuthor(HttpServletRequest request, long noteId){
//
//    }
}
