
package pg.eti.kiohub.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    @Query("SELECT COUNT(1) FROM Tag t WHERE t.name = :name")
    Long checkIfTagExists(@Param("name") String name);
    
    @Query("SELECT t FROM Tag t WHERE t.name = :name")
    Tag getTagByName(@Param("name") String name);
}
