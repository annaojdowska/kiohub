
package pg.eti.kiohub.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.Project;

import javax.transaction.Transactional;

/**
 *
 * @author Aleksander Kania <kania>
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>{
    @Query("select count(p) from Project p where p.title = :titlePl")
    Long checkIfUniqueTitle(@Param("titlePl") String titlePl);

    @Transactional
    @Modifying
    @Query(value = "INSERT IGNORE INTO related_projects VALUES (:id, :idTo);", nativeQuery = true)
    void addRelatedProjects(@Param("id") Long id, @Param("idTo") Long idTo);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM related_projects WHERE project_id = :id OR related_project_id = :id", nativeQuery = true)
    void deleteAllRelatedProjects(@Param("id") Long id);
}
