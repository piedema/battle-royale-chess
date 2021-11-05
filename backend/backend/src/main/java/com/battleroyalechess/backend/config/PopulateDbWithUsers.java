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
import java.util.Set;

@Component
@Profile("development")
public class PopulateDbWithUsers implements CommandLineRunner {

    @Autowired
    RegisterService registerService;

    @Override
    public void run(String... args) throws Exception {

        createUser("admin", "password", "admin@email.com", new HashSet<>(Arrays.asList("ADMIN")));
        createUser("peter", "password", "peter@email.com", new HashSet<>(Arrays.asList()));
        createUser("bart", "password", "bart@email.com", new HashSet<>(Arrays.asList()));
        createUser("robin", "password", "robin@email.com", new HashSet<>(Arrays.asList()));
        createUser("laurens", "password", "laurens@email.com", new HashSet<>(Arrays.asList()));
        createUser("maaike", "password", "maaike@email.com", new HashSet<>(Arrays.asList()));

    }

    private void createUser(String username, String password, String email, Set authorities){

        UserPostRequest userPostRequest = new UserPostRequest();

        userPostRequest.setUsername(username);
        userPostRequest.setPassword(password);
        userPostRequest.setEmail(email);
        userPostRequest.setAuthorities(authorities);

        registerService.createUser(userPostRequest);

    }
}
