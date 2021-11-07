package com.battleroyalechess.backend.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;

@Entity
@Table(name = "gametypes")
public class Gametype {

    @Id
    @Column(nullable = false)
    public String gametype;

    @Column(nullable = false)
    public int numberOfPlayers;

    @Column(nullable = false)
    public int circleShrinkAfterNRounds;

    @Column(nullable = false)
    public int circleShrinkOffset;

    @Column(nullable = false)
    public int timePerRound;

    @Column(nullable = false)
    public int initialDelay;

    @Column(nullable = false)
    public HashMap<String, ArrayList<String>> board;

    @Column(nullable = false)
    public ArrayList<String> playerDirections;

    public String getGametype() {
        return gametype;
    }

    public void setGametype(String gametype) {
        this.gametype = gametype;
    }

    public int getNumberOfPlayers() {
        return numberOfPlayers;
    }

    public void setNumberOfPlayers(int numberOfPlayers) {
        this.numberOfPlayers = numberOfPlayers;
    }

    public int getCircleShrinkAfterNRounds() {
        return circleShrinkAfterNRounds;
    }

    public void setCircleShrinkAfterNRounds(int circleShrinkAfterNRounds) {
        this.circleShrinkAfterNRounds = circleShrinkAfterNRounds;
    }

    public int getCircleShrinkOffset() {
        return circleShrinkOffset;
    }

    public void setCircleShrinkOffset(int circleShrinkOffset) {
        this.circleShrinkOffset = circleShrinkOffset;
    }

    public int getTimePerRound() {
        return timePerRound;
    }

    public void setTimePerRound(int timePerRound) {
        this.timePerRound = timePerRound;
    }

    public int getInitialDelay() {
        return initialDelay;
    }

    public void setInitialDelay(int initialDelay) {
        this.initialDelay = initialDelay;
    }

    public HashMap<String, ArrayList<String>> getBoard() {
        return board;
    }

    public ArrayList<String> getBoard(String tile) {
        return board.get(tile);
    }

    public void setBoard(HashMap<String, ArrayList<String>> board) {
        this.board = board;
    }

    public ArrayList<String> getPlayerDirections() {
        return playerDirections;
    }

    public String getPlayerDirections(int index) {
        return playerDirections.get(index);
    }

    public void setPlayerDirections(ArrayList<String> playerDirections) {
        this.playerDirections = playerDirections;
    }
}