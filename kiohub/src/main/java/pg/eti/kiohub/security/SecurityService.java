package pg.eti.kiohub.security;

import lombok.extern.jbosslog.JBossLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import pg.eti.kiohub.controller.LoginController;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.service.LoginService;

import javax.servlet.http.HttpServletRequest;

@JBossLog
@Component("securityService")
public class SecurityService {
    @Autowired
    LoginService loginService;

    public boolean isSupervisor(Long personId) {
        return false;
    }

    public boolean isSupervisorOrStudent(Long personId) {
        return false;
    }

    public boolean isCollaborator(HttpServletRequest http) {
        // na razie tylko sprawdza, czy zautoryzowany
//        if (SecurityContextHolder.getContext().getAuthentication().isAuthenticated()) {
            dbg("TO WSPÓLPRACOWNIK!");
           // return true;
       // }
        dbg("TO NIE WSPÓLPRACOWNIK!");
        return false;
    }

    public boolean isNoteAuthor(Long personId, Long noteId) {
        return false;
    }

    public boolean isSupervisorOfThisProject(Long personId, Long projectId) {
        return false;
    }


    private void dbg(String tekst) {
        log.info("-------########---------------------------------------------------");
        log.info("-------########---------------------------------------------------");
        log.info("-------########---------" + tekst + "------------------------------");
        log.info("-------########---------" + tekst + "------------------------------");
        log.info("-------########---------" + tekst + "------------------------------");
        log.info("-------########---------------------------------------------------");
        log.info("-------########---------------------------------------------------");
    }

    public boolean hasPermission(HttpServletRequest http) {
        log.info(loginService.isUserLogged(http));
        log.info(http);
        if (loginService.isUserLogged(http)) {
            dbg("JEST BODY!");
            return false;
        }
        dbg("NIE MA BODY!");
        return false;
    }
}
