package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.dto.request.QueuePostRequest;
import com.battleroyalechess.backend.exception.*;
import com.battleroyalechess.backend.model.Authority;
import com.battleroyalechess.backend.model.User;
import com.battleroyalechess.backend.repository.UserRepository;
import com.battleroyalechess.backend.repository.GameRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class LobbyService {

    private UserRepository userRepository;
    private ArrayList<String> twoPlayersQueue = new ArrayList();
    private ArrayList<String> fourPlayersQueue = new ArrayList();

    @Autowired
    public LobbyService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void addToQueue(QueuePostRequest queuePostRequest) {

        String gametype = queuePostRequest.getGametype();
        String username = queuePostRequest.getUsername();

        Optional<User> userOptional = userRepository.findById(username);

        if (userOptional.isEmpty()) {
            throw new UserNotFoundException(username);
        }

        if(!userOptional.isEmpty()){

            if(gametype == "2players"){

                if(twoPlayersQueue.size() > 0){

                    String player1 = twoPlayersQueue.remove(0);

                    String[] players = new String[]{ player1, username};

                    startGame(players);
                }

                if(twoPlayersQueue.size() == 0) {

                    twoPlayersQueue.add(username);

                }
            }

            if(gametype == "4players") {

                if(fourPlayersQueue.size() >= 3){

                    String player1 = fourPlayersQueue.remove(0);
                    String player2 = fourPlayersQueue.remove(0);
                    String player3 = fourPlayersQueue.remove(0);

                    String[] players = new String[]{ player1, player2, player3, username};

                    startGame(players);
                }

                if(fourPlayersQueue.size() < 3) {

                    fourPlayersQueue.add(username);

                }
            }
        }

    }

    private void startGame(String[] players){

        System.out.println("Game starting with players:");
        System.out.println(players);

    }

}