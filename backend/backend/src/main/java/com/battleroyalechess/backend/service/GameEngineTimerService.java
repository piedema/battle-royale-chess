package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.repository.GameRepository;
import com.battleroyalechess.backend.repository.GametypeRepository;

public class GameEngineTimerService extends GameEngineService implements Runnable {

    private final GameEngineService gameEngineService;

    public GameEngineTimerService(UserService userService, GameRepository gameRepository, GametypeRepository gametypeRepository, GameEngineService gameEngineService) {
        super(userService, gameRepository, gametypeRepository);
        this.gameEngineService = gameEngineService;
    }

    @Override
    public void run(){

        if(!this.gameEngineService.hasGameStarted()) this.gameEngineService.startGame();
        if(this.gameEngineService.hasGameStarted()) this.gameEngineService.endRound();

    }

}