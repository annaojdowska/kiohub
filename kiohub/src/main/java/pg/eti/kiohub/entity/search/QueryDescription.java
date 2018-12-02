
package pg.eti.kiohub.entity.search;

import java.util.Date;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QueryDescription {    
    private List<String> supervisors;
    private List<String> tags;
    private List<String> titles;
    private List<String> descriptions;
    private List<Long> licencesIds;
    private List<Long> projectTypesIds;
    private List<Long> semestersIds;
    private Date dateTo;
    private Date dateFrom;
    
    public boolean isEmpty(){
        return supervisors.isEmpty() && tags.isEmpty() && titles.isEmpty() && descriptions.isEmpty()
                && licencesIds.isEmpty() && projectTypesIds.isEmpty() && semestersIds.isEmpty() 
                && dateTo == null && dateFrom == null;
    }
}
