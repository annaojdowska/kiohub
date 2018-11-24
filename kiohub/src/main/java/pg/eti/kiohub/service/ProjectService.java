
package pg.eti.kiohub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.repository.ProjectRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Anna
 */
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
}
