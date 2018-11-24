
package pg.eti.kiohub.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.ProjectStatus;

/**
 *
 * @author Aleksander Kania <kania>
 */
@Repository
public interface ProjectStatusRepository extends JpaRepository<ProjectStatus, Long> {
    @Query("SELECT ps FROM ProjectStatus ps WHERE ps.name = :name")
    ProjectStatus findProjectStatusByName(@Param("name") String name);
}
