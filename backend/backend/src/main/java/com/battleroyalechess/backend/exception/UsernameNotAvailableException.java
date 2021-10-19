package com.battleroyalechess.backend.exception;

public class UsernameNotAvailableException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public UsernameNotAvailableException() {
        super("Username already taken");
    }

    public UsernameNotAvailableException(String username) {
        super("A user with username " + username + " already exists");
    }

}