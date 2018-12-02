
package pg.eti.kiohub.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.Licence;

@Repository
public interface LicenceRepository extends JpaRepository<Licence, Long> {
    
}
