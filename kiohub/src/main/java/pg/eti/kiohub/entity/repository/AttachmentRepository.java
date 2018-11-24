
package pg.eti.kiohub.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.Attachment;

/**
 *
 * @author Aleksander Kania
 */
@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    
}
