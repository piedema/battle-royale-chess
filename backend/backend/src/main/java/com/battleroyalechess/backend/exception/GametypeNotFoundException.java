package com.battleroyalechess.backend.exception;

public class GametypeNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public GametypeNotFoundException(String username) {
        super("Cannot find gametype: " + username);
    }
    public GametypeNotFoundException() {
        super("Gametype not found.");
    }

}