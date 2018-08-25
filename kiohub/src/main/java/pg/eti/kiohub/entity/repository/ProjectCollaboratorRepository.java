/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.ProjectCollaborator;
import pg.eti.kiohub.entity.model.User;

/**
 *
 * @author Aleksander Kania
 */
@Repository
public interface ProjectCollaboratorRepository extends JpaRepository<ProjectCollaborator, Long>{
    @Query("SELECT u FROM ProjectCollaborator pc LEFT JOIN User u ON u.id = pc.userId WHERE pc.projectId = :id AND pc.isSupervisor = false")
    List<User> getCollaborators(@Param("id") Long id);
    
    @Query("SELECT u FROM ProjectCollaborator pc LEFT JOIN User u ON u.id = pc.userId WHERE pc.projectId = :id AND pc.isSupervisor = true")
    User getSupervisor(@Param("id") Long id);
}
