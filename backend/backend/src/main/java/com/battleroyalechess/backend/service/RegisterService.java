package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.dto.request.UserPostRequest;
import com.battleroyalechess.backend.exception.*;
import com.battleroyalechess.backend.model.User;
import com.battleroyalechess.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterService {

    private UserRepository userRepository;
    private UserService userService;
    PasswordEncoder passwordEncoder;

    @Autowired
    public RegisterService(UserRepository userRepository, UserService userService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public String createUser(UserPostRequest userPostRequest) {
        try {

            // TODO only allow user be created as admin when creater is admin
            // TODO Unregistered user may also create himself

            String username = userPostRequest.getUsername();
            String email = userPostRequest.getEmail();

            if(userService.userExists(username)) throw new UsernameNotAvailableException();
            if(userService.emailExists(email)) throw new EmailNotAvailableException();

            String encryptedPassword = passwordEncoder.encode(userPostRequest.getPassword());

            User user = new User();
            user.setUsername(userPostRequest.getUsername());
            user.setPassword(encryptedPassword);
            user.setEmail(userPostRequest.getEmail());
            user.setEnabled(true);
            user.addAuthority("ROLE_USER");

            for (String s : userPostRequest.getAuthorities()){
                if(s.equals("ADMIN")) user.addAuthority("ROLE_" + s);
            }

            User newUser = userRepository.save(user);
            return newUser.getUsername();
        }
        catch(UsernameNotAvailableException | EmailNotAvailableException ex) {

            throw ex;

        }
        catch (Exception ex) {
            throw new BadRequestException("Cannot create user");

        }

    }
}