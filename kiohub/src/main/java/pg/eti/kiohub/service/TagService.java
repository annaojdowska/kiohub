/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.model.Tag;
import pg.eti.kiohub.entity.repository.TagRepository;

/**
 *
 * @author Kasia
 */
@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;
    
    public List<Tag> addTags(List<Tag> tags) {
        List<Tag> tagsToReturn = new ArrayList<>();
        for(Tag tag : tags) {
            if (tagRepository.checkIfTagExists(tag.getName()) == 0) {
                tag = tagRepository.saveAndFlush(tag);
            } else if (tag.getId() == null) {
                tag = tagRepository.getTagByName(tag.getName());
            }
            tagsToReturn.add(tag);
        }
        return tagsToReturn;
    }
    
}
