package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.exception.GameNotFoundException;
import com.battleroyalechess.backend.model.Game;
import com.battleroyalechess.backend.repository.GameRepository;
import com.battleroyalechess.backend.repository.GametypeRepository;
import com.battleroyalechess.backend.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;

@Component
public class GamesService {

    private Map<Long, Object> activeGames;

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final GametypeRepository gametypeRepository;
    private final GameService gameService;

    public GamesService(UserRepository userRepository, GameRepository gameRepository, GametypeRepository gametypeRepository, GameService gameService) {
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.gametypeRepository = gametypeRepository;
        this.gameService = gameService;
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

        GameService game = new GameService(gametype, players);
//        game.setGametype(gametype);
//        game.setPlayers(players);

        Long gameId = game.getGameId();

        activeGames.put(gameId, game);

        System.out.println(game.getGametype());

    }

}