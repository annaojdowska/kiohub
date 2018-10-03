package pg.eti.kiohub.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.entity.model.UserEmail;

@Repository
public interface UserEmailRepository extends JpaRepository<UserEmail, Long> {
}
