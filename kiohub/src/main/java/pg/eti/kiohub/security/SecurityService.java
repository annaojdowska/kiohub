package pg.eti.kiohub.security;

import lombok.extern.jbosslog.JBossLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pg.eti.kiohub.entity.model.Note;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.entity.repository.AttachmentRepository;
import pg.eti.kiohub.entity.repository.NoteRepository;
import pg.eti.kiohub.entity.repository.UserRepository;
import pg.eti.kiohub.service.CollaboratorsService;
import pg.eti.kiohub.service.LoginService;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@JBossLog
@Component("securityService")
public class SecurityService {
    @Autowired
    protected LoginService loginService;
    @Autowired
    protected CollaboratorsService collaboratorsService;
    @Autowired
    protected AttachmentRepository attachmentRepository;
    @Autowired
    protected NoteRepository noteRepository;
    @Autowired
    protected UserRepository userRepository;

    public boolean isLogged(HttpServletRequest request) {
return true;
        //return loginService.isUserLogged(request);
    }

    public boolean isLoggedAndSupervisor(HttpServletRequest request) {
        return true;
    }

    public boolean isCollaborator(HttpServletRequest request, long projectId) {
        return true;
    }

    public boolean isCollaboratorAndSupervisor(HttpServletRequest request, long projectId) {
        return true;
    }

    public boolean isMyself(HttpServletRequest request, Long userId) {
        return true;
    }

    public boolean hasPermissionToNote(HttpServletRequest request, Long noteId) {
       return true;
    }

    protected boolean isPermittedToNote(Note note, User loggedUser) {
        return true;
    }
}
