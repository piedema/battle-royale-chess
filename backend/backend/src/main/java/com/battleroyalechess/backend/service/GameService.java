package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.exception.GameNotFoundException;
import com.battleroyalechess.backend.model.Game;
import com.battleroyalechess.backend.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.persistence.Entity;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Timer;
import java.util.TimerTask;
@Component
public class GameService {


    private String gametype;
    private ArrayList<String> players;
    private Long gameId;

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

        gameRepository.save(game);
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