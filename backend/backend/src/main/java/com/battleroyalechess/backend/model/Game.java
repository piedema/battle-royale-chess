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
    public String gametype;

    @Column(nullable = false)
    public String player1;

    @Column(nullable = false)
    public String player2;

    @Column
    public String player3;

    @Column
    public String player4;

    @Column
    public String player5;

    @Column
    public String player6;

    @Column
    public String player7;

    @Column
    public String player8;

    public long getGameId() {
        return gameId;
    }

    public void setGameId(long gameId) {
        this.gameId = gameId;
    }

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    public String getGametype() {
        return gametype;
    }

    public void setGametype(String gametype) {
        this.gametype = gametype;
    }

    public String getPlayer1() {
        return player1;
    }

    public void setPlayer1(String player1) {
        this.player1 = player1;
    }

    public String getPlayer2() {
        return player2;
    }

    public void setPlayer2(String player2) {
        this.player2 = player2;
    }

    public String getPlayer3() {
        return player3;
    }

    public void setPlayer3(String player3) {
        this.player3 = player3;
    }

    public String getPlayer4() {
        return player4;
    }

    public void setPlayer4(String player4) {
        this.player4 = player4;
    }

    public String getPlayer5() {
        return player5;
    }

    public void setPlayer5(String player5) {
        this.player5 = player5;
    }

    public String getPlayer6() {
        return player6;
    }

    public void setPlayer6(String player6) {
        this.player6 = player6;
    }

    public String getPlayer7() {
        return player7;
    }

    public void setPlayer7(String player7) {
        this.player7 = player7;
    }

    public String getPlayer8() {
        return player8;
    }

    public void setPlayer8(String player8) {
        this.player8 = player8;
    }

    public Boolean hasPlayer(String player){
        if(this.player1.equals(player)) return true;
        if(this.player2.equals(player)) return true;
        if(this.player3.equals(player)) return true;
        if(this.player4.equals(player)) return true;
        if(this.player5.equals(player)) return true;
        if(this.player6.equals(player)) return true;
        if(this.player7.equals(player)) return true;
        if(this.player8.equals(player)) return true;

        return false;
    }
}