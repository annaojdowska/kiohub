/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.Tag;
import pg.eti.kiohub.entity.repository.ProjectRepository;
import pg.eti.kiohub.entity.search.QueryDescription;
import pg.eti.kiohub.entity.search.ScoredQueryDescription;
import pg.eti.kiohub.entity.search.SearchResult;

/**
 *
 * @author Anna
 */
@Service
public class SearchService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    private final static double SUPERVISOR_RATE = 0.18;
    private final static double TAG_RATE = 0.18;
    private final static double TITLE_RATE = 0.12;
    private final static double DESCRIPTION_RATE = 0.08;
    private final static double LICENCE_RATE = 0.06;
    private final static double PROJECT_TYPE_RATE = 0.12;
    private final static double PUBLICATION_DATE_RATE = 0.11;
    private final static double SEMESTERS_RATE = 0.15;
    
    public List<SearchResult> findMatchingProjects(QueryDescription query) {
        List<SearchResult> results = scoreProjects(query);
        
        return results;
    } 
    
    private List<SearchResult> scoreProjects(QueryDescription query){
        ScoredQueryDescription scoredDescription = new ScoredQueryDescription(calculateAttributesImportance(query.getSupervisors()),
            calculateAttributesImportance(query.getTags()), calculateAttributesImportance(query.getTitles()), calculateAttributesImportance(query.getDescriptions()),
            calculateAttributesImportance(query.getLicencesIds()), calculateAttributesImportance(query.getProjectTypesIds()), 
            calculateAttributesImportance(query.getSemestersIds()));
        
        List<SearchResult> results = new ArrayList<>();
        List<Project> projects = projectRepository.findAll();
        
        projects.forEach((project) -> results.add(scoreProject(project, scoredDescription, query)));
        //.filter(result -> result.getScore() > 0.1)
        return results.stream().sorted().collect(Collectors.toList());
    }

    private SearchResult scoreProject(Project project, ScoredQueryDescription scoredDescription, QueryDescription query) {
        double totalScore = 0;
        List<String> tagNames = project.getTags().stream().map(tag -> tag.getName()).collect(Collectors.toList());
        for(Map.Entry<String, Double> entry : scoredDescription.getTags().entrySet()) 
            if(tagNames.contains(entry.getKey()))
                totalScore += entry.getValue() * TAG_RATE;
        
        for(Map.Entry<String,Double> entry : scoredDescription.getDescriptions().entrySet())
            if(project.getDescription().contains(entry.getKey()))
                totalScore += entry.getValue() * DESCRIPTION_RATE;
        
        for(Map.Entry<String,Double> entry : scoredDescription.getTitles().entrySet())
            if(project.getTitle().contains(entry.getKey()))
                totalScore += entry.getValue() * TITLE_RATE;
        
        for(Map.Entry<Long,Double> entry : scoredDescription.getLicencesIds().entrySet())
            if(project.getLicence().getId() == entry.getKey())
                totalScore += entry.getValue() * LICENCE_RATE;
        
        for(Map.Entry<Long,Double> entry : scoredDescription.getProjectTypesIds().entrySet())
            if(project.getProjectType().getId() == entry.getKey())
                totalScore += entry.getValue() * PROJECT_TYPE_RATE;
        
        List<Long> semestersIds = project.getSemesters().stream().map(semester -> semester.getId()).collect(Collectors.toList());
        for(Map.Entry<Long,Double> entry : scoredDescription.getSemestersIds().entrySet())
            if(semestersIds.contains(entry.getKey()))
                totalScore += entry.getValue() * SEMESTERS_RATE;
        if(query.getDateFrom() != null && query.getDateTo() != null){
            if(project.getPublicationDate().after(query.getDateFrom()) 
                    && project.getPublicationDate().before(query.getDateTo()))
                totalScore += PUBLICATION_DATE_RATE;
        }
        else if(query.getDateFrom() != null){
            if(project.getPublicationDate().after(query.getDateFrom()))
                totalScore += PUBLICATION_DATE_RATE;
        }
        else if(query.getDateTo() != null) {
            if(project.getPublicationDate().before(query.getDateTo()))
                totalScore += PUBLICATION_DATE_RATE;
        }
        
        return new SearchResult(project, totalScore);
    }
    
    public static <T> HashMap<T, Double> calculateAttributesImportance(List<T> attributes) {
        HashMap<T, Double> scoredAttrs = new HashMap<>();
        int seriesSum = sumSeries(attributes.size());
        for(int i=0;i< attributes.size();i++) {
            double score = (attributes.size() - (1 - i))/seriesSum;
            scoredAttrs.put(attributes.get(i), score);
        }
        return scoredAttrs;
    }
    
    private static int sumSeries(int length){
        int sum = 0;
        for(int i=0;i<length;i++)
            sum += i+1;
        return sum;
    }
}

