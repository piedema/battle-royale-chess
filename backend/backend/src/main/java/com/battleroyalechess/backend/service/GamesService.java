package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.dto.request.NewMovePostRequest;
import com.battleroyalechess.backend.dto.response.NewMoveResponse;
import com.battleroyalechess.backend.exception.GameNotFoundException;
import com.battleroyalechess.backend.gameEngine.GameEngine;
import com.battleroyalechess.backend.model.Game;
import com.battleroyalechess.backend.repository.GameRepository;
import com.battleroyalechess.backend.repository.GametypeRepository;
import com.battleroyalechess.backend.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class GamesService {

    private final UserService userService;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final GametypeRepository gametypeRepository;

    private final Map<Long, GameEngine> activeGames = new HashMap<>();

    public GamesService(UserService userService, GameRepository gameRepository, UserRepository userRepository, GametypeRepository gametypeRepository) {
        this.userService = userService;
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.gametypeRepository = gametypeRepository;
    }

    public Optional<Game> getGamedata(long gameId){

        Optional<Game> game = gameRepository.findById(gameId);

        if(game.isEmpty()){

            throw new GameNotFoundException(gameId);

        }

        return game;
    }

    public Long findGameIdByUsername(String username){

        Iterable<Game> unfinishedGames = gameRepository.findByFinished(false);

        for (Game game: unfinishedGames){

            if(game.getPlayers().contains(username)) return game.getGameId();

        }

        throw new GameNotFoundException();

    }

    public void createGame(String gametype, ArrayList<String> players){

        System.out.println("Create a new game with gametype " + gametype + " and players " + players);

        GameEngine game = new GameEngine(userService, gameRepository, userRepository, gametypeRepository);
        Long gameId = game.initialize(gametype, players, this);

        if(gameId != null) this.activeGames.put(gameId, game);

    }

    public NewMoveResponse newMove(Long gameId, NewMovePostRequest newMovePostRequest){

        GameEngine game = this.activeGames.get(gameId);

        System.out.println("new move recieved for game " + game);

        try {
            return game.newMove(newMovePostRequest);
        }
        catch (Exception ex) {
            throw new GameNotFoundException();
        }

    }

    public void orphanGame(Long gameId){
        this.activeGames.remove(gameId);
    }

    public Iterable<Game> getGames(){
        return gameRepository.findAll();
    }

}