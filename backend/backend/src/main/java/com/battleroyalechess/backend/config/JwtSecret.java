package com.battleroyalechess.backend.config;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class JwtSecret {

    private static String key;

    // generating a new random key every server startup ensures people need to relogin after server reboot
    public JwtSecret(){

        key = UUID.randomUUID().toString();

    }

    public static String getKey(){

        return key;

    }
}
