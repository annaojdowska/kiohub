/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pg.eti.kiohub.entity.enums.AttachmentType;
import pg.eti.kiohub.entity.enums.Visibility;

import javax.persistence.*;

/**
 *
 * @author Aleksander Kania
 */
@Entity
@Table(name = "attachments")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Attachment {

    @Id
    @Column(name = "attachment_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    private String fileName;    
    private Long fileSize;    
    private AttachmentType type;
    private Visibility visibility;
    
    @Column(name = "is_main_photo")
    private Boolean mainPhoto;
}
