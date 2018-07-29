/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pg.eti.kiohub.entity.enums.Type;
import pg.eti.kiohub.entity.enums.Visibility;

/**
 *
 * @author Aleksander Kania
 */
@Entity(name = "ATTACHMENTS")
@Getter
@Setter
@NoArgsConstructor
public class Attachment {

    @Id
    @Column(name = "attachment_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    private String fileName;    
    private Integer fileSize;    
    private Type type;    
    private Visibility visibility;
    
    @Column(name = "is_main_photo")
    private Boolean mainPhoto;
}
