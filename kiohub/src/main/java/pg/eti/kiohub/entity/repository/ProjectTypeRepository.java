/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.repository;

import org.springframework.data.repository.CrudRepository;
import pg.eti.kiohub.entity.model.ProjectType;
import org.springframework.stereotype.Repository;
/**
 *
 * @author Aleksander Kania <kania>
 */
@Repository
public interface ProjectTypeRepository extends CrudRepository<ProjectType, Long> {
    
}
