package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.dto.request.QueuePostRequest;
import com.battleroyalechess.backend.exception.*;
import com.battleroyalechess.backend.model.Gametype;
import com.battleroyalechess.backend.model.QueuedPlayer;
import com.battleroyalechess.backend.model.User;
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
    private final GametypeRepository gametypeRepository;
    private final GameService gameService;
    private final ArrayList<QueuedPlayer> queue = new ArrayList<QueuedPlayer>();

    @Autowired
    public LobbyService(UserRepository userRepository, GametypeRepository gametypeRepository, GameService gameService) {
        this.userRepository = userRepository;
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

        int nPlayersQueuedForGameType = 0;

        // get number players in queue with this gametype
        for (QueuedPlayer queuedPlayer : queue) {

            if (queuedPlayer.getGametype() == gametype) nPlayersQueuedForGameType++;

        }

        // if there are enough players to start the game then remove players from queue and start game
        if (nPlayersQueuedForGameType == nPlayersNeededForGameType) {

            ArrayList<String> players = new ArrayList<String>();

            players.add(username);

            // remove players from queue
            for (QueuedPlayer queuedPlayer : queue) {

                if (queuedPlayer.getGametype() == gametype){

                    queue.remove(queuedPlayer);

                    players.add(queuedPlayer.getUsername());

                }

            }

            // start game with players
            gameService.createGame(gametype, players);

        } else {

            // else add this player to queue
            QueuedPlayer queuedPlayer = new QueuedPlayer();
            queuedPlayer.setUsername(username);
            queuedPlayer.setGametype(gametype);
            queue.add(queuedPlayer);

        }

    }

}