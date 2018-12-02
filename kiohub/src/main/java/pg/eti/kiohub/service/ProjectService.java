
package pg.eti.kiohub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.repository.ProjectRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllMatchingProjects(String phrase) {
        if (phrase.isEmpty()) return new ArrayList<Project>();
        return projectRepository.findAll().stream().filter(project -> project.getTitle().toLowerCase().contains(phrase.toLowerCase())).collect(Collectors.toList());
    }

    public List<Project> getAllPublishedProjects() {
        return projectRepository.findAll()
                .stream()
                .filter(project -> project.getPublished())
                .collect(Collectors.toList());
    }

    public boolean isProjectPublished(Long projectId) {
        return projectRepository.findById(projectId).get().getPublished();
    }

    public boolean setProjectPublished(Long id, boolean publishProject) {
        Optional<Project> projectToPublish = this.projectRepository.findById(id);
        if (projectToPublish.isPresent()) {
            Project project = projectToPublish.get();
            project.setPublished(publishProject);
            if (publishProject) {
                project.setPublicationDate(new Date());
            }
            this.projectRepository.save(project);
            return true;
        } else {
            return false;
        }
    }
}
