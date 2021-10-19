package com.battleroyalechess.backend.exception;

public class InvalidAuthorityException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public InvalidAuthorityException() {
        super("Invalid authority");
    }

    public InvalidAuthorityException(String message) {
        super("Authority " + message + " is invalid");
    }
}