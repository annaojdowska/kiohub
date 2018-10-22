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
            ProjectCollaborator collaborator = new ProjectCollaborator();
            collaborator.setUserId(user.getId());
            collaborator.setProjectId(project.getId());
            collaborator.setIsSupervisor(Boolean.FALSE);
            collaborator.setUserDataVisible(Visibility.EVERYONE);
            projectCollaboratorRepository.saveAndFlush(collaborator);
        }
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
}
