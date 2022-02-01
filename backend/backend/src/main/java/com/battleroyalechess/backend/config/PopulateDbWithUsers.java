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
@Profile("development")
public class PopulateDbWithUsers implements CommandLineRunner {

    @Autowired
    RegisterService registerService;

    @Override
    public void run(String... args) throws Exception {

        createUser("adminadmin", "password1", "admin@email.com", new HashSet<>(List.of("ADMIN")));
        createUser("peterpeter", "password1", "peter@email.com", new HashSet<>(List.of()));
        createUser("bartbart", "password1", "bart@email.com", new HashSet<>(List.of()));
        createUser("robinrobin", "password1", "robin@email.com", new HashSet<>(List.of()));
        createUser("laurenslaurens", "password1", "laurens@email.com", new HashSet<>(List.of()));
        createUser("maaikemaaike", "password1", "maaike@email.com", new HashSet<>(List.of()));

    }

    private void createUser(String username, String password, String email, Set authorities){

        UserPostRequest userPostRequest = new UserPostRequest();

        userPostRequest.setUsername(username);
        userPostRequest.setPassword(password);
        userPostRequest.setEmail(email);
        userPostRequest.setAuthorities(authorities);

        registerService.create(true, userPostRequest);

    }
}
