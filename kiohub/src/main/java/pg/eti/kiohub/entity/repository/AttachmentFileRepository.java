/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pg.eti.kiohub.entity.model.AttachmentFile;

/**
 *
 * @author Tomasz
 */
@Repository
public interface AttachmentFileRepository extends JpaRepository<AttachmentFile, Long> {
    
}