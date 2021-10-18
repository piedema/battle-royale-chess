package com.battleroyalechess.backend.exception;

public class PlayerNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public PlayerNotFoundException(String username) {
        super("Cannot find player " + username);
    }
    public PlayerNotFoundException() {
        super("Player not found.");
    }

}