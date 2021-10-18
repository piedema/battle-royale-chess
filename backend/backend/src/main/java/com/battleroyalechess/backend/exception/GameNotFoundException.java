package com.battleroyalechess.backend.exception;

public class GameNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public GameNotFoundException(Long gameId) {
        super("Cannot find game with gameId " + gameId);
    }
    public GameNotFoundException() {
        super("Game not found.");
    }

}