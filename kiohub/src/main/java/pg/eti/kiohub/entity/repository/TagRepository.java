/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.Tag;

/**
 *
 * @author Aleksander Kania
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    @Query("SELECT COUNT(1) FROM Tag t WHERE t.name = :name")
    Long checkIfTagExists(@Param("name") String name);
    
    @Query("SELECT t FROM Tag t WHERE t.name = :name")
    Tag getTagByName(@Param("name") String name);
}
