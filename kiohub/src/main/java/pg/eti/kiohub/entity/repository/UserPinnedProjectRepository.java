/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.repository;

import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.UserPinnedProject;

/**
 *
 * @author Aleksander Kania
 */
@Repository
public interface UserPinnedProjectRepository extends JpaRepository<UserPinnedProject, Long> { 
    @Transactional
    @Modifying
    @Query("DELETE FROM UserPinnedProject WHERE projectId = :id")
    void deleteAllPinnedProject(@Param("id") Long id);
}
