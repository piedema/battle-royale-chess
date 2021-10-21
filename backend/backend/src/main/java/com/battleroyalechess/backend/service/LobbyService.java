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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class LobbyService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final GametypeRepository gametypeRepository;
    private final GamesService gamesService;
    private final ArrayList<QueuedPlayer> queue = new ArrayList<QueuedPlayer>();

    @Autowired
    public LobbyService(UserRepository userRepository, GameRepository gameRepository, GametypeRepository gametypeRepository, GamesService gamesService){
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.gametypeRepository = gametypeRepository;
        this.gamesService = gamesService;
    }

    public void addInQueue(QueuePostRequest queuePostRequest) {

        String gametype = queuePostRequest.getGametype();
        String username = queuePostRequest.getUsername();

        Optional<User> userOptional = userRepository.findById(username);

        // check if user exists
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException(username);
        }

        Iterable<Game> activeGames = gameRepository.findByFinished(false);

        // check if user is not in a game already
        for( Game game: activeGames) {
            if(game.hasPlayer(username)){
                throw new UserInGameAlreadyException(username);
            }
        }

        // check if user is not in the lobby already
        for( QueuedPlayer queuedPlayer: queue) {
            if(queuedPlayer.getUsername().equals(username)){
                throw new UserInGameAlreadyException(username);
            }
        }

        // check if gametype exists
        Optional<Gametype> gametypeOptional = gametypeRepository.findById(gametype);

        if (gametypeOptional.isEmpty()) {
            throw new GametypeNotFoundException(gametype);
        }

        // get gametype model
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
            gamesService.createGame(gametype, players);

        } else {

            // else add this player to queue
            QueuedPlayer queuedPlayer = new QueuedPlayer();
            queuedPlayer.setUsername(username);
            queuedPlayer.setGametype(gametype);
            queue.add(queuedPlayer);

        }

    }


}