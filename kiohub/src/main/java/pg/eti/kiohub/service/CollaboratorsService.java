package pg.eti.kiohub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.enums.Visibility;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.ProjectCollaborator;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.entity.repository.ProjectCollaboratorRepository;

import java.util.List;

@Service
public class CollaboratorsService {

    @Autowired
    ProjectCollaboratorRepository projectCollaboratorRepository;

    public void createAndSaveCollaborators(Project project, List<User> users) {
        for (User user : users) {
            createAndSaveCollaborator(project, user, Boolean.FALSE, Visibility.EVERYONE);
        }
    }
    
        public void createAndSaveCollaborator(Project project, User user, Boolean isSupervisor, Visibility userDataVisible) {
            ProjectCollaborator collaborator = new ProjectCollaborator();
            collaborator.setUserId(user.getId());
            collaborator.setProjectId(project.getId());
            collaborator.setIsSupervisor(isSupervisor);
            collaborator.setUserDataVisible(userDataVisible);
            projectCollaboratorRepository.saveAndFlush(collaborator);
    }

    public boolean isProjectCollaborator(long userId, long projectId){
        List<Long> collaboratorsIds = projectCollaboratorRepository.getListOfProjectCollaboratorsIds(projectId);
        return collaboratorsIds.contains(userId);
    }

    public boolean isSupervisorOfProject(long userId, long projectId){
        User supervisor = projectCollaboratorRepository.getSupervisor(projectId);
        if(supervisor == null) return false;

        return supervisor.getId() == userId;
    }

    public Visibility getCollaboratorVisibility(Long projectId, Long userId){
        return projectCollaboratorRepository.getCollaboratorVisibility(projectId, userId);
    }

    public boolean isCollaboratorAlreadyAdded(Long projectId, String email) {
        List<Object[]> collaborators = projectCollaboratorRepository.getCollaborators(projectId);
        for(Object[] collaboratorData : collaborators)
            if(collaboratorData[3].equals(email)) return true;

        return false;
    }
}
