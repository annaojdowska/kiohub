
package pg.eti.kiohub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.model.Semester;
import pg.eti.kiohub.entity.repository.SemesterRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class SemesterService {
    @Autowired
    private SemesterRepository semesterRepository;

    public List<Semester> findSemestersId(List<Semester> semesters) {
        List<Semester> semestersToReturn = new ArrayList<>();
        semesters.forEach((semester) -> {
            semestersToReturn.add(semesterRepository.findSemesterByName(semester.getName()));
        });
        return semestersToReturn;
    }
}
