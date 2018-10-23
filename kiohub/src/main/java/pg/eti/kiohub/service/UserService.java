package pg.eti.kiohub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.entity.model.UserEmail;
import pg.eti.kiohub.entity.repository.UserEmailRepository;
import pg.eti.kiohub.entity.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserEmailRepository userEmailRepository;

    public List<User> createNewUsersAndGetAllByEmails(List<String> emails) {
        List<User> users = new ArrayList<>();
        for (String email : emails) {
            User user = null;
            if (userRepository.checkIfUserExistsByEmail(email) > 0) {
                user = userRepository.findUserByEmail(email);
            } else {
                user = createNewUserUsingEmail(email);
            }
            users.add(user);
        }
        return users;
    }

    private User createNewUserUsingEmail(String email) {
        User user = new User();
        user.setIsSupervisor(false);
        // FIXME #2
        user = userRepository.saveAndFlush(user);

        UserEmail userEmail = new UserEmail(email, user);
        userEmailRepository.save(userEmail);
        return user;
    }

}
