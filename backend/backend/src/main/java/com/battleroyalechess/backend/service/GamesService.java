package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.dto.request.NewMovePostRequest;
import com.battleroyalechess.backend.exception.GameNotFoundException;
import com.battleroyalechess.backend.model.Game;
import com.battleroyalechess.backend.repository.GameRepository;
import com.battleroyalechess.backend.repository.GametypeRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class GamesService {

    private final UserService userService;
    private final GameRepository gameRepository;
    private final GametypeRepository gametypeRepository;

    private final Map<Long, GameEngineService> activeGames = new HashMap<>();

    public GamesService(UserService userService, GameRepository gameRepository, GametypeRepository gametypeRepository) {
        this.userService = userService;
        this.gameRepository = gameRepository;
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

            if(game.hasPlayer(username)) return game.getGameId();

        }

        throw new GameNotFoundException();

    }

    public void createGame(String gametype, ArrayList<String> players){

        System.out.println("Create a new game with gametype " + gametype + " and players " + players);

        GameEngineService game = new GameEngineService(userService, gameRepository, gametypeRepository);
        Long gameId = game.initialize(gametype, players, this);

        this.activeGames.put(gameId, game);

    }

    public void newMove(Long gameId, NewMovePostRequest newMovePostRequest){

        GameEngineService game = this.activeGames.get(gameId);

        game.newMove(newMovePostRequest);

    }

    public void orphanGame(Long gameId){
        this.activeGames.remove(gameId);
    }

}