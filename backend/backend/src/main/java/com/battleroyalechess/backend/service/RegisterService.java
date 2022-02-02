package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.dto.request.UserPostRequest;
import com.battleroyalechess.backend.exception.*;
import com.battleroyalechess.backend.model.Authority;
import com.battleroyalechess.backend.model.User;
import com.battleroyalechess.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Set;

@Service
public class RegisterService {

    private final UserRepository userRepository;
    private final UserService userService;
    PasswordEncoder passwordEncoder;

    @Autowired
    public RegisterService(UserRepository userRepository, UserService userService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public String create(boolean creatorIsAdmin, UserPostRequest userPostRequest) {
        try {

            String username = userPostRequest.getUsername();
            String email = userPostRequest.getEmail();
            Set<String> authorities = userPostRequest.getAuthorities();

            if(userService.userExists(username)) throw new UsernameNotAvailableException();
            if(userService.emailExists(email)) throw new EmailNotAvailableException();

            String encryptedPassword = passwordEncoder.encode(userPostRequest.getPassword());

            User user = new User();
            user.setUsername(userPostRequest.getUsername());
            user.setPassword(encryptedPassword);
            user.setEmail(userPostRequest.getEmail());
            user.setEnabled(true);
            user.addAuthority("ROLE_USER");

            if(creatorIsAdmin && authorities.contains("ADMIN")){
                user.addAuthority("ROLE_ADMIN");
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