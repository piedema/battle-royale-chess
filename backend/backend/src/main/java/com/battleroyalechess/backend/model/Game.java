package com.battleroyalechess.backend.model;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.*;

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
    public Integer round = 0;

    @Column(nullable = false)
    public Long nextRoundAt;

    @Column(nullable = false)
    public Long gameStartedAt;

    @Column
    public Long gameEndedAt;

    @Column(nullable = false)
    public ArrayList<String> players = new ArrayList<>();

    @Column()
    public HashMap<Integer, ArrayList<String>> moves = new HashMap<>();

    @Column()
    public ArrayList<Integer> scores = new ArrayList<>();

    @Column()
    public HashMap<String, ArrayList<String>> board = new HashMap<>();

    public Long getNextRoundAt() {
        return nextRoundAt;
    }

    public void setNextRoundAt(Long nextRoundAt) {
        this.nextRoundAt = nextRoundAt;
    }

    public Long getGameStartedAt() {
        return gameStartedAt;
    }

    public void setGameStartedAt(Long gameStartedAt) {
        this.gameStartedAt = gameStartedAt;
    }

    public Long getGameEndedAt() {
        return gameEndedAt;
    }

    public void setGameEndedAt(Long gameEndedAt) {
        this.gameEndedAt = gameEndedAt;
    }

    public HashMap<String, ArrayList<String>> getBoard() {
        return board;
    }

    public void setBoard(HashMap<String, ArrayList<String>> board) {
        this.board = board;
    }

    public Integer getRound() {
        return round;
    }

    public void setRound(Integer round) {
        this.round = round;
    }

    public long getGameId() {
        return gameId;
    }

    public void setGameId(long gameId) {
        this.gameId = gameId;
    }

    public boolean isFinished() {
        return finished;
    }

    public void setFinished() {
        this.finished = true;
    }

    public String getGametype() {
        return gametype;
    }

    public void setGametype(String gametype) {
        this.gametype = gametype;
    }

    public ArrayList<String> getPlayers() {
        return players;
    }

    public void setPlayers(ArrayList<String> players) {
        this.players = players;

        for (String player: players) {
            this.scores.add(0);
        }
    }

    public HashMap<Integer, ArrayList<String>> getMoves() {
        return moves;
    }

    public void setMoves(HashMap<Integer, ArrayList<String>> moves) {
        this.moves = moves;
    }

    public ArrayList<Integer> getScores() {
        return scores;
    }

    public void setScores(ArrayList<Integer> scores) {
        this.scores = scores;
    }

    public Integer getScore(int index) {
        return scores.get(index);
    }

    public void setScore(int index, int score) {
        this.scores.set(index, score);
    }

    public void storeMoves(int round, Map<String, String> moves){
        ArrayList<String> movesToStore = new ArrayList<>();
        ArrayList<String> players = this.getPlayers();

        for (String currentPlayer : players) {
            if (moves.containsKey(currentPlayer)) movesToStore.add(moves.get(currentPlayer));
            if (!moves.containsKey(currentPlayer)) movesToStore.add(null);
        }

        this.moves.put(round, movesToStore);
    }

    public void incrementPlayerScore(String player, int points){
        int index = this.players.indexOf(player);

        this.setScore(index, this.getScore(index) + points);
    }

    public void decrementPlayerScore(String player, int points){
        int index = this.players.indexOf(player);

        this.setScore(index, this.getScore(index) - points);
    }
}