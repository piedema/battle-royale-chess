package com.battleroyalechess.backend.model;

import javax.persistence.*;
import java.util.ArrayList;

@Entity
@Table(name = "gametypes")
public class Gametype {

    @Id
    @Column(nullable = false)
    public String name;

    @Column(nullable = false)
    public int numberOfPlayers;

    @Column(nullable = false)
    public int numberOfRounds;

    @Column(nullable = false)
    public int circleShrinkAfterNRounds;

    @Column(nullable = false)
    public int circleShrinkOffset;

    @Column(nullable = false)
    public int timePerRound;

    @Column(nullable = false)
    public int initialDelay;

    @Column(nullable = false)
    public ArrayList<String> board;

    @Column(nullable = false)
    public ArrayList<String> playerDirections;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getNumberOfPlayers() {
        return numberOfPlayers;
    }

    public void setNumberOfPlayers(int numberOfPlayers) {
        this.numberOfPlayers = numberOfPlayers;
    }

    public int getNumberOfRounds() {
        return numberOfRounds;
    }

    public void setNumberOfRounds(int numberOfRounds) {
        this.numberOfRounds = numberOfRounds;
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

    public ArrayList<String> getBoard() {
        return board;
    }

    public void setBoard(ArrayList<String> board) {
        this.board = board;
    }

    public ArrayList<String> getPlayerDirections() {
        return playerDirections;
    }

    public void setPlayerDirections(ArrayList<String> playerDirections) {
        this.playerDirections = playerDirections;
    }
}