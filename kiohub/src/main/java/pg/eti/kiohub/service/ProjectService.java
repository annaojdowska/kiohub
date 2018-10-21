/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.entity.repository.ProjectRepository;

/**
 *
 * @author Anna
 */
@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    public List<Project> getAllMatchingProjects(String phrase){
        if(phrase.isEmpty()) return new ArrayList<Project>();
        return projectRepository.findAll().stream().filter(project -> project.getTitle().toLowerCase().contains(phrase.toLowerCase())).collect(Collectors.toList());
    }

    public List<Project> getAllPublishedProjects(){
        return projectRepository.findAll()
                .stream()
                .filter(project -> project.getPublished())
                .collect(Collectors.toList());
    }
}
