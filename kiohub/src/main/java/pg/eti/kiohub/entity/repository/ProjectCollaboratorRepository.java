/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.repository;

import java.util.List;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.ProjectCollaborator;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.entity.model.UserEmail;

/**
 *
 * @author Aleksander Kania
 */
@Repository
public interface ProjectCollaboratorRepository extends JpaRepository<ProjectCollaborator, Long>{
//    @Query("SELECT u FROM ProjectCollaborator pc " +
//            "LEFT JOIN User u ON u.id = pc.userId " +
//            "WHERE pc.projectId = :id AND pc.isSupervisor = false")
    @Query(value = "SELECT u.user_id, u.first_name, u.last_name, ue.email " +
            "FROM project_collaborators pc " +
            "LEFT JOIN users u ON u.user_id = pc.user_id " +
            "LEFT JOIN users_emails ue ON ue.user_id = u.user_id " +
            "WHERE pc.is_supervisor = false AND  pc.project_id = :id", nativeQuery = true)
    List<Object[]> getCollaborators(@Param("id") Long id);
    
//    @Query("SELECT u FROM ProjectCollaborator WHERE pc.projectId = :id AND pc.isSupervisor = false")
//    List<ProjectCollaborator> getCollaboratorsData(@Param("id") Long id);
//    
//    @Query("SELECT u FROM ProjectCollaborator WHERE pc.projectId = :id AND pc.isSupervisor = true")
//    ProjectCollaborator getSupervisorData(@Param("id") Long id);
    
    @Query("SELECT u FROM ProjectCollaborator pc " + 
            "LEFT JOIN User u ON u.id = pc.userId " +
            "WHERE pc.projectId = :id AND pc.isSupervisor = true")
    User getSupervisor(@Param("id") Long id);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM ProjectCollaborator WHERE projectId = :id")
    void deleteAllCollaborators(@Param("id") Long id);
}
