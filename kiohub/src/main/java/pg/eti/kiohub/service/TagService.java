
package pg.eti.kiohub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.model.Tag;
import pg.eti.kiohub.entity.repository.TagRepository;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Kasia
 */
@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    public List<Tag> addTags(List<Tag> tags) {
        List<Tag> tagsToReturn = new ArrayList<>();
        for (Tag tag : tags) {
            if (tagRepository.checkIfTagExists(tag.getName()) == 0) {
                tag = tagRepository.saveAndFlush(tag);
            } else {
                tag = tagRepository.getTagByName(tag.getName());
            }

            if (!tagsToReturn.contains(tag)) {
                tagsToReturn.add(tag);
            }
        }
        return tagsToReturn;
    }

}
