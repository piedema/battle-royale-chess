package com.battleroyalechess.backend.config;

import com.battleroyalechess.backend.dto.request.UserPostRequest;
import com.battleroyalechess.backend.service.RegisterService;
import com.battleroyalechess.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@Profile("development")                     // only run when in development mode
public class PopulateDbWithUsers implements CommandLineRunner {

    // create default users to test the game

    @Autowired
    RegisterService registerService;

    @Override
    public void run(String... args) throws Exception {

        createUser("adminadmin", "password1", "admin@email.com", new HashSet<>(List.of("ADMIN")), null);
        createUser("peterpeter", "password1", "peter@email.com", new HashSet<>(List.of()), "peter");
        createUser("bartbart", "password1", "bart@email.com", new HashSet<>(List.of()), "bart");
        createUser("robinrobin", "password1", "robin@email.com", new HashSet<>(List.of()), null);
        createUser("laurenslaurens", "password1", "laurens@email.com", new HashSet<>(List.of()), null);
        createUser("maaikemaaike", "password1", "maaike@email.com", new HashSet<>(List.of()), "maaike");

    }

    private void createUser(String username, String password, String email, Set authorities, String chessCom){

        UserPostRequest userPostRequest = new UserPostRequest();

        userPostRequest.setUsername(username);
        userPostRequest.setPassword(password);
        userPostRequest.setEmail(email);
        userPostRequest.setAuthorities(authorities);
        userPostRequest.setChessCom(chessCom);

        registerService.create(true, userPostRequest);

    }
}
