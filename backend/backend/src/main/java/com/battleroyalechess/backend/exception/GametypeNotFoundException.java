package com.battleroyalechess.backend.exception;

public class GametypeNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public GametypeNotFoundException() {
        super("Gametype not found.");
    }

    public GametypeNotFoundException(String gametype) {
        super("Cannot find gametype " + gametype);
    }

}