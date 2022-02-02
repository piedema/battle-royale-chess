package com.battleroyalechess.backend.dto.response;

public class PlayerResponse {

    private String username;
    private Integer score;
    private Integer gamesPlayed;
    private String chessCom;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getGamesPlayed() {
        return gamesPlayed;
    }

    public void setGamesPlayed(Integer gamesPlayed) {
        this.gamesPlayed = gamesPlayed;
    }

    public String getChessCom() {
        return chessCom;
    }

    public void setChessCom(String chessCom) {
        this.chessCom = chessCom;
    }
}