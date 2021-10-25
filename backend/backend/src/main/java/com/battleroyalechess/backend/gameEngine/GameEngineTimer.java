package com.battleroyalechess.backend.gameEngine;

import com.battleroyalechess.backend.gameEngine.GameEngine;
import com.battleroyalechess.backend.repository.GameRepository;
import com.battleroyalechess.backend.repository.GametypeRepository;
import com.battleroyalechess.backend.repository.UserRepository;
import com.battleroyalechess.backend.service.UserService;

public class GameEngineTimer extends GameEngine implements Runnable {

    private final GameEngine gameEngine;

    public GameEngineTimer(UserService userService, GameRepository gameRepository, UserRepository userRepository, GametypeRepository gametypeRepository, GameEngine gameEngine) {
        super(userService, gameRepository, userRepository, gametypeRepository);
        this.gameEngine = gameEngine;
    }

    @Override
    public void run(){

        System.out.println("Running... " + this.gameEngine.hasGameStarted());

        try {

            if (this.gameEngine.hasGameStarted()) this.gameEngine.finishRound();
            if (!this.gameEngine.hasGameStarted()) this.gameEngine.startGame();

        }
        catch (Exception ex){
            System.out.println("Timer exception " + ex);
        }

    }

}