package com.battleroyalechess.backend.config;

import com.battleroyalechess.backend.dto.request.UserPostRequest;
import com.battleroyalechess.backend.service.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@Profile("development")                     // only run when in development mode
public class PopulateDbWithGames implements CommandLineRunner {

    // create default games to test the game

    @Autowired
    RegisterService registerService;

    @Override
    public void run(String... args) throws Exception {

        createGame("admin", "password1", "admin@email.com", new HashSet<>(List.of("ADMIN")), null);

    }

    private void createGame(String username, String password, String email, Set authorities, String chessCom){

    }
}
