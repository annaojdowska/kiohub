
package pg.eti.kiohub.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.ProjectSettings;

@Repository
public interface ProjectSettingsRepository extends JpaRepository<ProjectSettings, Long> {
    
}
