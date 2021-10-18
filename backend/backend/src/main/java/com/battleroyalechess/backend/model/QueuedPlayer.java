package com.battleroyalechess.backend.model;

public class QueuedPlayer {
    private String username;
    private String gametype;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getGametype() {
        return gametype;
    }

    public void setGametype(String gametype) {
        this.gametype = gametype;
    }
}