/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.repository;

import org.springframework.data.repository.CrudRepository;
import pg.eti.kiohub.entity.Project;

/**
 *
 * @author Aleksander Kania <kania>
 */
public interface ProjectRepository extends CrudRepository<Project, Long>{
        
}
