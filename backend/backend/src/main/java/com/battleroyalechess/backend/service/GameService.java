package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.model.Game;
import com.battleroyalechess.backend.repository.GameRepository;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class GameService {


    private final String gametype;
    private final ArrayList<String> players;
    private final Long gameId;

    public GameService(String gametype, ArrayList<String> players) {
        this.gametype = gametype;
        this.players = players;

        Game game = new Game();
        game.setGametype(gametype);
        game.setPlayer1(players.get(0));
        game.setPlayer2(players.get(1));

        if(players.size() >= 2) game.setPlayer3(players.get(2));
        if(players.size() >= 3) game.setPlayer4(players.get(3));
        if(players.size() >= 4) game.setPlayer5(players.get(4));
        if(players.size() >= 5) game.setPlayer6(players.get(5));
        if(players.size() >= 6) game.setPlayer7(players.get(6));
        if(players.size() >= 7) game.setPlayer8(players.get(7));

        Game savedGame = gameRepository.save(game);

        this.gameId = savedGame.getGameId();
    }

    public String getGametype() {
        return gametype;
    }

    public ArrayList<String> getPlayers() {
        return players;
    }

    public Long getGameId(){
        return gameId;
    }

}