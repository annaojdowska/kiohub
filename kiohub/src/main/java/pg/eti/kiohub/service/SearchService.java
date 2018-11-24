
package pg.eti.kiohub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.entity.repository.ProjectCollaboratorRepository;
import pg.eti.kiohub.entity.search.QueryDescription;
import pg.eti.kiohub.entity.search.ScoredQueryDescription;
import pg.eti.kiohub.entity.search.SearchResult;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author Anna
 */
@Service
public class SearchService {

    @Autowired
    private ProjectService projectService;
    @Autowired
    private ProjectCollaboratorRepository collaboratorRepository;

    private final static double SUPERVISOR_RATE = 18;
    private final static double TAG_RATE = 18;
    private final static double TITLE_RATE = 12;
    private final static double DESCRIPTION_RATE = 8;
    private final static double LICENCE_RATE = 6;
    private final static double PROJECT_TYPE_RATE = 12;
    private final static double PUBLICATION_DATE_RATE = 11;
    private final static double SEMESTERS_RATE = 15;

    public List<SearchResult> findMatchingProjects(QueryDescription query) {
        return scoreProjects(query);
    }

    private List<SearchResult> scoreProjects(QueryDescription query) {
        List<Project> projects = projectService.getAllPublishedProjects();
        if (query.isEmpty()) {
            return projects.stream().map((project) -> new SearchResult(project, 0)).collect(Collectors.toList());
        }

        ScoredQueryDescription scoredDescription = new ScoredQueryDescription(
                calculateAttributesImportance(query.getSupervisors()),
                calculateAttributesImportance(query.getTags()),
                calculateAttributesImportance(query.getTitles()),
                calculateAttributesImportance(query.getDescriptions()),
                calculateAttributesImportance(query.getLicencesIds()),
                calculateAttributesImportance(query.getProjectTypesIds()),
                calculateAttributesImportance(query.getSemestersIds()));

        List<SearchResult> results = new ArrayList<>();
        projects.forEach((project) -> results.add(scoreProject(project, scoredDescription, query)));
        return results.stream().filter(result -> result.getScore() > 0).collect(Collectors.toList());
    }

    private SearchResult scoreProject(Project project, ScoredQueryDescription scoredDescription, QueryDescription query) {
        double totalScore = 0;
        User supervisor = collaboratorRepository.getSupervisor(project.getId());
        if (supervisor != null) {
            for (Map.Entry<String, Double> entry : scoredDescription.getSupervisors().entrySet())
                if (supervisor.getFirstName().toLowerCase().contains(entry.getKey().toLowerCase())
                        || supervisor.getLastName().toLowerCase().contains(entry.getKey().toLowerCase()))
                    totalScore += entry.getValue() * SUPERVISOR_RATE;
        }
        if (project.getTags() != null) {
            List<String> tagNames = project.getTags().stream().map(tag -> tag.getName().toLowerCase()).collect(Collectors.toList());
            for (Map.Entry<String, Double> entry : scoredDescription.getTags().entrySet())
                if (tagNames.contains(entry.getKey().toLowerCase()))
                    totalScore += entry.getValue() * TAG_RATE;
        }
        if (project.getDescription() != null) {
            for (Map.Entry<String, Double> entry : scoredDescription.getDescriptions().entrySet())
                if (project.getDescription().toLowerCase().contains(entry.getKey().toLowerCase()))
                    totalScore += entry.getValue() * DESCRIPTION_RATE;
        }

        if (project.getTitle() != null) {
            for (Map.Entry<String, Double> entry : scoredDescription.getTitles().entrySet())
                if (project.getTitle().toLowerCase().contains(entry.getKey().toLowerCase()))
                    totalScore += entry.getValue() * TITLE_RATE;
        }

        if (project.getLicence() != null) {
            for (Map.Entry<Long, Double> entry : scoredDescription.getLicencesIds().entrySet())
                if (project.getLicence().getId() == entry.getKey())
                    totalScore += entry.getValue() * LICENCE_RATE;
        }

        if (project.getProjectType() != null) {
            for (Map.Entry<Long, Double> entry : scoredDescription.getProjectTypesIds().entrySet())
                if (project.getProjectType() != null && project.getProjectType().getId() == entry.getKey())
                    totalScore += entry.getValue() * PROJECT_TYPE_RATE;
        }

        if (project.getSemesters() != null) {
            List<Long> semestersIds = project.getSemesters().stream().map(semester -> semester.getId()).collect(Collectors.toList());
            for (Map.Entry<Long, Double> entry : scoredDescription.getSemestersIds().entrySet())
                if (semestersIds.contains(entry.getKey()))
                    totalScore += entry.getValue() * SEMESTERS_RATE;
        }

        if (query.getDateFrom() != null && query.getDateTo() != null) {
            if (project.getPublicationDate().after(query.getDateFrom()) && project.getPublicationDate().before(query.getDateTo()))
                totalScore += PUBLICATION_DATE_RATE;
        } else if (query.getDateFrom() != null) {
            if (project.getPublicationDate().after(query.getDateFrom()))
                totalScore += PUBLICATION_DATE_RATE;
        } else if (query.getDateTo() != null) {
            if (project.getPublicationDate().before(query.getDateTo()))
                totalScore += PUBLICATION_DATE_RATE;
        }

        return new SearchResult(project, totalScore);
    }

    public static <T> HashMap<T, Double> calculateAttributesImportance(List<T> attributes) {
        HashMap<T, Double> scoredAttrs = new HashMap<>();
        if (attributes.size() == 1) {
            scoredAttrs.put(attributes.get(0), 1.0);
            return scoredAttrs;
        }

        double seriesSum = sumSeries(attributes.size());
        for (int i = 0; i < attributes.size(); i++) {
            double score = (attributes.size() - (1 - i)) / seriesSum;
            scoredAttrs.put(attributes.get(i), score);
        }

        return scoredAttrs;
    }

    private static int sumSeries(int length) {
        int sum = 0;
        for (int i = 0; i < length; i++)
            sum += i + 1;

        return sum;
    }
}
