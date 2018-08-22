/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.Project;

/**
 *
 * @author Aleksander Kania <kania>
 */
//adnotacja potrzebna po to, aby Spring mógł zinterpretować klasę jako springowe repozytorium
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>{
    @Query("select count(p) from Project p where p.title = :titlePl")
    Long checkIfUniqueTitle(@Param("titlePl") String titlePl);

    @Query("select count(u) from User u where u.email = :email")
    Long checkIfEmailExistsByEmail(@Param("email") String email);

}
