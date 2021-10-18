package com.battleroyalechess.backend.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long gameId;

    @Column(nullable = false)
    public boolean finished = false;

    @Column(nullable = false)
    public String players;

    public long getGameId() {
        return gameId;
    }

    public void setGameId(long gameId) {
        this.gameId = gameId;
    }

    public String getPlayers() {
        return players;
    }

    public void setPlayers(String player1) {
        this.players = players;
    }

}