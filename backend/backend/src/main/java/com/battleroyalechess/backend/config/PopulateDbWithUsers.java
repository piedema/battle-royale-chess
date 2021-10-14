package com.battleroyalechess.backend.config;

import com.battleroyalechess.backend.dto.request.UserPostRequest;
import com.battleroyalechess.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
@Profile("development")
public class PopulateDbWithUsers implements CommandLineRunner {

    @Autowired
    UserService userService;

    @Override
    public void run(String... args) throws Exception {

        createUser("user", "password", "user@email.com", new HashSet<>(Arrays.asList("ROLE_ADMIN")));
        createUser("peter", "password", "peter@email.com", new HashSet<>(Arrays.asList()));

    }

    private void createUser(String username, String password, String email, Set authorities){

        UserPostRequest userPostRequest = new UserPostRequest();

        userPostRequest.setUsername(username);
        userPostRequest.setPassword(password);
        userPostRequest.setEmail(email);
        userPostRequest.setAuthorities(authorities);

        userService.createUser(userPostRequest);

    }
}
