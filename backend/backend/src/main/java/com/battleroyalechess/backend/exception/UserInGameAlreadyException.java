package com.battleroyalechess.backend.exception;

public class UserInGameAlreadyException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public UserInGameAlreadyException() {
        super("User is already in a game");
    }

    public UserInGameAlreadyException(String username) {
        super("User " + username + " is already in a game");
    }

}