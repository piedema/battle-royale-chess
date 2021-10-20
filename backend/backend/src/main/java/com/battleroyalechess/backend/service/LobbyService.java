package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.dto.request.QueuePostRequest;
import com.battleroyalechess.backend.exception.*;
import com.battleroyalechess.backend.model.Game;
import com.battleroyalechess.backend.model.Gametype;
import com.battleroyalechess.backend.model.QueuedPlayer;
import com.battleroyalechess.backend.model.User;
import com.battleroyalechess.backend.repository.GameRepository;
import com.battleroyalechess.backend.repository.UserRepository;
import com.battleroyalechess.backend.repository.GametypeRepository;
import com.battleroyalechess.backend.service.GameService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class LobbyService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final GametypeRepository gametypeRepository;
    private final GameService gameService;
    private final ArrayList<QueuedPlayer> queue = new ArrayList<QueuedPlayer>();

    @Autowired
    public LobbyService(UserRepository userRepository, GameRepository gameRepository, GametypeRepository gametypeRepository, GameService gameService) {
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.gametypeRepository = gametypeRepository;
        this.gameService = gameService;
    }

    public void addInQueue(QueuePostRequest queuePostRequest) {

        String gametype = queuePostRequest.getGametype();
        String username = queuePostRequest.getUsername();

        Optional<User> userOptional = userRepository.findById(username);

        if (userOptional.isEmpty()) {
            throw new UserNotFoundException(username);
        }

        // get number of players for gametype
        Optional<Gametype> gametypeOptional = gametypeRepository.findById(gametype);

        if (gametypeOptional.isEmpty()) {
            throw new GametypeNotFoundException(gametype);
        }

        Gametype currentGametype = gametypeOptional.get();

        int nPlayersNeededForGameType = currentGametype.getNumberOfPlayers();

        int nPlayersQueuedForGameType = 1;

        // get number players in queue with this gametype
        for (QueuedPlayer queuedPlayer : queue) {

            if (queuedPlayer.getGametype().equals(gametype)){

                nPlayersQueuedForGameType++;

            }

        }


        // if there are enough players to start the game then remove players from queue and add to players list
        if (nPlayersQueuedForGameType == nPlayersNeededForGameType) {

            ArrayList<String> players = new ArrayList<String>();

            players.add(username);

            ArrayList<QueuedPlayer> queuedPlayersToRemove = new ArrayList<QueuedPlayer>();

            // remove players from queue
            for (QueuedPlayer queuedPlayer : queue) {

                if (queuedPlayer.getGametype().equals(gametype)){

                    queuedPlayersToRemove.add(queuedPlayer);

                    players.add(queuedPlayer.getUsername());

                }

            }

            queue.removeAll(queuedPlayersToRemove);

            // start game with players
            createGame(gametype, players);

        } else {

            // else add this player to queue
            QueuedPlayer queuedPlayer = new QueuedPlayer();
            queuedPlayer.setUsername(username);
            queuedPlayer.setGametype(gametype);
            queue.add(queuedPlayer);

        }

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
        System.out.println("Current queue " + queue);
        GameService game = new GameService();
        game.setGametype(gametype);

        System.out.println(game.getGametype());

    }

}