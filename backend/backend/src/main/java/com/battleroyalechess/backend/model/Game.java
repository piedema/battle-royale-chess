package com.battleroyalechess.backend.model;

import javax.persistence.*;
import java.util.ArrayList;

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

    @Column
    public String player1Moves;

    @Column
    public String player2Moves;

    @Column
    public String player3Moves;

    @Column
    public String player4Moves;

    @Column
    public String player5Moves;

    @Column
    public String player6Moves;

    @Column
    public String player7Moves;

    @Column
    public String player8Moves;

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

    public String getPlayer2() {
        return player2;
    }

    public String getPlayer3() {
        return player3;
    }

    public String getPlayer4() {
        return player4;
    }

    public String getPlayer5() {
        return player5;
    }

    public String getPlayer6() {
        return player6;
    }

    public String getPlayer7() {
        return player7;
    }

    public String getPlayer8() {
        return player8;
    }

    public String getPlayer1Moves() {
        return player1Moves;
    }

    public void setPlayer1Moves(String from, String to) {
        this.player1Moves = this.player1Moves + from + ">" + to + ";";
    }

    public String getPlayer2Moves() {
        return player2Moves;
    }

    public void setPlayer2Moves(String from, String to) {
        this.player2Moves = this.player2Moves + from + ">" + to + ";";
    }

    public String getPlayer3Moves() {
        return player3Moves;
    }

    public void setPlayer3Moves(String from, String to) {
        this.player3Moves = this.player3Moves + from + ">" + to + ";";
    }

    public String getPlayer4Moves() {
        return player4Moves;
    }

    public void setPlayer4Moves(String from, String to) {
        this.player4Moves = this.player4Moves + from + ">" + to + ";";
    }

    public String getPlayer5Moves() {
        return player5Moves;
    }

    public void setPlayer5Moves(String from, String to) {
        this.player5Moves = this.player5Moves + from + ">" + to + ";";
    }

    public String getPlayer6Moves() {
        return player6Moves;
    }

    public void setPlayer6Moves(String from, String to) {
        this.player6Moves = this.player6Moves + from + ">" + to + ";";
    }

    public String getPlayer7Moves() {
        return player7Moves;
    }

    public void setPlayer7Moves(String from, String to) {
        this.player7Moves = this.player7Moves + from + ">" + to + ";";
    }

    public String getPlayer8Moves() {
        return player8Moves;
    }

    public void setPlayer8Moves(String from, String to) {
        this.player8Moves = this.player8Moves + from + ">" + to + ";";
    }

    public void setPlayers(ArrayList<String> players){

        this.player1 = players.get(0);
        this.player2 = players.get(1);

        if(players.size() > 2) this.player3 = players.get(2);
        if(players.size() > 3) this.player4 = players.get(3);
        if(players.size() > 4) this.player5 = players.get(4);
        if(players.size() > 5) this.player6 = players.get(5);
        if(players.size() > 6) this.player7 = players.get(6);
        if(players.size() > 7) this.player8 = players.get(7);
    }

    public Boolean hasPlayer(String player){

        if(this.player1.equals(player)) return true;
        if(this.player2.equals(player)) return true;
        if(this.player3 != null && this.player3.equals(player)) return true;
        if(this.player4 != null && this.player4.equals(player)) return true;
        if(this.player5 != null && this.player5.equals(player)) return true;
        if(this.player6 != null && this.player6.equals(player)) return true;
        if(this.player7 != null && this.player7.equals(player)) return true;
        if(this.player8 != null && this.player8.equals(player)) return true;

        return false;
    }
}