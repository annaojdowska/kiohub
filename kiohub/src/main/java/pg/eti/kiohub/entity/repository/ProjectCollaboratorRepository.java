
package pg.eti.kiohub.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.enums.Visibility;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.ProjectCollaborator;
import pg.eti.kiohub.entity.model.User;

import javax.transaction.Transactional;
import java.util.List;

/**
 *
 * @author Aleksander Kania
 */
@Repository
public interface ProjectCollaboratorRepository extends JpaRepository<ProjectCollaborator, Long>{
    @Query(value = "SELECT u.user_id, u.first_name, u.last_name, ue.email " +
            "FROM project_collaborators pc " +
            "LEFT JOIN users u ON u.user_id = pc.user_id " +
            "LEFT JOIN users_emails ue ON ue.user_id = u.user_id " +
            "WHERE pc.is_supervisor = false AND  pc.project_id = :id", nativeQuery = true)
    List<Object[]> getCollaborators(@Param("id") Long id);
    
    @Query("SELECT pc FROM ProjectCollaborator pc WHERE pc.projectId = :projectId AND pc.userId = :userId")
    ProjectCollaborator getCollaborator(@Param("projectId") Long projectId, @Param("userId") Long userId);
    
    @Query("SELECT pc FROM ProjectCollaborator pc WHERE pc.projectId = :id AND pc.isSupervisor = false")
    List<ProjectCollaborator> getCollaboratorsData(@Param("id") Long id);
    
    @Query("SELECT pc FROM ProjectCollaborator pc WHERE pc.projectId = :id AND pc.isSupervisor = true")
    ProjectCollaborator getSupervisorData(@Param("id") Long id);
    
    @Query("SELECT u FROM ProjectCollaborator pc " + 
            "LEFT JOIN User u ON u.id = pc.userId " +
            "WHERE pc.projectId = :id AND pc.isSupervisor = true")
    User getSupervisor(@Param("id") Long id);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM ProjectCollaborator WHERE projectId = :id")
    void deleteAllCollaborators(@Param("id") Long id);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM ProjectCollaborator WHERE projectId = :pid AND userId = :uid")
    void deleteCollaborator(@Param("pid") Long pid, @Param("uid") Long uid);
    
    @Query(value = "SELECT p FROM ProjectCollaborator pc "
        + "LEFT JOIN Project p ON pc.projectId = p.id "
        + "WHERE pc.userId = :id")
    List<Project> getListOfCollaboratorsProjects(@Param("id") Long id);

    @Query(value = "SELECT pc.userId FROM ProjectCollaborator pc "
            + "WHERE pc.projectId = :projectId")
    List<Long> getListOfProjectCollaboratorsIds(@Param("projectId") Long projectId);

    @Query(value="SELECT pc.userDataVisible FROM ProjectCollaborator pc "
    + "WHERE pc.projectId = :projectId AND pc.userId = :userId")
    Visibility getCollaboratorVisibility(@Param("projectId") Long projectId, @Param("userId") Long userId);
}
