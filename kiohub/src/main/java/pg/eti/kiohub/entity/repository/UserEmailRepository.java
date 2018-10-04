package pg.eti.kiohub.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.entity.model.UserEmail;

@Repository
public interface UserEmailRepository extends JpaRepository<UserEmail, Long> {
//    SELECT * 
//      FROM users_emails ue
//      LEFT JOIN users u ON u.user_id = ue.user_id
//      WHERE u.is_supervisor = false;
}
