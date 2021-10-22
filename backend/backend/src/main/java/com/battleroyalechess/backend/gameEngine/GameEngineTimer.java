package com.battleroyalechess.backend.gameEngine;

import com.battleroyalechess.backend.gameEngine.GameEngine;
import com.battleroyalechess.backend.repository.GameRepository;
import com.battleroyalechess.backend.repository.GametypeRepository;
import com.battleroyalechess.backend.service.UserService;

public class GameEngineTimer extends GameEngine implements Runnable {

    private final GameEngine gameEngine;

    public GameEngineTimer(UserService userService, GameRepository gameRepository, GametypeRepository gametypeRepository, GameEngine gameEngine) {
        super(userService, gameRepository, gametypeRepository);
        this.gameEngine = gameEngine;
    }

    @Override
    public void run(){

        if(!this.gameEngine.hasGameStarted()) this.gameEngine.startGame();
        if(this.gameEngine.hasGameStarted()) this.gameEngine.finishRound();

    }

}