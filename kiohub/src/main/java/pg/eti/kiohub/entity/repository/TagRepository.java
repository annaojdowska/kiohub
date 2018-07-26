/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.Tag;

/**
 *
 * @author Aleksander Kania
 */
@Repository
public interface TagRepository extends CrudRepository<Tag, Long> {
    
}
