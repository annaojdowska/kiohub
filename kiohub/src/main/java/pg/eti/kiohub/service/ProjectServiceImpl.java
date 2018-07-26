/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.repository.ProjectRepository;

/**
 *
 * @author Aleksander Kania <kania>
 */
@Service
public class ProjectServiceImpl implements ProjectService {
    private ProjectRepository projectRepository;
    
    @Autowired
    public void setProjectRepository(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }
}
