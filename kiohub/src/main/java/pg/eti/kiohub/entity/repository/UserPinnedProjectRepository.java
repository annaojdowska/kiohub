/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.repository;

import java.util.List;
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
    
    @Transactional
    @Modifying
    @Query("DELETE FROM UserPinnedProject WHERE projectId = :projectId AND userId = :userId")
    void deletePinnedProject(@Param("projectId") Long projectId, @Param("userId") Long userId);
    
    @Query("SELECT upp FROM UserPinnedProject upp WHERE upp.userId = :userId")
    List<UserPinnedProject> getPinnedProjects(@Param("userId") Long userId);
    
    @Query("SELECT upp FROM UserPinnedProject upp WHERE upp.projectId = :projectId AND upp.userId = :userId")
    UserPinnedProject getPinnedProject(@Param("projectId") Long projectId, @Param("userId") Long userId);
    
}
