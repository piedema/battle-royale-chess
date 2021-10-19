package com.battleroyalechess.backend.exception;

public class EmailNotAvailableException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public EmailNotAvailableException() {
        super("Email already taken");
    }

    public EmailNotAvailableException(String email) {
        super("A user with email " + email + " already exists");
    }

}