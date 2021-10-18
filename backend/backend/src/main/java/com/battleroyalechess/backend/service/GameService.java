package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.exception.GameNotFoundException;
import com.battleroyalechess.backend.model.Game;
import com.battleroyalechess.backend.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GameService {

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public Optional<Game> getGame(long gameId){

        Optional<Game> game = gameRepository.findById(gameId);

        if(game.isEmpty()){

            throw new GameNotFoundException(gameId);

        }

        System.out.println("This gets printed");

        return game;
    }

    public Long findGameIdByUsername(String username){

        Iterable<Game> unfinishedGames = gameRepository.findByFinished(false);

//        for (Game game: unfinishedGames){
//
//            if(game.getPlayers().contains(username)) return game.getGameId();
//
//        }

        return null;

    }

}