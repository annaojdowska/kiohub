
package pg.eti.kiohub.entity.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.Note;

/**
 *
 * @author Aleksander Kania
 */
@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    @Query("SELECT n FROM Note n WHERE n.project.id = :projectId")
    List<Note> getNotesByProjectId(@Param("projectId") Long projectId);
}
