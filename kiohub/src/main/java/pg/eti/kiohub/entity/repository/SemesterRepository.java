
package pg.eti.kiohub.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.Semester;

/**
 *
 * @author Aleksander Kania
 */
@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {
    @Query("SELECT s FROM Semester s WHERE s.name = :name")
    Semester findSemesterByName(@Param("name") String name);
}
