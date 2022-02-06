package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.repository.GameRepository;
import com.battleroyalechess.backend.repository.GametypeRepository;
import com.battleroyalechess.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class GamesServiceTest {

    private final UserService userService;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final GametypeRepository gametypeRepository;

    public GamesServiceTest(UserService userService, GameRepository gameRepository, UserRepository userRepository, GametypeRepository gametypeRepository) {
        this.userService = userService;
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.gametypeRepository = gametypeRepository;
    }

    @Test
    void myFirstUnitTest(){

        //Arrange
        GamesService gamesService = new GamesService(userService, gameRepository, userRepository, gametypeRepository);

        //Act

        //Assert
        assertEquals("expected gamedata", gamesService.getGamedata(1));
    }


}
