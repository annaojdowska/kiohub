
package pg.eti.kiohub.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.User;

/**
 *
 * @author Aleksander Kania
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query(value = "SELECT count(*) FROM users u " +
            "LEFT JOIN users_emails email on u.user_id = email.user_id " +
            "WHERE email.email = :email", nativeQuery = true)
    Long checkIfUserExistsByEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM users u " +
            "LEFT JOIN users_emails email on u.user_id = email.user_id " +
            "WHERE email.email = :email", nativeQuery = true)
    User findUserByEmail(@Param("email") String email);
}
