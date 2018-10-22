package pg.eti.kiohub.security;

import lombok.extern.jbosslog.JBossLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import pg.eti.kiohub.entity.model.*;
import pg.eti.kiohub.entity.repository.AttachmentRepository;
import pg.eti.kiohub.entity.repository.NoteRepository;
import pg.eti.kiohub.entity.repository.UserRepository;
import pg.eti.kiohub.service.CollaboratorsService;
import pg.eti.kiohub.service.LoginService;

import javax.servlet.http.HttpServletRequest;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static pg.eti.kiohub.entity.enums.Visibility.*;

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

        return loginService.isUserLogged(request);
    }

    public boolean isLoggedAndSupervisor(HttpServletRequest request){
        User loggedUser = loginService.getLoggedUser(request);
        if(loggedUser == null)
            return false;

        return loggedUser.getIsSupervisor();
    }

    public boolean isCollaborator(HttpServletRequest request, long projectId){
        User loggedUser = loginService.getLoggedUser(request);
        if(loggedUser == null)
            return false;

        return collaboratorsService.isProjectCollaborator(loggedUser.getId(), projectId);
    }

    public boolean isCollaboratorAndSupervisor(HttpServletRequest request, long projectId){
        User loggedUser = loginService.getLoggedUser(request);
        if(loggedUser == null) return false;

        return collaboratorsService.isSupervisorOfProject(loggedUser.getId(), projectId);
    }

    public boolean isMyself(HttpServletRequest request, Long userId){
        User loggedUser = loginService.getLoggedUser(request);
        if(loggedUser == null) return false;

        return loggedUser.getId().equals(userId);
    }

    public boolean hasPermissionToNote(HttpServletRequest request, Long noteId){
        User loggedUser = loginService.getLoggedUser(request);
        if(loggedUser == null) return false;

        Optional<Note> noteOpt = noteRepository.findById(noteId);
        if(!noteOpt.isPresent()) return false;

        Note note = noteOpt.get();
        return isPermittedToNote(note, loggedUser);
    }

    protected boolean isPermittedToNote(Note note, User loggedUser) {
        if(note.getIsPrivate())
            return note.getOwnerId().equals(loggedUser.getId());

        return collaboratorsService.isProjectCollaborator(loggedUser.getId(), note.getProject().getId());
    }
}
